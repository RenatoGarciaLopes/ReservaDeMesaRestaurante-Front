import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { Table } from '../../../types/Table';
import type { ListarFuncionarioDto } from '../../../types/Employee';
import type { MenuItem as MenuItemType, Category } from '../types';
import CategoryService from '../../../services/CategoryService';
import MenuItemService from '../../../services/MenuItemService';
import ReservationService from '../../../services/ReservationService';
import OrderService from '../../../services/OrderService';

interface FazerPedidoSectionProps {
    table: Table | null;
    employee: ListarFuncionarioDto | null;
    onTableUpdate: () => void;
}

export function FazerPedidoSection({ table, employee, onTableUpdate }: FazerPedidoSectionProps) {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
    const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());

    // Carregar categorias ao abrir a seção
    useEffect(() => {
        loadCategories();
    }, []);

    // Carregar itens quando categoria for selecionada
    useEffect(() => {
        if (categories.length === 0) {
            // Ainda não carregou as categorias
            return;
        }
        
        // Sempre carregar itens quando selectedCategory mudar
        loadMenuItems(selectedCategory);
    }, [selectedCategory, categories]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const categorias = await CategoryService.listarCategorias(true); // apenas ativas
            setCategories(categorias);
            if (categorias.length > 0) {
                setSelectedCategory(null); // Começa com "Todos" selecionado
            }
        } catch (error: any) {
            setErrorMessage('Erro ao carregar categorias: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMenuItems = async (categoriaId: number | null) => {
        try {
            setLoading(true);
            
            if (categoriaId === null) {
                // Buscar todos os itens de todas as categorias
                const allItems: MenuItemType[] = [];
                
                if (categories.length === 0) {
                    setMenuItems([]);
                    return;
                }
                
                for (const categoria of categories) {
                    try {
                        const response = await MenuItemService.listarItens(0, 50, categoria.id);
                        // Filtrar apenas itens ativos
                        const itensAtivos = response.content.filter(item => item.ativo);
                        allItems.push(...itensAtivos);
                    } catch (error) {
                        // Ignora erros individuais de categoria
                    }
                }
                
                setMenuItems(allItems);
            } else {
                // Buscar itens de uma categoria específica
                const response = await MenuItemService.listarItens(0, 50, categoriaId);
                // Filtrar apenas itens ativos
                const itensAtivos = response.content.filter(item => item.ativo);
                setMenuItems(itensAtivos);
            }
        } catch (error: any) {
            setErrorMessage('Erro ao carregar itens: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (itemId: number, change: number) => {
        const currentQuantity = selectedItems.get(itemId) || 0;
        const newQuantity = Math.max(0, currentQuantity + change);
        
        const newSelectedItems = new Map(selectedItems);
        if (newQuantity === 0) {
            newSelectedItems.delete(itemId);
        } else {
            newSelectedItems.set(itemId, newQuantity);
        }
        setSelectedItems(newSelectedItems);
    };

    /**
     * Realiza o pedido para a mesa ocupada.
     * 1. Busca a reserva ativa da mesa.
     * 2. Monta o DTO do pedido com os itens selecionados e funcionário logado.
     * 3. Chama o endpoint de criação de pedido.
     * 4. Exibe feedback de sucesso ou erro.
     */
    const handleRealizarPedido = async (): Promise<void> => {
        if (selectedItems.size === 0) {
            setErrorMessage('Selecione pelo menos um item para fazer o pedido.');
            return;
        }

        try {
            setLoading(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            // 1. Buscar reserva ativa da mesa
            if (!table || !employee) throw new Error('Mesa ou funcionário não informado.');
            const reserva = await ReservationService.getReservaAtivaPorMesa(table.id);
            if (!reserva) throw new Error('Não foi encontrada uma reserva ativa para esta mesa.');

            // 2. Montar DTO do pedido
            const pedidos = Array.from(selectedItems.entries()).map(([itemId, quantidade]) => ({
                itemId,
                quantidade
            }));
            const dto = {
                reservaId: reserva.id,
                funcionarioId: employee.id,
                pedidos
            };

            // 3. Chamar serviço de pedido
            await OrderService.criarPedido(dto);

            setSuccessMessage('Pedido realizado com sucesso!');
            setSelectedItems(new Map());
            onTableUpdate();
        } catch (error: any) {
            setErrorMessage('Erro ao realizar pedido: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getTotalPrice = () => {
        let total = 0;
        selectedItems.forEach((quantity, itemId) => {
            const item = menuItems.find(item => item.id === itemId);
            if (item) {
                total += item.preco * quantity;
            }
        });
        return total;
    };

    // Função para agrupar itens por categoria
    const getItemsGroupedByCategory = () => {
        if (selectedCategory !== null) {
            // Se uma categoria específica está selecionada, não precisa agrupar
            const categoriaNome = categories.find(c => c.id === selectedCategory)?.nome || '';
            return [{ categoria: categoriaNome, items: menuItems }];
        }

        // Agrupar itens por categoria
        const grouped: { categoria: string; items: MenuItemType[] }[] = [];
        
        categories.forEach(categoria => {
            const itemsInCategory = menuItems.filter(item => item.categoria === categoria.nome);
            if (itemsInCategory.length > 0) {
                grouped.push({
                    categoria: categoria.nome,
                    items: itemsInCategory
                });
            }
        });

        return grouped;
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Fazer pedido: <b>nº: {table?.number} | {table?.capacity} Lugares</b>
            </Typography>

            <TextField
                select
                label="Categoria:"
                value={selectedCategory === null ? 'todos' : selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value === 'todos' ? null : Number(e.target.value))}
                fullWidth
                sx={{ mb: 3, maxWidth: 300 }}
            >
                <MenuItem value="todos">
                    Todos
                </MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.nome}
                    </MenuItem>
                ))}
            </TextField>

            {loading && <CircularProgress size={24} sx={{ mb: 2 }} />}

            <Box sx={{ mb: 3 }}>
                {getItemsGroupedByCategory().map((group, groupIndex) => (
                    <Box key={groupIndex} sx={{ mb: 4 }}>
                        {selectedCategory === null && group.categoria && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h5" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                                    {group.categoria}
                                </Typography>
                                <Box sx={{ height: 2, backgroundColor: 'primary.main', borderRadius: 1 }} />
                            </Box>
                        )}
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                            {group.items.map((item) => {
                                const quantity = selectedItems.get(item.id) || 0;
                                return (
                                    <Card key={item.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={item.imagemUrl || '/placeholder-food.jpg'}
                                            alt={item.nome}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {item.nome}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                                                {item.descricao}
                                            </Typography>
                                            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                                R$ {item.preco.toFixed(2)}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <IconButton
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    disabled={quantity === 0}
                                                    color="error"
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography variant="h6" sx={{ mx: 2 }}>
                                                    {quantity}
                                                </Typography>
                                                <IconButton
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    color="success"
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
            </Box>

            {selectedItems.size > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Total do pedido: R$ {getTotalPrice().toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleRealizarPedido}
                        disabled={loading}
                        sx={{ mt: 1 }}
                    >
                        Realizar pedido
                    </Button>
                </Box>
            )}

            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
        </Box>
    );
} 