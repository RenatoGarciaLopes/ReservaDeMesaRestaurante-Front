import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    Alert,
    InputAdornment,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Menu,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CategoryService from '../../../services/CategoryService';
import MenuItemService from '../../../services/MenuItemService';
import type { ListarCategoriaDto } from '../../../types/Category';
import type { ListarItensDto, CadastrarItensDto } from '../../../types/MenuItem';
import type { EditMenuItemFormData, MenuItemFormData } from '../types';

export function ManageMenuSection() {
    const [menuItems, setMenuItems] = useState<ListarItensDto[]>([]);
    const [categorias, setCategorias] = useState<ListarCategoriaDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtroCategoria, setFiltroCategoria] = useState<number | ''>('');
    const [filtroStatus, setFiltroStatus] = useState<string>('');
    const [busca, setBusca] = useState('');
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    // Estados para menu de ações
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<ListarItensDto | null>(null);

    // Estados para cadastro de novos itens
    const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
    const [itemData, setItemData] = useState<MenuItemFormData>({
        nome: '',
        descricao: '',
        preco: '',
        categoriaId: '',
        imagem: null,
    });
    const [cadastroLoading, setCadastroLoading] = useState(false);
    const [cadastroSuccess, setCadastroSuccess] = useState<string | null>(null);
    const [cadastroError, setCadastroError] = useState<string | null>(null);

    // Estados para edição
    const [editarModalOpen, setEditarModalOpen] = useState(false);
    const [itemEmEdicao, setItemEmEdicao] = useState<ListarItensDto | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<EditMenuItemFormData>({
        nome: '',
        descricao: '',
        preco: 0,
        categoriaId: 0,
    });

    useEffect(() => {
        carregarCategorias();
        carregarMenuItems();
    }, []);

    const carregarCategorias = async () => {
        try {
            const categoriasData = await CategoryService.listarCategorias(true);
            setCategorias(categoriasData);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const carregarMenuItems = async () => {
        setLoading(true);
        try {
            const res = await MenuItemService.listarItens(0, 100);
            console.log('Itens carregados:', res.content);
            setMenuItems(res.content);
        } catch (e) {
            console.error('Erro ao carregar itens:', e);
        } finally {
            setLoading(false);
        }
    };

    // Funções para o menu de ações
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: ListarItensDto) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };

    const handleEditarClick = () => {
        if (selectedItem) {
            handleEditarItem(selectedItem);
        }
        handleMenuClose();
    };

    const handleInativarClick = () => {
        if (selectedItem) {
            handleInativarItem(selectedItem.id);
        }
        handleMenuClose();
    };

    const handleReativarClick = () => {
        if (selectedItem) {
            handleReativarItem(selectedItem.id);
        }
        handleMenuClose();
    };

    // Função para abrir modal de cadastro
    const handleAbrirCadastro = () => {
        setCadastroModalOpen(true);
        setItemData({
            nome: '',
            descricao: '',
            preco: '',
            categoriaId: '',
            imagem: null,
        });
        setCadastroSuccess(null);
        setCadastroError(null);
    };

    // Função para fechar modal de cadastro
    const handleFecharCadastro = () => {
        setCadastroModalOpen(false);
        setItemData({
            nome: '',
            descricao: '',
            preco: '',
            categoriaId: '',
            imagem: null,
        });
        setCadastroSuccess(null);
        setCadastroError(null);
    };

    // Função para cadastrar novo item
    const handleCadastrarItem = async () => {
        setCadastroLoading(true);
        setCadastroSuccess(null);
        setCadastroError(null);

        if (!itemData.nome.trim()) {
            setCadastroError("O nome do item é obrigatório.");
            setCadastroLoading(false);
            return;
        }

        if (!itemData.preco || parseFloat(itemData.preco) <= 0) {
            setCadastroError("O preço deve ser maior que zero.");
            setCadastroLoading(false);
            return;
        }

        if (!itemData.categoriaId) {
            setCadastroError("A categoria é obrigatória.");
            setCadastroLoading(false);
            return;
        }

        try {
            let imagemUrl: string | undefined;

            // Se há uma imagem selecionada, fazer upload primeiro
            if (itemData.imagem) {
                try {
                    // Fazer upload da imagem primeiro (usando um ID temporário)
                    // Como o backend precisa do ID do item, vamos criar um item temporário
                    const itemTemp = await MenuItemService.cadastrarItem({
                        nome: itemData.nome.trim(),
                        descricao: itemData.descricao.trim() || undefined,
                        preco: parseFloat(itemData.preco),
                        categoriaId: itemData.categoriaId as number
                    });

                    // Fazer upload da imagem
                    const urlRelativa = await MenuItemService.uploadImagem(itemTemp.id, itemData.imagem);
                    
                    // Construir a URL completa usando o endpoint correto das imagens
                    // urlRelativa contém apenas o nome do arquivo (ex: "imagem-item_2.jpg")
                    imagemUrl = `http://localhost:8080/api/itens/imagem/${urlRelativa}`;
                    
                    // Atualizar o item com a URL completa da imagem
                    await MenuItemService.updateItem(itemTemp.id, {
                        imagemUrl: imagemUrl
                    });

                } catch (uploadError: any) {
                    console.error("Erro no upload da imagem:", uploadError);
                    // Se o upload falhar, o item já foi criado, então não precisamos fazer nada
                }
            } else {
                // Cadastrar item sem imagem
                await MenuItemService.cadastrarItem({
                    nome: itemData.nome.trim(),
                    descricao: itemData.descricao.trim() || undefined,
                    preco: parseFloat(itemData.preco),
                    categoriaId: itemData.categoriaId as number
                });
            }

            setCadastroSuccess("Item cadastrado com sucesso!");
            setTimeout(() => {
                handleFecharCadastro();
                carregarMenuItems(); // Recarregar a lista
            }, 1500);
        } catch (error: any) {
            console.error("Erro ao cadastrar item:", error);
            setCadastroError(error.message || "Erro ao cadastrar item. Tente novamente.");
        } finally {
            setCadastroLoading(false);
        }
    };

    const handleImagemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setItemData(prev => ({ ...prev, imagem: file }));
        }
    };

    // Filtro dos itens
    const itensFiltrados = menuItems.filter(item => {
        if (filtroCategoria && item.categoria !== categorias.find(c => c.id === filtroCategoria)?.nome) return false;
        if (filtroStatus === 'ativo' && item.ativo !== true) return false;
        if (filtroStatus === 'inativo' && item.ativo === true) return false;
        if (busca && !item.nome.toLowerCase().includes(busca.toLowerCase())) return false;
        return true;
    });

    const handleEditarItem = (item: ListarItensDto) => {
        setItemEmEdicao(item);
        setEditForm({
            nome: item.nome,
            descricao: item.descricao,
            preco: item.preco,
            categoriaId: categorias.find(c => c.nome === item.categoria)?.id || 0,
            imagemUrl: item.imagemUrl,
        });
        setEditarModalOpen(true);
        setEditError(null);
    };

    const handleSalvarEdicao = async (dados: Partial<CadastrarItensDto & { imagem?: File }>) => {
        if (!itemEmEdicao) return;
        setEditLoading(true);
        setEditError(null);
        try {
            let imagemUrl = itemEmEdicao.imagemUrl;
            if (dados.imagem) {
                imagemUrl = `http://localhost:8080/api/itens/imagem/` + await MenuItemService.uploadImagem(itemEmEdicao.id, dados.imagem);
            }
            await MenuItemService.updateItem(itemEmEdicao.id, {
                ...dados,
                imagemUrl,
            });
            setEditarModalOpen(false);
            carregarMenuItems();
        } catch (e: any) {
            setEditError(e.message || 'Erro ao salvar edição.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleInativarItem = async (id: number) => {
        try {
            await MenuItemService.inativarItem(id);
            carregarMenuItems();
            setActionMessage("Item inativado com sucesso!");
            setActionError(null);
        } catch (error: any) {
            setActionError(error.message || "Erro ao inativar item. Tente novamente.");
            setActionMessage(null);
        }
    };

    const handleReativarItem = async (id: number) => {
        try {
            await MenuItemService.reativarItem(id);
            carregarMenuItems();
            setActionMessage("Item reativado com sucesso!");
            setActionError(null);
        } catch (error: any) {
            setActionError(error.message || "Erro ao reativar item. Tente novamente.");
            setActionMessage(null);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Gerenciar Itens do Cardápio</Typography>
            </Box>
            
            {/* Filtros */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ width: 250 }}>
                        <InputLabel id="categoria-label">Categoria</InputLabel>
                        <Select 
                            labelId="categoria-label"
                            value={filtroCategoria} 
                            onChange={e => setFiltroCategoria(e.target.value as number | '')}
                            label="Categoria"
                        >
                            <MenuItem value="">Todas</MenuItem>
                            {categorias.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ width: 180 }}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select 
                            labelId="status-label"
                            value={filtroStatus} 
                            onChange={e => setFiltroStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="ativo">Ativos</MenuItem>
                            <MenuItem value="inativo">Inativos</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAbrirCadastro}
                        sx={{
                            backgroundColor: 'primary.dark', 
                            color: 'primary.contrastText',
                            px: 2,
                            py: 1,
                            whiteSpace: 'nowrap',
                            '&:hover': {
                                backgroundColor: 'primary.light'
                            }
                        }}
                    >
                        Novo Item
                    </Button>
                </Box>
                <TextField
                    size="small"
                    placeholder="Buscar por nome"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ 
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            height: 40
                        }
                    }}
                />
            </Box>
            {actionMessage && <Alert severity="success" sx={{ mb: 2 }}>{actionMessage}</Alert>}
            {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 3,
                    mb: 3
                }}
            >
                {loading ? (
                    <Box sx={{ gridColumn: '1/-1', textAlign: 'center' }}><CircularProgress /></Box>
                ) : itensFiltrados.length === 0 ? (
                    <Box sx={{ gridColumn: '1/-1', textAlign: 'center' }}><Typography align="center">Nenhum item encontrado.</Typography></Box>
                ) : itensFiltrados.map(item => (
                    <Card key={item.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <CardMedia
                                component="img"
                                height="180"
                                image={item.imagemUrl || '/placeholder-food.jpg'}
                                alt={item.nome}
                                sx={{ objectFit: 'cover', borderRadius: 2, borderBottom: '1px solid #eee' }}
                            />
                            <Chip
                                label={item.categoria}
                                size="small"
                                sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
                            />
                            {item.ativo === true ? (
                                <Chip
                                    label="Ativo"
                                    size="small"
                                    color="success"
                                    sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 600 }}
                                />
                            ) : (
                                <Chip
                                    label="Inativo"
                                    size="small"
                                    color="error"
                                    sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 600 }}
                                />
                            )}
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{item.nome}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 32 }} noWrap>{item.descricao}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" color="primary" fontWeight={700}>
                                    R$ {item.preco.toFixed(2)}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, item)}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Menu de ações */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEditarClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                {selectedItem?.ativo === true ? (
                    <MenuItem onClick={handleInativarClick}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>Inativar</ListItemText>
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleReativarClick}>
                        <ListItemIcon>
                            <RestoreIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText sx={{ color: 'success.main' }}>Reativar</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            {/* Modal de Cadastro */}
            <Dialog open={cadastroModalOpen} onClose={handleFecharCadastro} maxWidth="sm" fullWidth>
                <DialogTitle>Cadastrar Novo Item</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nome do Item"
                        fullWidth
                        variant="outlined"
                        value={itemData.nome}
                        onChange={(e) => setItemData(prev => ({ ...prev, nome: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={itemData.descricao}
                        onChange={(e) => setItemData(prev => ({ ...prev, descricao: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Preço"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={itemData.preco}
                        onChange={(e) => setItemData(prev => ({ ...prev, preco: e.target.value }))}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                        <InputLabel>Categoria</InputLabel>
                        <Select
                            value={itemData.categoriaId}
                            label="Categoria"
                            onChange={(e) => setItemData(prev => ({ ...prev, categoriaId: e.target.value as number }))}
                        >
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ mb: 3 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="imagem-item"
                            type="file"
                            onChange={handleImagemChange}
                        />
                        <label htmlFor="imagem-item">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                sx={{ mb: 1 }}
                            >
                                {itemData.imagem ? `Imagem selecionada: ${itemData.imagem.name}` : 'Selecionar Imagem'}
                            </Button>
                        </label>
                    </Box>

                    {cadastroSuccess && <Alert severity="success" sx={{ mb: 2 }}>{cadastroSuccess}</Alert>}
                    {cadastroError && <Alert severity="error" sx={{ mb: 2 }}>{cadastroError}</Alert>}

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button onClick={handleFecharCadastro}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCadastrarItem}
                            disabled={cadastroLoading}
                            sx={{
                                backgroundColor: 'primary.dark', color: 'primary.contrastText',
                                '&:hover': {
                                    backgroundColor: 'primary.light'
                                }
                            }}
                        >
                            {cadastroLoading ? <CircularProgress size={24} /> : 'Cadastrar Item'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Modal de Edição */}
            <Dialog open={editarModalOpen} onClose={() => setEditarModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Item</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nome do Item"
                        fullWidth
                        variant="outlined"
                        value={editForm.nome}
                        onChange={e => setEditForm({ ...editForm, nome: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Descrição"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={editForm.descricao || ''}
                        onChange={e => setEditForm({ ...editForm, descricao: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Preço"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={editForm.preco}
                        onChange={e => setEditForm({ ...editForm, preco: parseFloat(e.target.value) })}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                        <InputLabel>Categoria</InputLabel>
                        <Select
                            value={editForm.categoriaId}
                            label="Categoria"
                            onChange={e => setEditForm({ ...editForm, categoriaId: e.target.value as number })}
                        >
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ mb: 3 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="imagem-item-edit"
                            type="file"
                            onChange={e => setEditForm({ ...editForm, imagem: e.target.files?.[0] })}
                        />
                        <label htmlFor="imagem-item-edit">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                sx={{ mb: 1 }}
                            >
                                {editForm.imagem ? `Imagem selecionada: ${editForm.imagem.name}` : 'Selecionar Nova Imagem'}
                            </Button>
                        </label>
                        {/* Preview da imagem */}
                        {(editForm.imagem || editForm.imagemUrl) && (
                            <Box sx={{ textAlign: 'center', mt: 1 }}>
                                <img
                                    src={editForm.imagem ? URL.createObjectURL(editForm.imagem) : editForm.imagemUrl}
                                    alt="Preview"
                                    style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8 }}
                                />
                            </Box>
                        )}
                    </Box>
                    {editError && <Alert severity="error" sx={{ mt: 2 }}>{editError}</Alert>}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button onClick={() => setEditarModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'primary.dark', color: 'primary.contrastText',
                                '&:hover': {
                                    backgroundColor: 'primary.light'
                                }
                            }}
                            onClick={() => handleSalvarEdicao(editForm)}
                            disabled={editLoading}
                        >
                            {editLoading ? <CircularProgress size={24} /> : 'Salvar Edição'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
} 