import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, People as PeopleIcon } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

const NavigationBreadcrumb: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathname = location.pathname;
    
    if (pathname === '/tables') {
      return [
        { label: 'Dashboard', path: '/tables' }
      ];
    }
    
    if (pathname === '/employees') {
      return [
        { label: 'Dashboard', path: '/tables' },
        { label: 'Colaboradores', path: '/employees' }
      ];
    }
    
    return [];
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      p: 2, 
      backgroundColor: 'transparent'
    }}>
      <Breadcrumbs 
        aria-label="breadcrumb"
        separator={
          <Typography sx={{ color: '#9ca3af', mx: 1 }}>&gt;</Typography>
        }
        sx={{
          '& .MuiBreadcrumbs-ol': {
            alignItems: 'center'
          }
        }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          if (isLast) {
            return (
              <Typography
                key={item.path}
                color="text.primary"
                sx={{ 
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                {item.label}
              </Typography>
            );
          }
          
          return (
            <Link
              key={item.path}
              component={RouterLink}
              to={item.path}
              color="inherit"
              underline="hover"
              sx={{ 
                textDecoration: 'none',
                color: '#6b7280',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#374151'
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default NavigationBreadcrumb; 