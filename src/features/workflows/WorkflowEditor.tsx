import React from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const WorkflowEditor: React.FC = () => {
  const { projectId, workspaceId, lociId, scriptchainId } = useParams();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          sx={{ mb: 3 }}
        >
          <Link 
            component={RouterLink} 
            to="/" 
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Projects
          </Link>
          <Link 
            component={RouterLink} 
            to={`/projects/${projectId}`}
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Project {projectId}
          </Link>
          <Link 
            component={RouterLink} 
            to={`/projects/${projectId}/workspaces/${workspaceId}`}
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Workspace {workspaceId}
          </Link>
          <Link 
            component={RouterLink} 
            to={`/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}`}
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Loci {lociId}
          </Link>
          <Typography color="text.primary">ScriptChain {scriptchainId}</Typography>
        </Breadcrumbs>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            letterSpacing: '-0.5px'
          }}>
            ScriptChain Editor
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Save ScriptChain">
              <IconButton 
                color="primary"
                sx={{ 
                  backgroundColor: 'primary.light',
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Run ScriptChain">
              <IconButton 
                color="success"
                sx={{ 
                  backgroundColor: 'success.light',
                  '&:hover': { backgroundColor: 'success.main', color: 'white' }
                }}
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton 
                color="default"
                sx={{ 
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton 
                color="default"
                sx={{ 
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' }
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More Options">
              <IconButton 
                color="default"
                sx={{ 
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Paper 
          sx={{ 
            p: 3,
            height: 'calc(100vh - 250px)',
            backgroundColor: '#f5f5f5',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, #f5f5f5 25%, #e0e0e0 25%, #e0e0e0 50%, #f5f5f5 50%, #f5f5f5 75%, #e0e0e0 75%, #e0e0e0)',
            backgroundSize: '20px 20px',
            opacity: 0.1,
          }} />
          <Typography variant="h6" color="text.secondary">
            Workflow Editor Canvas
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default WorkflowEditor; 