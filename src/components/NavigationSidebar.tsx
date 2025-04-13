import React, { useState } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';

const SidebarContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: '240px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.2s ease',
  zIndex: 1200,
}));

const TopSection = styled(Box)(({ theme }) => ({
  height: '45px',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NavigationList = styled(List)(({ theme }) => ({
  padding: theme.spacing(1),
  flex: 1,
}));

const NavItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.7),
  },
}));

interface NavigationSidebarProps {
  onToggle?: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  return (
    <SidebarContainer sx={{ width: isCollapsed ? '60px' : '240px' }}>
      <TopSection>
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" px={1}>
          {!isCollapsed && (
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontSize: '14px',
                fontWeight: 500,
                color: 'text.secondary',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              ThoughtFlow
            </Typography>
          )}
          <IconButton 
            onClick={handleToggle}
            size="small"
            sx={{ 
              color: 'text.secondary',
              padding: 0.5,
              '&:hover': {
                backgroundColor: alpha('#000', 0.04)
              }
            }}
          >
            {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>
      </TopSection>

      <NavigationList>
        <NavItem button>
          <ListItemIcon sx={{ color: 'text.secondary', minWidth: 32 }}>
            <HomeIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400
              }}
            />
          )}
        </NavItem>
        <NavItem button>
          <ListItemIcon sx={{ color: 'text.secondary', minWidth: 32 }}>
            <SearchIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText 
              primary="Search" 
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400
              }}
            />
          )}
        </NavItem>
        <NavItem button>
          <ListItemIcon sx={{ color: 'text.secondary', minWidth: 32 }}>
            <SettingsIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText 
              primary="Settings" 
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400
              }}
            />
          )}
        </NavItem>
      </NavigationList>
    </SidebarContainer>
  );
};

export default NavigationSidebar; 