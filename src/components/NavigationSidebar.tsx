import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText, Tooltip, Collapse, useTheme, Divider } from '@mui/material';
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
import HistoryIcon from '@mui/icons-material/History';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
  scriptchains: ScriptChainItem[];
}

interface ScriptChainItem {
  id: string;
  name: string;
}

interface RecentWorkflow {
  id: string;
  name: string;
  path: string;
  timestamp: number;
}

// Mock data
const mockProjects: ProjectItem[] = [
  {
    id: '1',
    name: 'Product Vision',
    workspaces: [
      {
        id: '1',
        name: 'Market Analysis',
        scriptchains: [
          { id: '1', name: 'Strategic Market Analyzer' }
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
  const [recentWorkflows] = useLocalStorage<RecentWorkflow[]>('recentWorkflows', []);

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

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string, type: 'project' | 'workspace' | 'scriptchain') => {
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
          const path = `/projects/${itemId.split('-')[0]}/workspaces/${itemId.split('-')[1]}/scriptchains/${itemId.split('-')[2]}`;
          navigate(path);
        } else {
          handleItemClick(itemId);
        }
        break;
    }
  };

  const renderWorkspace = (workspace: WorkspaceItem, projectId: string, depth: number) => {
    const itemId = workspace.id;
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
          {workspace.scriptchains.map(scriptchain => (
            <NestedNavItem
              key={scriptchain.id}
              depth={depth + 1}
              onClick={() => navigate(`/projects/${projectId}/workspaces/${workspace.id}/scriptchains/${scriptchain.id}`)}
              active={location.pathname.includes(`/scriptchains/${scriptchain.id}`)}
              role="menuitem"
              tabIndex={0}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
                <AccountTreeIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <Tooltip title={scriptchain.name} placement="right" arrow>
                <ListItemText 
                  primary={scriptchain.name}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: 400,
                    noWrap: true
                  }}
                />
              </Tooltip>
            </NestedNavItem>
          ))}
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

          {/* Recent Workflows Section */}
          {recentWorkflows.length > 0 && (
            <>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 2
                }}
              >
                <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Recent
                </Typography>
              </Box>
              {recentWorkflows.slice(0, 5).map((workflow) => (
                <NavItem
                  key={workflow.id}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => navigate(workflow.path)}
                  active={location.pathname === workflow.path}
                  sx={{ pl: 3 }}
                >
                  <ListItemIcon sx={{ color: 'text.secondary', minWidth: 32 }}>
                    <AccountTreeIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={workflow.name}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 400,
                      noWrap: true
                    }}
                  />
                </NavItem>
              ))}
              <Divider sx={{ my: 2 }} />
            </>
          )}

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