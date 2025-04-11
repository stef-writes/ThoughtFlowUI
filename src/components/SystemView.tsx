import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, styled, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const NodeLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: '-24px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '0.7rem',
  color: theme.palette.common.white,
  whiteSpace: 'nowrap',
  textAlign: 'center',
  pointerEvents: 'none',
}));

const ViewerNode = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const MetadataTooltip = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  '& .label': {
    color: alpha(theme.palette.common.white, 0.7),
    fontSize: '0.7rem',
    marginBottom: '2px',
  },
  '& .value': {
    color: theme.palette.common.white,
    fontSize: '0.75rem',
  },
  '& .separator': {
    margin: theme.spacing(0.5, 0),
    borderColor: alpha(theme.palette.common.white, 0.1),
  },
}));

const nodeTypes = {
  viewer: ({ data }: { data: any }) => {
    const renderMetadata = () => (
      <MetadataTooltip>
        {Object.entries(data.metadata || {}).map(([key, value]) => (
          <Box key={key} sx={{ mb: 1 }}>
            <Typography className="label">{key}</Typography>
            <Typography className="value">{String(value)}</Typography>
          </Box>
        ))}
      </MetadataTooltip>
    );

    return (
      <Tooltip
        title={renderMetadata()}
        placement="right"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.85)',
              '& .MuiTooltip-arrow': {
                color: 'rgba(0, 0, 0, 0.85)',
              },
            },
          },
        }}
      >
        <ViewerNode
          sx={{
            backgroundColor: data.color,
            opacity: data.opacity || 0.7,
          }}
        >
          <NodeLabel>{data.label}</NodeLabel>
        </ViewerNode>
      </Tooltip>
    );
  },
};

interface SystemViewProps {
  nodes: Node[];
  edges: Edge[];
}

const SystemView: React.FC<SystemViewProps> = ({ nodes, edges }) => {
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll
        zoomOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        connectionMode={ConnectionMode.Loose}
        minZoom={0.5}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: 'default',
          style: { stroke: '#C4A052', strokeWidth: 1 },
          animated: false,
        }}
      >
        <Background 
          color="rgba(255, 255, 255, 0.05)"
          gap={20}
          size={1}
        />
        <Controls 
          showInteractive={false}
          style={{
            backgroundColor: '#1A1A1A',
            borderColor: 'rgba(255, 255, 255, 0.08)',
          }}
        />
      </ReactFlow>
    </Box>
  );
};

export default SystemView; 