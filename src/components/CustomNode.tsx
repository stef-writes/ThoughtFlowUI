import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Chip, Stack, IconButton } from '@mui/material';
import { useWorkflowStore } from '../store/workflowStore';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

interface CustomNodeProps extends NodeProps {
  onNodeDoubleClick?: (nodeId: string) => void;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, selected, id, onNodeDoubleClick }) => {
  const { nodes } = useWorkflowStore();

  const handleDoubleClick = () => {
    if (onNodeDoubleClick) {
      onNodeDoubleClick(id);
    }
  };

  // Get source node names
  const getSourceNodeName = (sourceId: string) => {
    const sourceNode = nodes.find(node => node.id === sourceId);
    return sourceNode?.data.label || sourceId;
  };

  return (
    <Paper
      elevation={selected ? 4 : 2}
      sx={{
        padding: 2,
        minWidth: 200,
        backgroundColor: '#ffffff',
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
        },
        cursor: 'pointer',
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {data.label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {data.content && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {data.content}
          </Typography>
        )}
        
        {data.selectedSources && data.selectedSources.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {data.selectedSources.map((sourceId: string) => (
              <Chip 
                key={sourceId}
                label={`← ${getSourceNodeName(sourceId)}`}
                size="small"
                color="primary" 
                variant="outlined"
                sx={{
                  maxWidth: '100%',
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    overflow: 'visible',
                  }
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </Paper>
  );
};

export default memo(CustomNode); 