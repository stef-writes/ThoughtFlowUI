import React from 'react';
import { Box, Button, Typography } from '@mui/material';
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

  const pathSegments = [
    { label: 'Projects', path: '/' },
    { label: `Project ${projectId}`, path: `/projects/${projectId}` },
    { label: `Workspace ${workspaceId}`, path: `/projects/${projectId}/workspaces/${workspaceId}` },
    { label: `Loci ${lociId}`, path: `/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}` },
    { label: `ScriptChain ${scriptchainId}`, path: null }
  ];

  return (
    <Box
      sx={{
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        justifyContent: 'space-between'
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}`)}
          sx={{ 
            minWidth: 'auto',
            padding: '4px 8px',
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          Back
        </Button>
        
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            fontSize: '14px',
            '& .segment': {
              color: 'text.primary',
              cursor: 'pointer',
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
                padding: '2px 4px',
                margin: '-2px -4px'
              }
            }
          }}
        >
          {pathSegments.map((segment, index) => (
            <React.Fragment key={segment.label}>
              {segment.path ? (
                <Box
                  component={RouterLink}
                  to={segment.path}
                  className="segment"
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  {segment.label}
                </Box>
              ) : (
                <Box component="span" className="segment">
                  {segment.label}
                </Box>
              )}
              {index < pathSegments.length - 1 && " / "}
            </React.Fragment>
          ))}
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddNode}
        sx={{
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          textTransform: 'none',
          px: 2
        }}
      >
        Add Node
      </Button>
    </Box>
  );
};

export default WorkflowToolbar; 