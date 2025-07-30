import { useState, useCallback } from 'react';
import type { Cargo } from '../types/Employee';

type StepType = 'personal' | 'contact' | 'security' | 'review';

interface StepData {
  personal: {
    nome: string;
    cpf: string;
    cargo: Cargo;
  };
  contact: {
    email: string;
    telefone: string;
  };
  security: {
    senha: string;
    confirmarSenha: string;
  };
}

interface UseEmployeeFormReturn {
  currentStep: StepType;
  stepData: StepData;
  stepErrors: Partial<Record<StepType, string[]>>;
  setStepData: React.Dispatch<React.SetStateAction<StepData>>;
  setCurrentStep: (step: StepType) => void;
  validateStep: (step: StepType) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  resetForm: () => void;
  formatCpf: (value: string) => string;
  formatTelefone: (value: string) => string;
}

const steps: StepType[] = ['personal', 'contact', 'security', 'review'];

const initialStepData: StepData = {
  personal: {
    nome: '',
    cpf: '',
    cargo: 'GARCOM',
  },
  contact: {
    email: '',
    telefone: '',
  },
  security: {
    senha: '',
    confirmarSenha: '',
  },
};

export const useEmployeeForm = (): UseEmployeeFormReturn => {
  const [currentStep, setCurrentStep] = useState<StepType>('personal');
  const [stepData, setStepData] = useState<StepData>(initialStepData);
  const [stepErrors, setStepErrors] = useState<Partial<Record<StepType, string[]>>>({});

  const validateStep = useCallback((step: StepType): boolean => {
    const errors: string[] = [];

    switch (step) {
      case 'personal':
        if (!stepData.personal.nome.trim()) {
          errors.push('Nome é obrigatório');
        }
        if (!stepData.personal.cpf.trim()) {
          errors.push('CPF é obrigatório');
        } else if (stepData.personal.cpf.replace(/\D/g, '').length !== 11) {
          errors.push('CPF deve ter 11 dígitos');
        }
        break;

      case 'contact':
        if (!stepData.contact.email.trim()) {
          errors.push('Email é obrigatório');
        } else if (!/\S+@\S+\.\S+/.test(stepData.contact.email)) {
          errors.push('Email inválido');
        }
        if (!stepData.contact.telefone.trim()) {
          errors.push('Telefone é obrigatório');
        }
        break;

      case 'security':
        if (!stepData.security.senha) {
          errors.push('Senha é obrigatória');
        } else if (stepData.security.senha.length < 6) {
          errors.push('Senha deve ter pelo menos 6 caracteres');
        }
        if (stepData.security.senha !== stepData.security.confirmarSenha) {
          errors.push('Senhas não coincidem');
        }
        break;
    }

    setStepErrors(prev => ({ ...prev, [step]: errors }));
    return errors.length === 0;
  }, [stepData]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      const currentIndex = steps.findIndex(step => step === currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  }, [currentStep, validateStep]);

  const previousStep = useCallback(() => {
    const currentIndex = steps.findIndex(step => step === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  const resetForm = useCallback(() => {
    setStepData(initialStepData);
    setStepErrors({});
    setCurrentStep('personal');
  }, []);

  const formatCpf = useCallback((cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }, []);

  const formatTelefone = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 2) return numericValue;
    if (numericValue.length <= 6) return `(${numericValue.slice(0, 2)})${numericValue.slice(2)}`;
    if (numericValue.length <= 10) return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    return `(${numericValue.slice(0, 2)})${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  }, []);

  return {
    currentStep,
    stepData,
    stepErrors,
    setStepData,
    setCurrentStep,
    validateStep,
    nextStep,
    previousStep,
    resetForm,
    formatCpf,
    formatTelefone,
  };
}; 