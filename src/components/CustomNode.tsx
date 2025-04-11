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
        backgroundColor: '#1A1A1A',
        border: selected ? '2px solid #C4A052' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(196, 160, 82, 0.15)',
          borderColor: 'rgba(196, 160, 82, 0.5)',
        },
        cursor: 'pointer',
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#C4A052', width: 8, height: 8 }}
      />
      
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ 
            fontWeight: 500,
            color: '#FFFFFF',
          }}>
            {data.label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small" 
              sx={{ 
                p: 0.5,
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  color: '#C4A052',
                  backgroundColor: 'rgba(196, 160, 82, 0.08)',
                }
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ 
                p: 0.5,
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  color: '#C4A052',
                  backgroundColor: 'rgba(196, 160, 82, 0.08)',
                }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {data.content && (
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1,
              color: 'rgba(255, 255, 255, 0.7)',
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
                sx={{
                  maxWidth: '100%',
                  backgroundColor: 'rgba(196, 160, 82, 0.08)',
                  color: '#C4A052',
                  border: '1px solid rgba(196, 160, 82, 0.3)',
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
        style={{ background: '#C4A052', width: 8, height: 8 }}
      />
    </Paper>
  );
};

export default memo(CustomNode); 