// src/shared/components/SettingsModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import RestaurantIcon from '@mui/icons-material/Restaurant';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import EmployeeService from '../services/EmployeeService';
import CategoryService from '../services/CategoryService';
import MenuItemService from '../services/MenuItemService';
import type { Cargo } from '../types/Employee';
import type { ListarCategoriaDto, CadastrarCategoriaDto } from '../types/Category';
import type { CadastrarItensDto, ListarItensDto } from '../types/MenuItem';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { employee, logout, login } = useAuth();

  const [currentSection, setCurrentSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

  // Estados para os campos do formulário de perfil
  const [nome, setNome] = useState(employee?.nome || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [telefone, setTelefone] = useState(employee?.telefone || '');
  const [cargo, setCargo] = useState<Cargo>(employee?.cargo || 'GARCOM'); // Defina um valor padrão ou null
  const [cpf, setCpf] = useState(employee?.cpf || ''); // CPF será exibido, mas não editável

  // Estados para os campos de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Estados para cadastro de categoria
  const [categoriaNome, setCategoriaNome] = useState('');
  const [categoriaLoading, setCategoriaLoading] = useState(false);
  const [categoriaSuccessMessage, setCategoriaSuccessMessage] = useState<string | null>(null);
  const [categoriaErrorMessage, setCategoriaErrorMessage] = useState<string | null>(null);

  // Estados para cadastro de item
  const [itemNome, setItemNome] = useState('');
  const [itemDescricao, setItemDescricao] = useState('');
  const [itemPreco, setItemPreco] = useState('');
  const [itemCategoriaId, setItemCategoriaId] = useState<number | ''>('');
  const [itemImagem, setItemImagem] = useState<File | null>(null);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemSuccessMessage, setItemSuccessMessage] = useState<string | null>(null);
  const [itemErrorMessage, setItemErrorMessage] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<ListarCategoriaDto[]>([]);

  // Adicione os estados:
  const [menuItems, setMenuItems] = useState<ListarItensDto[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<number | ''>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState<ListarItensDto | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [editForm, setEditForm] = useState<CadastrarItensDto & { imagem?: File }>({ nome: '', preco: 0, categoriaId: 0 });
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (open && employee) {
      setNome(employee.nome);
      setEmail(employee.email);
      setTelefone(employee.telefone);
      setCargo(employee.cargo);
      setCpf(employee.cpf);
      setSuccessMessage(null);
      setErrorMessage(null);
      setPasswordSuccessMessage(null);
      setPasswordErrorMessage(null);

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    }
  }, [open, employee]);

  // Carregar categorias quando o modal abrir
  useEffect(() => {
    if (open) {
      carregarCategorias();
    }
  }, [open]);

  // Carregar itens do cardápio
  useEffect(() => {
    if (open && currentSection === 'manageMenu') {
      carregarMenuItems();
    }
  }, [open, currentSection]);

  const carregarCategorias = async () => {
    try {
      const categoriasData = await CategoryService.listarCategorias(true);
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const carregarMenuItems = async () => {
    setMenuLoading(true);
    try {
      const res = await MenuItemService.listarItens(0, 100);
      console.log('Itens carregados:', res.content); // Debug
      setMenuItems(res.content);
    } catch (e) {
      console.error('Erro ao carregar itens:', e);
    } finally {
      setMenuLoading(false);
    }
  };

  // Atualize o filtro:
  const itensFiltrados = menuItems.filter(item => {
    if (filtroCategoria && item.categoria !== categorias.find(c => c.id === filtroCategoria)?.nome) return false;
    if (filtroStatus === 'ativo' && item.ativo !== true) return false;
    if (filtroStatus === 'inativo' && item.ativo === true) return false;
    if (busca && !item.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!employee) {
      setErrorMessage("Nenhum funcionário logado para atualizar.");
      setLoading(false);
      return;
    }

    // Validação de permissão para alterar cargo para GERENTE
    if (cargo === 'GERENTE' && employee.cargo !== 'GERENTE') {
      setErrorMessage("Apenas gerentes podem alterar o cargo para GERENTE.");
      setLoading(false);
      return;
    }

    try {
      const telefoneLimpo = telefone.replace(/[^\d()]/g, '');

      const updatedEmployeeData = {
        nome,
        email,
        telefone: telefoneLimpo,
        cargo
      };

      await EmployeeService.updateEmployee(employee.id, updatedEmployeeData);

      setSuccessMessage("Dados atualizados com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar dados do funcionário:", error);
      setErrorMessage(error.message || "Erro ao atualizar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setPasswordSuccessMessage(null);
    setPasswordErrorMessage(null);

    if (!employee) {
      setPasswordErrorMessage("Nenhum funcionário logado para alterar senha.");
      setPasswordLoading(false);
      return;
    }

    // Validações mais robustas
    if (!senhaAtual.trim()) {
      setPasswordErrorMessage("A senha atual é obrigatória.");
      setPasswordLoading(false);
      return;
    }

    if (!novaSenha.trim()) {
      setPasswordErrorMessage("A nova senha é obrigatória.");
      setPasswordLoading(false);
      return;
    }

    if (!confirmarSenha.trim()) {
      setPasswordErrorMessage("A confirmação da nova senha é obrigatória.");
      setPasswordLoading(false);
      return;
    }

    if (novaSenha.trim() !== confirmarSenha.trim()) {
      setPasswordErrorMessage("A nova senha e a confirmação não coincidem.");
      setPasswordLoading(false);
      return;
    }

    if (novaSenha.trim().length < 6) {
      setPasswordErrorMessage("A nova senha deve ter pelo menos 6 caracteres.");
      setPasswordLoading(false);
      return;
    }

    if (senhaAtual.trim() === novaSenha.trim()) {
      setPasswordErrorMessage("A nova senha deve ser diferente da senha atual.");
      setPasswordLoading(false);
      return;
    }

    try {
      await EmployeeService.changePassword(employee.email, {
        senhaAtual: senhaAtual.trim(),
        novaSenha: novaSenha.trim(),
        confirmarNovaSenha: confirmarSenha.trim()
      });

      setPasswordSuccessMessage("Senha alterada com sucesso!");

      // Limpar campos de senha
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      // Ocultar senhas
      setShowSenhaAtual(false);
      setShowNovaSenha(false);
      setShowConfirmarSenha(false);
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      setPasswordErrorMessage(error.message || "Erro ao alterar senha. Tente novamente.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Função para formatar o telefone enquanto o usuário digita
  const formatTelefone = (value: string) => {
    const numericValue = value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (numericValue.length <= 2) return numericValue;
    if (numericValue.length <= 6) return `(${numericValue.slice(0, 2)})${numericValue.slice(2)}`;
    if (numericValue.length <= 10) return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  const handleCadastrarCategoria = async () => {
    setCategoriaLoading(true);
    setCategoriaSuccessMessage(null);
    setCategoriaErrorMessage(null);

    if (!categoriaNome.trim()) {
      setCategoriaErrorMessage("O nome da categoria é obrigatório.");
      setCategoriaLoading(false);
      return;
    }

    try {
      const dto: CadastrarCategoriaDto = {
        nome: categoriaNome.trim()
      };

      await CategoryService.cadastrarCategoria(dto);
      setCategoriaSuccessMessage("Categoria cadastrada com sucesso!");
      setCategoriaNome('');
      carregarCategorias(); // Recarregar lista de categorias
    } catch (error: any) {
      console.error("Erro ao cadastrar categoria:", error);
      setCategoriaErrorMessage(error.message || "Erro ao cadastrar categoria. Tente novamente.");
    } finally {
      setCategoriaLoading(false);
    }
  };

  const handleCadastrarItem = async () => {
    setItemLoading(true);
    setItemSuccessMessage(null);
    setItemErrorMessage(null);

    if (!itemNome.trim()) {
      setItemErrorMessage("O nome do item é obrigatório.");
      setItemLoading(false);
      return;
    }

    if (!itemPreco || parseFloat(itemPreco) <= 0) {
      setItemErrorMessage("O preço deve ser maior que zero.");
      setItemLoading(false);
      return;
    }

    if (!itemCategoriaId) {
      setItemErrorMessage("A categoria é obrigatória.");
      setItemLoading(false);
      return;
    }

    try {
      let imagemUrl: string | undefined;

      // Se há uma imagem selecionada, fazer upload primeiro
      if (itemImagem) {
        try {
          // Fazer upload da imagem primeiro (usando um ID temporário)
          // Como o backend precisa do ID do item, vamos criar um item temporário
          const itemTemp = await MenuItemService.cadastrarItem({
            nome: itemNome.trim(),
            descricao: itemDescricao.trim() || undefined,
            preco: parseFloat(itemPreco),
            categoriaId: itemCategoriaId as number
          });

          // Fazer upload da imagem
          const urlRelativa = await MenuItemService.uploadImagem(itemTemp.id, itemImagem);
          
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
          nome: itemNome.trim(),
          descricao: itemDescricao.trim() || undefined,
          preco: parseFloat(itemPreco),
          categoriaId: itemCategoriaId as number
        });
      }

      setItemSuccessMessage("Item cadastrado com sucesso!");
      setItemNome('');
      setItemDescricao('');
      setItemPreco('');
      setItemCategoriaId('');
      setItemImagem(null);
    } catch (error: any) {
      console.error("Erro ao cadastrar item:", error);
      setItemErrorMessage(error.message || "Erro ao cadastrar item. Tente novamente.");
    } finally {
      setItemLoading(false);
    }
  };

  const handleImagemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setItemImagem(file);
    }
  };

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: 870,
          height: 770,
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Configurações
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Barra Lateral */}
          <Box
            sx={{
              width: 200,
              flexShrink: 0,
              borderRight: '1px solid #e0e0e0',
              backgroundColor: '#f8f8f8',
            }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setCurrentSection('profile')} selected={currentSection === 'profile'}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Perfil" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setCurrentSection('category')} selected={currentSection === 'category'}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Categorias" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setCurrentSection('menu')} selected={currentSection === 'menu'}>
                  <ListItemIcon>
                    <RestaurantIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cardápio" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setCurrentSection('manageMenu')} selected={currentSection === 'manageMenu'}>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gerenciar Cardápio" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Conteúdo Principal do Modal */}
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            {currentSection === 'profile' && employee && (
              <Box>
                <Typography variant="h6" gutterBottom>Meu Perfil</Typography>
                <TextField
                  margin="dense"
                  label="Nome"
                  fullWidth
                  variant="outlined"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Telefone"
                  fullWidth
                  variant="outlined"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  inputProps={{ maxLength: 15 }} // Ex: (XX)XXXXX-XXXX
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                  <InputLabel>Cargo</InputLabel>
                  <Select
                    value={cargo}
                    label="Cargo"
                    onChange={(e) => setCargo(e.target.value as Cargo)}
                  >
                    {/* Filtra as opções baseado no cargo atual do funcionário */}
                    {/* REGRA DE NEGÓCIO: Apenas GERENTES podem alterar cargo para GERENTE */}
                    {Object.values(CargoOptions)
                      .filter((option) => {
                        // Se o funcionário atual é GERENTE, pode escolher qualquer cargo
                        if (employee.cargo === 'GERENTE') {
                          return true;
                        }
                        // Se não é GERENTE, não pode escolher o cargo GERENTE
                        return option !== 'GERENTE';
                      })
                      .map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="CPF"
                  fullWidth
                  variant="outlined"
                  value={cpf}
                  disabled // CPF não editável
                  sx={{ mb: 2, '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000000', opacity: 1 } }}
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
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  Atualizar dados
                </Button>

                {/* Seção de Alteração de Senha */}
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" gutterBottom>Alterar Senha</Typography>

                <TextField
                  margin="dense"
                  label="Senha Atual"
                  type={showSenhaAtual ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                          edge="end"
                        >
                          {showSenhaAtual ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="dense"
                  label="Nova Senha"
                  type={showNovaSenha ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNovaSenha(!showNovaSenha)}
                          edge="end"
                        >
                          {showNovaSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="dense"
                  label="Confirmar Nova Senha"
                  type={showConfirmarSenha ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                          edge="end"
                        >
                          {showConfirmarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {passwordLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
                {passwordSuccessMessage && <Alert severity="success" sx={{ mt: 2 }}>{passwordSuccessMessage}</Alert>}
                {passwordErrorMessage && <Alert severity="error" sx={{ mt: 2 }}>{passwordErrorMessage}</Alert>}

                <Button
                  variant="contained"
                  sx={{
                    mt: 3, backgroundColor: 'primary.dark', color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.light'
                    }
                  }}
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                >
                  Alterar Senha
                </Button>

                <Button
                  variant="outlined"
                  color="error" // Cor de erro para o botão de sair
                  sx={{ mt: 2, display: 'block' }} // display: block para quebrar linha
                  onClick={handleLogout}
                  disabled={loading || passwordLoading}
                >
                  Sair do perfil
                </Button>
              </Box>
            )}
            {/* Seção de Cadastro de Categorias */}
            {currentSection === 'category' && (
              <Box>
                <Typography variant="h6" gutterBottom>Cadastrar Nova Categoria</Typography>
                <TextField
                  margin="dense"
                  label="Nome da Categoria"
                  fullWidth
                  variant="outlined"
                  value={categoriaNome}
                  onChange={(e) => setCategoriaNome(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {categoriaLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
                {categoriaSuccessMessage && <Alert severity="success" sx={{ mt: 2 }}>{categoriaSuccessMessage}</Alert>}
                {categoriaErrorMessage && <Alert severity="error" sx={{ mt: 2 }}>{categoriaErrorMessage}</Alert>}

                <Button
                  variant="contained"
                  sx={{
                    mt: 3, backgroundColor: 'primary.dark', color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.light'
                    }
                  }}
                  onClick={handleCadastrarCategoria}
                  disabled={categoriaLoading}
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
            )}

            {/* Seção de Cadastro de Itens do Cardápio */}
            {currentSection === 'menu' && (
              <Box>
                <Typography variant="h6" gutterBottom>Cadastrar Novo Item</Typography>
                <TextField
                  margin="dense"
                  label="Nome do Item"
                  fullWidth
                  variant="outlined"
                  value={itemNome}
                  onChange={(e) => setItemNome(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Descrição"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  value={itemDescricao}
                  onChange={(e) => setItemDescricao(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Preço"
                  fullWidth
                  variant="outlined"
                  type="number"
                  value={itemPreco}
                  onChange={(e) => setItemPreco(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={itemCategoriaId}
                    label="Categoria"
                    onChange={(e) => setItemCategoriaId(e.target.value as number)}
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
                      {itemImagem ? `Imagem selecionada: ${itemImagem.name}` : 'Selecionar Imagem'}
                    </Button>
                  </label>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'primary.dark', color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.light'
                    }
                  }}
                  onClick={handleCadastrarItem}
                  disabled={itemLoading}
                >
                  Cadastrar Item
                </Button>

                {itemLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
                {itemSuccessMessage && <Alert severity="success" sx={{ mt: 2 }}>{itemSuccessMessage}</Alert>}
                {itemErrorMessage && <Alert severity="error" sx={{ mt: 2 }}>{itemErrorMessage}</Alert>}
              </Box>
            )}

            {/* Seção de Gerenciar Cardápio */}
            {currentSection === 'manageMenu' && (
              <Box>
                <Typography variant="h6" gutterBottom>Gerenciar Itens do Cardápio</Typography>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Categoria</InputLabel>
                    <Select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value as number | '')}>
                      <MenuItem value="">Todas</MenuItem>
                      {categorias.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="ativo">Ativos</MenuItem>
                      <MenuItem value="inativo">Inativos</MenuItem>
                    </Select>
                  </FormControl>
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
                    sx={{ minWidth: 220 }}
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
                  {menuLoading ? (
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
                          <Typography variant="h5" color="primary" fontWeight={700}>
                            R$ {item.preco.toFixed(2)}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                          <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditarItem(item)}>
                            Editar
                          </Button>
                          {item.ativo === true ? (
                            <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleInativarItem(item.id)}>
                              Inativar
                            </Button>
                          ) : (
                            <Button size="small" color="success" startIcon={<RestoreIcon />} onClick={() => handleReativarItem(item.id)}>
                              Reativar
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                  ))}
                </Box>
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
                      Salvar Edição
                    </Button>
                    <Button onClick={() => setEditarModalOpen(false)} sx={{ mt: 2 }}>Cancelar</Button>
                  </DialogContent>
                </Dialog>
              </Box>
            )}

            {/* Adicione outras seções aqui conforme `currentSection` */}
            {!employee && !loading && (
              <Typography>Nenhum funcionário logado.</Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}


const CargoOptions: Record<string, Cargo> = {
  GARCOM: 'GARCOM',
  COZINHEIRO: 'COZINHEIRO',
  RECEPCIONISTA: 'RECEPCIONISTA',
  GERENTE: 'GERENTE',
};

export default SettingsModal;