import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TerminalPanel from './TerminalPanel';
import NavigationSidebar from './NavigationSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const isWorkflowEditor = location.pathname.includes('/workflows/');
  const isProjectView = location.pathname.includes('/projects/');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Extract path segments for breadcrumb
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
    }}>
      <NavigationSidebar onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      {/* Notion-style header */}
      <Box
        sx={{
          ml: isSidebarCollapsed ? '60px' : '240px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: theme.palette.text.secondary,
            fontSize: '14px',
            '& .segment': {
              color: theme.palette.text.primary,
              cursor: 'pointer',
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1
              }
            }
          }}
        >
          {pathSegments.length > 0 ? (
            pathSegments.map((segment, index) => (
              <React.Fragment key={segment}>
                <Box component="span" className="segment">
                  {segment}
                </Box>
                {index < pathSegments.length - 1 && " / "}
              </React.Fragment>
            ))
          ) : (
            <Box component="span" className="segment">
              Home
            </Box>
          )}
        </Typography>
      </Box>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          position: 'relative',
          ml: isSidebarCollapsed ? '60px' : '240px',
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
        <TerminalPanel title="Workflow Terminal" isSidebarCollapsed={isSidebarCollapsed} />
      ) : isProjectView ? (
        <TerminalPanel title="Project Terminal" isSidebarCollapsed={isSidebarCollapsed} />
      ) : (
        <TerminalPanel title="Global Terminal" isSidebarCollapsed={isSidebarCollapsed} />
      )}
    </Box>
  );
};

export default Layout; 