import type { ListarFuncionarioDto } from '../types/Employee';

export const formatDate = (dateString: string): string => {
  try {
    // Se a data já está no formato dd/mm/yyyy, retornar como está
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return dateString;
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Retornar como está se não conseguir parsear
    }
    
    return date.toLocaleDateString('pt-BR') + ' - ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    return dateString; // Retornar como está em caso de erro
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name: string, opacity: number = 1): string => {
  const colors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#16a085'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const formatCpf = (cpf: string): string => {
  const cleanCpf = cpf.replace(/\D/g, '');
  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatTelefone = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  if (numericValue.length <= 2) return numericValue;
  if (numericValue.length <= 6) return `(${numericValue.slice(0, 2)})${numericValue.slice(2)}`;
  if (numericValue.length <= 10) return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
  return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
};

export const getEmployeeDisplayDate = (employee: ListarFuncionarioDto): string => {
  return employee.dataCadastro 
    ? formatDate(employee.dataCadastro) 
    : formatDate(employee.dataContratacao);
}; 