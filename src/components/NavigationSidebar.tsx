import React, { useState } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText, Tooltip, Collapse } from '@mui/material';
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

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

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

  const renderScriptChain = (scriptChain: ScriptChainItem, projectId: string, workspaceId: string, lociId: string, depth: number) => (
    <NestedNavItem
      key={scriptChain.id}
      depth={depth}
      onClick={() => navigate(`/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}/scriptchains/${scriptChain.id}`)}
      active={location.pathname.includes(`/scriptchains/${scriptChain.id}`)}
    >
      <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
        <AccountTreeIcon sx={{ fontSize: 18 }} />
      </ListItemIcon>
      <ListItemText 
        primary={scriptChain.name}
        primaryTypographyProps={{
          fontSize: '14px',
          fontWeight: 400,
          noWrap: true
        }}
      />
    </NestedNavItem>
  );

  const renderLoci = (loci: LociItem, projectId: string, workspaceId: string, depth: number) => (
    <React.Fragment key={loci.id}>
      <NestedNavItem
        depth={depth}
        onClick={() => handleItemClick(loci.id)}
        active={location.pathname.includes(`/loci/${loci.id}`)}
      >
        <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
          {isItemExpanded(loci.id) ? (
            <ExpandMoreIcon sx={{ fontSize: 18 }} />
          ) : (
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={loci.name}
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            noWrap: true
          }}
        />
      </NestedNavItem>
      <Collapse in={isItemExpanded(loci.id)}>
        {loci.scriptChains.map(scriptChain => 
          renderScriptChain(scriptChain, projectId, workspaceId, loci.id, depth + 1)
        )}
      </Collapse>
    </React.Fragment>
  );

  const renderWorkspace = (workspace: WorkspaceItem, projectId: string, depth: number) => (
    <React.Fragment key={workspace.id}>
      <NestedNavItem
        depth={depth}
        onClick={() => handleItemClick(workspace.id)}
        active={location.pathname.includes(`/workspaces/${workspace.id}`)}
      >
        <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
          {isItemExpanded(workspace.id) ? (
            <ExpandMoreIcon sx={{ fontSize: 18 }} />
          ) : (
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={workspace.name}
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 400,
            noWrap: true
          }}
        />
      </NestedNavItem>
      <Collapse in={isItemExpanded(workspace.id)}>
        {workspace.loci.map(loci => renderLoci(loci, projectId, workspace.id, depth + 1))}
      </Collapse>
    </React.Fragment>
  );

  const renderProject = (project: ProjectItem, depth: number) => (
    <React.Fragment key={project.id}>
      <NestedNavItem
        depth={depth}
        onClick={() => handleItemClick(project.id)}
        active={location.pathname.includes(`/projects/${project.id}`)}
      >
        <ListItemIcon sx={{ minWidth: 32, color: 'text.secondary' }}>
          {isItemExpanded(project.id) ? (
            <ExpandMoreIcon sx={{ fontSize: 18 }} />
          ) : (
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          )}
        </ListItemIcon>
        <ListItemText 
          primary={project.name}
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: 500,
            noWrap: true
          }}
        />
      </NestedNavItem>
      <Collapse in={isItemExpanded(project.id)}>
        {project.workspaces.map(workspace => renderWorkspace(workspace, project.id, depth + 1))}
      </Collapse>
    </React.Fragment>
  );

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

        <NavigationList>
          <NavItem active={location.pathname === '/'}>
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

          {mockProjects.map(project => renderProject(project, 0))}

          <NavItem>
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

          <NavItem>
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