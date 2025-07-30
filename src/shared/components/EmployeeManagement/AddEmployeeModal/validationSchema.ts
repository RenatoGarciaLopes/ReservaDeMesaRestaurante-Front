import * as yup from 'yup';

export const personalStepSchema = yup.object({
  nome: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
    .test('cpf-valido', 'CPF inválido', (value) => {
      if (!value) return false;
      const cpf = value.replace(/\D/g, '');
      if (cpf.length !== 11) return false;
      
      // Validação de CPF
      let sum = 0;
      let remainder;
      
      if (cpf === '00000000000') return false;
      
      for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) return false;
      
      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) return false;
      
      return true;
    }),
  cargo: yup
    .string()
    .required('Cargo é obrigatório')
    .oneOf(['GARCOM', 'COZINHEIRO', 'RECEPCIONISTA', 'GERENTE'], 'Cargo inválido'),
});

export const contactStepSchema = yup.object({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  telefone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000'),
});

export const securityStepSchema = yup.object({
  senha: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  confirmarSenha: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('senha')], 'Senhas não coincidem'),
});

export const completeFormSchema = yup.object({
  personal: personalStepSchema,
  contact: contactStepSchema,
  security: securityStepSchema,
}); 