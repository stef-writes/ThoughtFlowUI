import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TerminalPanel from './TerminalPanel';
import SidePanel from './SidePanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const isWorkflowEditor = location.pathname.includes('/workflows/');
  const isProjectView = location.pathname.includes('/projects/');

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: '#1A1A1A',
          backgroundImage: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          padding: theme.spacing(2, 3),
          backgroundColor: '#1A1A1A',
          backdropFilter: 'none',
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: theme.palette.primary.main,
              }}
            >
              ThoughtfulUI
            </Typography>
          </motion.div>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ 
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          position: 'relative',
          ...(isWorkflowEditor ? {
            padding: 0,
            maxWidth: '100%',
          } : {
            padding: theme.spacing(4, 3),
            maxWidth: '100%',
            margin: '0 auto',
            width: '100%',
            [theme.breakpoints.up('lg')]: {
              maxWidth: theme.breakpoints.values.lg,
            },
          }),
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </Box>
      
      {/* Terminal Panel based on route */}
      {isWorkflowEditor ? (
        <TerminalPanel title="Workflow Terminal" />
      ) : isProjectView ? (
        <TerminalPanel title="Project Terminal" />
      ) : (
        <TerminalPanel title="Global Terminal" />
      )}

      {/* Side Panel */}
      <SidePanel />
    </Box>
  );
};

export default Layout; 