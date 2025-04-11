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
  const { projectId, workflowId } = useParams();

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
        backgroundColor: 'background.paper',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/projects/${projectId}`)}
          sx={{ 
            minWidth: 'auto',
            padding: '8px 12px',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          Back
        </Button>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Lobes
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
            Lobe {projectId}
          </Link>
          <Typography color="text.primary">
            Network {workflowId}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNode}
        >
          Add Node
        </Button>
      </Box>
    </MuiToolbar>
  );
};

export default WorkflowToolbar; 