import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Formik, Form } from 'formik';
import type { AddEmployeeModalProps } from '../types';
import { useEmployeeFormik } from '../../../hooks/useEmployeeFormik';
import PersonalStep from './PersonalStep';
import ContactStep from './ContactStep';
import SecurityStep from './SecurityStep';
import ReviewStep from './ReviewStep';
import { personalStepSchema, contactStepSchema, securityStepSchema } from './validationSchema';

const steps = [
  {
    id: 'personal' as const,
    label: 'Dados Pessoais',
    description: 'Informações básicas do colaborador',
    icon: <PersonIcon />
  },
  {
    id: 'contact' as const,
    label: 'Contato',
    description: 'Email e telefone para comunicação',
    icon: <EmailIcon />
  },
  {
    id: 'security' as const,
    label: 'Segurança',
    description: 'Defina uma senha segura',
    icon: <SecurityIcon />
  },
  {
    id: 'review' as const,
    label: 'Revisão',
    description: 'Confirme os dados antes de criar',
    icon: <CheckIcon />
  }
];

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const {
    formik,
    currentStep,
    nextStep,
    previousStep,
    resetForm,
    formatCpf,
    formatTelefone,
  } = useEmployeeFormik();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      handleClose();
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
    }
  };

  const getValidationSchema = () => {
    switch (currentStep) {
      case 'personal':
        return personalStepSchema;
      case 'contact':
        return contactStepSchema;
      case 'security':
        return securityStepSchema;
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalStep formatCpf={formatCpf} />;
      case 'contact':
        return <ContactStep formatTelefone={formatTelefone} />;
      case 'security':
        return <SecurityStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return null;
    }
  };

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '700px',
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <Formik
        initialValues={formik.initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize={false}
      >
        <Form>
          <DialogTitle sx={{ 
            backgroundColor: '#fafafa',
            color: '#1a1a1a',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e0e0e0',
            p: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Novo Colaborador
              </Typography>
            </Box>
            <Button
              onClick={handleClose}
              sx={{ 
                minWidth: 'auto', 
                p: 1,
                color: '#666',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <CloseIcon />
            </Button>
          </DialogTitle>
          
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              {/* Stepper Lateral */}
              <Box sx={{ 
                width: 320, 
                backgroundColor: '#fafafa',
                borderRight: '1px solid #e0e0e0',
                p: 4,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Progresso
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: '#1976d2'
                      }
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {currentStepIndex + 1} de {steps.length} etapas
                  </Typography>
                </Box>

                <Stepper orientation="vertical" activeStep={currentStepIndex}>
                  {steps.map((step, index) => (
                    <Step key={step.id}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: index <= currentStepIndex ? '#1976d2' : '#e0e0e0',
                            color: index <= currentStepIndex ? 'white' : '#666',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: index <= currentStepIndex ? '#1565c0' : '#d0d0d0',
                            }
                          }}>
                            {step.icon}
                          </Box>
                        )}
                      >
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {step.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {step.description}
                          </Typography>
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Conteúdo do Step */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {renderStepContent()}
                
                {/* Botões de Navegação */}
                <Box sx={{ 
                  p: 4, 
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={previousStep}
                    disabled={currentStep === 'personal'}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 3,
                      py: 1.5
                    }}
                  >
                    Anterior
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1.5
                      }}
                    >
                      Cancelar
                    </Button>
                    
                    {currentStep === 'review' ? (
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 3,
                          py: 1.5,
                          backgroundColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#1565c0'
                          }
                        }}
                      >
                        Criar Colaborador
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={nextStep}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 3,
                          py: 1.5,
                          backgroundColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#1565c0'
                          }
                        }}
                      >
                        Próximo
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default AddEmployeeModal; 