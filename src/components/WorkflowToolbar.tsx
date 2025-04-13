import React from 'react';
import { Box, Button, Toolbar as MuiToolbar, Typography, Breadcrumbs, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useWorkflowStore } from '../store/workflowStore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';

const WorkflowToolbar: React.FC = () => {
  const { addNode } = useWorkflowStore();
  const navigate = useNavigate();
  const { projectId, workspaceId, lociId, scriptchainId } = useParams();

  const handleAddNode = () => {
    const newNode = {
      id: uuidv4(),
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {
        label: 'New Node',
        content: '',
      },
    };
    addNode(newNode);
  };

  return (
    <MuiToolbar
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: '#1A1A1A',
        justifyContent: 'space-between',
        padding: '0 16px',
        minHeight: '64px !important',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}`)}
          sx={{ 
            minWidth: 'auto',
            padding: '8px 12px',
            color: '#C4A052',
            '&:hover': {
              backgroundColor: 'rgba(196, 160, 82, 0.08)',
            }
          }}
        >
          Back
        </Button>
        <Breadcrumbs 
          separator="›" 
          aria-label="breadcrumb"
          sx={{
            '& .MuiBreadcrumbs-separator': {
              color: 'rgba(255, 255, 255, 0.5)',
            }
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              '&:hover': { 
                color: '#C4A052',
                textDecoration: 'none'
              }
            }}
          >
            Projects
          </Link>
          <Link
            component={RouterLink}
            to={`/projects/${projectId}`}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              '&:hover': { 
                color: '#C4A052',
                textDecoration: 'none'
              }
            }}
          >
            Project {projectId}
          </Link>
          <Link
            component={RouterLink}
            to={`/projects/${projectId}/workspaces/${workspaceId}`}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              '&:hover': { 
                color: '#C4A052',
                textDecoration: 'none'
              }
            }}
          >
            Workspace {workspaceId}
          </Link>
          <Link
            component={RouterLink}
            to={`/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}`}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              textDecoration: 'none',
              '&:hover': { 
                color: '#C4A052',
                textDecoration: 'none'
              }
            }}
          >
            Loci {lociId}
          </Link>
          <Typography sx={{ color: '#C4A052' }}>
            ScriptChain {scriptchainId}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNode}
          sx={{
            backgroundColor: '#C4A052',
            '&:hover': {
              backgroundColor: '#B38D3B',
            }
          }}
        >
          Add Node
        </Button>
      </Box>
    </MuiToolbar>
  );
};

export default WorkflowToolbar; 