import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import CategoryService from '../../../services/CategoryService';
import type { ListarCategoriaDto, CadastrarCategoriaDto } from '../../../types/Category';
import type { CategoryFormData } from '../types';

export function CategorySection() {
    const [categoriaData, setCategoriaData] = useState<CategoryFormData>({
        nome: '',
    });
    const [categorias, setCategorias] = useState<ListarCategoriaDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        carregarCategorias();
    }, []);

    const carregarCategorias = async () => {
        try {
            const categoriasData = await CategoryService.listarCategorias(true);
            setCategorias(categoriasData);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const handleCadastrarCategoria = async () => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!categoriaData.nome.trim()) {
            setErrorMessage("O nome da categoria é obrigatório.");
            setLoading(false);
            return;
        }

        try {
            const dto: CadastrarCategoriaDto = {
                nome: categoriaData.nome.trim()
            };

            await CategoryService.cadastrarCategoria(dto);
            setSuccessMessage("Categoria cadastrada com sucesso!");
            setCategoriaData({ nome: '' });
            carregarCategorias(); // Recarregar lista de categorias
        } catch (error: any) {
            console.error("Erro ao cadastrar categoria:", error);
            setErrorMessage(error.message || "Erro ao cadastrar categoria. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Cadastrar Nova Categoria</Typography>
            <TextField
                margin="dense"
                label="Nome da Categoria"
                fullWidth
                variant="outlined"
                value={categoriaData.nome}
                onChange={(e) => setCategoriaData({ nome: e.target.value })}
                sx={{ mb: 2 }}
            />

            {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

            <Button
                variant="contained"
                sx={{
                    mt: 3, backgroundColor: 'primary.dark', color: 'primary.contrastText',
                    '&:hover': {
                        backgroundColor: 'primary.light'
                    }
                }}
                onClick={handleCadastrarCategoria}
                disabled={loading}
            >
                Cadastrar Categoria
            </Button>

            {/* Lista de Categorias Existentes */}
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom>Categorias Existentes</Typography>
            <List>
                {categorias.map((categoria) => (
                    <ListItem key={categoria.id} sx={{ border: '1px solid #e0e0e0', mb: 1, borderRadius: 1 }}>
                        <ListItemText
                            primary={categoria.nome}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
} 