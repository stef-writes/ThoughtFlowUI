import React from 'react';
import { Box, Button, Toolbar as MuiToolbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useWorkflowStore } from '../store/workflowStore';
import { v4 as uuidv4 } from 'uuid';

const WorkflowToolbar: React.FC = () => {
  const { addNode } = useWorkflowStore();

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
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNode}
        >
          Add Node
        </Button>
        <Button
          variant="outlined"
          startIcon={<AutoFixHighIcon />}
          onClick={() => {
            // NLP analysis functionality will be implemented later
            console.log('NLP Analysis clicked');
          }}
        >
          Analyze Text
        </Button>
      </Box>
    </MuiToolbar>
  );
};

export default WorkflowToolbar; 