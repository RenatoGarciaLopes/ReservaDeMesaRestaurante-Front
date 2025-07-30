import { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import type { Cargo } from '../types/Employee';
import {
  personalStepSchema,
  contactStepSchema,
  securityStepSchema,
} from '../components/EmployeeManagement/AddEmployeeModal/validationSchema';

type StepType = 'personal' | 'contact' | 'security' | 'review';

interface FormValues {
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

const initialValues: FormValues = {
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

export const useEmployeeFormik = () => {
  const [currentStep, setCurrentStep] = useState<StepType>('personal');

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema: personalStepSchema, // Será alterado dinamicamente
    onSubmit: () => {
      // Será chamado quando o formulário for submetido
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const getStepValidationSchema = useCallback((step: StepType) => {
    switch (step) {
      case 'personal':
        return personalStepSchema;
      case 'contact':
        return contactStepSchema;
      case 'security':
        return securityStepSchema;
      default:
        return null;
    }
  }, []);

  const validateCurrentStep = useCallback(async () => {
    const schema = getStepValidationSchema(currentStep);
    if (!schema) return true;

    try {
      const stepData = formik.values[currentStep as keyof FormValues];
      await schema.validate(stepData, { abortEarly: false });
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err: any) => {
        errors[err.path] = err.message;
      });
      formik.setErrors(errors);
      return false;
    }
  }, [currentStep, formik, getStepValidationSchema]);

  const nextStep = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      const steps: StepType[] = ['personal', 'contact', 'security', 'review'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  }, [currentStep, validateCurrentStep]);

  const previousStep = useCallback(() => {
    const steps: StepType[] = ['personal', 'contact', 'security', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  const resetForm = useCallback(() => {
    formik.resetForm();
    setCurrentStep('personal');
  }, [formik]);

  const formatCpf = useCallback((value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 3) return cleanValue;
    if (cleanValue.length <= 6) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
    if (cleanValue.length <= 9) return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
  }, []);

  const formatTelefone = useCallback((value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 2) return cleanValue;
    if (cleanValue.length <= 6) return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
    if (cleanValue.length <= 10) return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 6)}-${cleanValue.slice(6)}`;
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
  }, []);

  return {
    formik,
    currentStep,
    nextStep,
    previousStep,
    resetForm,
    formatCpf,
    formatTelefone,
    validateCurrentStep,
  };
}; 