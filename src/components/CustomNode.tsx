import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Chip, Stack } from '@mui/material';
import { useWorkflowStore } from '../store/workflowStore';

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
      elevation={selected ? 8 : 3}
      sx={{
        padding: 2,
        minWidth: 200,
        backgroundColor: '#ffffff',
        border: selected ? '2px solid #1976d2' : '1px solid #ccc',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
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
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {data.label}
          <Box component="span" sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: 'primary.main',
            display: 'inline-block'
          }} />
        </Typography>
        
        {data.selectedSources && data.selectedSources.length > 0 && (
          <Box mb={1}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
              {data.selectedSources.map((sourceId: string) => (
                <Chip 
                  key={sourceId}
                  label={`From: ${getSourceNodeName(sourceId)}`}
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
          </Box>
        )}
        
        {data.content && (
          <Typography variant="body2" color="text.secondary">
            {data.content}
          </Typography>
        )}
        
        {data.nlpAnalysis && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="primary">
              NLP Analysis:
            </Typography>
            {data.nlpAnalysis.sentiment && (
              <Typography variant="body2">
                Sentiment: {data.nlpAnalysis.sentiment}
              </Typography>
            )}
            {data.nlpAnalysis.keywords && (
              <Typography variant="body2">
                Keywords: {data.nlpAnalysis.keywords.join(', ')}
              </Typography>
            )}
            {data.nlpAnalysis.summary && (
              <Typography variant="body2">
                Summary: {data.nlpAnalysis.summary}
              </Typography>
            )}
          </Box>
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