import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText, Tooltip, Collapse, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PublishIcon from '@mui/icons-material/Publish';
import { useLocation, useNavigate } from 'react-router-dom';

const SIDEBAR_WIDTH = 240;
const TRANSITION_DURATION = '0.2s';

const SidebarContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'isCollapsed'
})<{ isCollapsed: boolean }>(({ theme, isCollapsed }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: SIDEBAR_WIDTH,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  transition: `transform ${TRANSITION_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
  transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
  zIndex: 1200,
}));

const MenuButtonContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'isSidebarVisible'
})<{ isSidebarVisible: boolean }>(({ theme, isSidebarVisible }) => ({
  position: 'fixed',
  left: theme.spacing(2),
  top: theme.spacing(1.25),
  zIndex: 1201,
  transition: `transform ${TRANSITION_DURATION} cubic-bezier(0.4, 0, 0.2, 1)`,
  transform: isSidebarVisible ? 'translateX(0)' : 'translateX(0)',
}));

const TopSection = styled(Box)(({ theme }) => ({
  height: '45px',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1)
}));

const NavigationList = styled(List)(({ theme }) => ({
  padding: theme.spacing(1),
  flex: 1,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.text.primary, 0.1),
    borderRadius: '2px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: alpha(theme.palette.text.primary, 0.2),
  }
}));

const NavItem = styled(ListItem)<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.7),
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    }
  })
}));

interface NavigationSidebarProps {
  onToggle?: () => void;
}

interface ProjectItem {
  id: string;
  name: string;
  workspaces: WorkspaceItem[];
}

interface WorkspaceItem {
  id: string;
  name: string;
  loci: LociItem[];
}

interface LociItem {
  id: string;
  name: string;
  scriptChains: ScriptChainItem[];
}

interface ScriptChainItem {
  id: string;
  name: string;
}

// Mock data
const mockProjects: ProjectItem[] = [
  {
    id: '1',
    name: 'Authentication System',
    workspaces: [
      {
        id: '1',
        name: 'User Flow',
        loci: [
          {
            id: '1',
            name: 'Login Process',
            scriptChains: [
              { id: '1', name: 'Validation Chain' },
              { id: '2', name: 'Token Generation' }
            ]
          },
          {
            id: '2',
            name: 'Registration',
            scriptChains: [
              { id: '3', name: 'User Creation' },
              { id: '4', name: 'Welcome Email' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Data Processing',
    workspaces: [
      {
        id: '2',
        name: 'ETL Pipeline',
        loci: [
          {
            id: '3',
            name: 'Data Transformation',
            scriptChains: [
              { id: '5', name: 'Cleanup Chain' },
              { id: '6', name: 'Validation Chain' }
            ]
          }
        ]
      }
    ]
  }
];

const NestedNavItem = styled(ListItem)<{ depth?: number; active?: boolean }>(({ theme, depth = 0, active }) => ({
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(0.25),
  padding: theme.spacing(0.5, 1),
  paddingLeft: theme.spacing(1 + (depth * 2)),
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.7),
    '&::before': {
      content: '""',
      position: 'absolute',
      left: theme.spacing(1 + (depth * 2)),
      top: '50%',
      transform: 'translateY(-50%)',
      width: '2px',
      height: '60%',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '1px',
    }
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: theme.spacing(1 + (depth * 2)),
      top: '50%',
      transform: 'translateY(-50%)',
      width: '2px',
      height: '60%',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '1px',
    }
  })
}));

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const listRef = useRef<HTMLUListElement>(null);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  const handleItemClick = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(id => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const isItemExpanded = (itemId: string) => expandedItems.includes(itemId);

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string, type: 'project' | 'workspace' | 'loci' | 'scriptchain') => {
    if (!listRef.current) return;

    const items = Array.from(listRef.current.querySelectorAll('[role="menuitem"]'));
    const currentIndex = items.findIndex(item => item.id === itemId);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          (items[currentIndex + 1] as HTMLElement).focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          (items[currentIndex - 1] as HTMLElement).focus();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (type !== 'scriptchain' && !expandedItems.includes(itemId)) {
          handleItemClick(itemId);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (type !== 'scriptchain' && expandedItems.includes(itemId)) {
          handleItemClick(itemId);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (type === 'scriptchain') {
          const path = `/projects/${itemId.split('-')[0]}/workspaces/${itemId.split('-')[1]}/loci/${itemId.split('-')[2]}/scriptchains/${itemId.split('-')[3]}`;
          navigate(path);
        } else {
          handleItemClick(itemId);
        }
        break;
    }
  };

  const renderScriptChain = (scriptChain: ScriptChainItem, projectId: string, workspaceId: string, lociId: string, depth: number) => {
    const itemId = `${projectId}-${workspaceId}-${lociId}-${scriptChain.id}`;
    return (
      <NestedNavItem
        key={scriptChain.id}
        depth={depth}
        onClick={() => navigate(`/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}/scriptchains/${scriptChain.id}`)}
        active={location.pathname.includes(`/scriptchains/${scriptChain.id}`)}
        role="menuitem"
        id={itemId}
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, itemId, 'scriptchain')}
        onFocus={() => setFocusedItem(itemId)}
        onBlur={() => setFocusedItem(null)}
      >
        <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
          <AccountTreeIcon sx={{ fontSize: 18 }} />
        </ListItemIcon>
        <Tooltip title={scriptChain.name} placement="right" arrow>
          <ListItemText 
            primary={scriptChain.name}
            primaryTypographyProps={{
              fontSize: '14px',
              fontWeight: 400,
              noWrap: true
            }}
          />
        </Tooltip>
      </NestedNavItem>
    );
  };

  const renderLoci = (loci: LociItem, projectId: string, workspaceId: string, depth: number) => {
    const itemId = `${projectId}-${workspaceId}-${loci.id}`;
    return (
      <React.Fragment key={loci.id}>
        <NestedNavItem
          depth={depth}
          onClick={() => handleItemClick(loci.id)}
          active={location.pathname.includes(`/loci/${loci.id}`)}
          role="menuitem"
          id={itemId}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, itemId, 'loci')}
          onFocus={() => setFocusedItem(itemId)}
          onBlur={() => setFocusedItem(null)}
        >
          <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
            {isItemExpanded(loci.id) ? (
              <ExpandMoreIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            ) : (
              <ChevronRightIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            )}
          </ListItemIcon>
          <Tooltip title={loci.name} placement="right" arrow>
            <ListItemText 
              primary={loci.name}
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400,
                noWrap: true
              }}
            />
          </Tooltip>
        </NestedNavItem>
        <Collapse 
          in={isItemExpanded(loci.id)} 
          timeout="auto" 
          unmountOnExit
          sx={{
            '& .MuiCollapse-wrapper': {
              transition: 'all 0.2s ease',
            }
          }}
        >
          {loci.scriptChains.map(scriptChain => 
            renderScriptChain(scriptChain, projectId, workspaceId, loci.id, depth + 1)
          )}
        </Collapse>
      </React.Fragment>
    );
  };

  const renderWorkspace = (workspace: WorkspaceItem, projectId: string, depth: number) => {
    const itemId = `${projectId}-${workspace.id}`;
    return (
      <React.Fragment key={workspace.id}>
        <NestedNavItem
          depth={depth}
          onClick={() => handleItemClick(workspace.id)}
          active={location.pathname.includes(`/workspaces/${workspace.id}`)}
          role="menuitem"
          id={itemId}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, itemId, 'workspace')}
          onFocus={() => setFocusedItem(itemId)}
          onBlur={() => setFocusedItem(null)}
        >
          <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
            {isItemExpanded(workspace.id) ? (
              <ExpandMoreIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            ) : (
              <ChevronRightIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            )}
          </ListItemIcon>
          <Tooltip title={workspace.name} placement="right" arrow>
            <ListItemText 
              primary={workspace.name}
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400,
                noWrap: true
              }}
            />
          </Tooltip>
        </NestedNavItem>
        <Collapse 
          in={isItemExpanded(workspace.id)} 
          timeout="auto" 
          unmountOnExit
          sx={{
            '& .MuiCollapse-wrapper': {
              transition: 'all 0.2s ease',
            }
          }}
        >
          {workspace.loci.map(loci => renderLoci(loci, projectId, workspace.id, depth + 1))}
        </Collapse>
      </React.Fragment>
    );
  };

  const renderProject = (project: ProjectItem, depth: number) => {
    const itemId = project.id;
    return (
      <React.Fragment key={project.id}>
        <NestedNavItem
          depth={depth}
          onClick={() => handleItemClick(project.id)}
          active={location.pathname.includes(`/projects/${project.id}`)}
          role="menuitem"
          id={itemId}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, itemId, 'project')}
          onFocus={() => setFocusedItem(itemId)}
          onBlur={() => setFocusedItem(null)}
        >
          <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
            {isItemExpanded(project.id) ? (
              <ExpandMoreIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            ) : (
              <ChevronRightIcon sx={{ fontSize: 18, transition: 'transform 0.2s ease' }} />
            )}
          </ListItemIcon>
          <Tooltip title={project.name} placement="right" arrow>
            <ListItemText 
              primary={project.name}
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 500,
                noWrap: true
              }}
            />
          </Tooltip>
        </NestedNavItem>
        <Collapse 
          in={isItemExpanded(project.id)} 
          timeout="auto" 
          unmountOnExit
          sx={{
            '& .MuiCollapse-wrapper': {
              transition: 'all 0.2s ease',
            }
          }}
        >
          {project.workspaces.map(workspace => renderWorkspace(workspace, project.id, depth + 1))}
        </Collapse>
      </React.Fragment>
    );
  };

  return (
    <>
      <MenuButtonContainer isSidebarVisible={!isCollapsed}>
        <IconButton
          size="small"
          onClick={handleToggle}
          sx={{ 
            color: 'text.secondary',
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: alpha('#000', 0.04)
            }
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
      </MenuButtonContainer>

      <SidebarContainer isCollapsed={isCollapsed}>
        <TopSection>
          <Box sx={{ width: 28 }} />
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
          </Typography>
        </TopSection>

        <NavigationList ref={listRef} role="menu">
          <NavItem
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, 'home', 'project')}
            onClick={() => navigate('/')}
            active={location.pathname === '/'}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: 32 }}>
              <HomeIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400
              }}
            />
          </NavItem>

          <NavItem
            onClick={() => navigate('/publishing')}
            active={location.pathname === '/publishing'}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PublishIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Publishing" />
          </NavItem>

          {mockProjects.map(project => renderProject(project, 0))}

          <NavItem
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, 'search', 'project')}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: 32 }}>
              <SearchIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Search" 
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400
              }}
            />
          </NavItem>

          <NavItem
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, 'settings', 'project')}
          >
            <ListItemIcon sx={{ color: 'text.secondary', minWidth: 32 }}>
              <SettingsIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Settings" 
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 400
              }}
            />
          </NavItem>
        </NavigationList>
      </SidebarContainer>
    </>
  );
};

export default NavigationSidebar; 