import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, Tooltip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, alpha } from '@mui/material/styles';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import SystemView from './SystemView';

const Panel = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  right: 0,
  bottom: 0,
  width: '300px',
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  display: 'flex',
  flexDirection: 'row',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderLeft: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  boxShadow: `-1px 0 0 ${alpha(theme.palette.grey[700], 0.1)}`,
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.75),
  width: '40px',
  height: '100%',
  backgroundColor: theme.palette.grey[900],
  borderRight: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  position: 'relative',
  cursor: 'ew-resize',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    padding: '1px',
    background: `linear-gradient(180deg, 
      ${alpha('#FFD700', 0.2)} 0%, 
      ${alpha('#FFD700', 0.4)} 50%, 
      ${alpha('#FFD700', 0.2)} 100%
    )`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '1px',
    background: `linear-gradient(180deg, 
      ${alpha(theme.palette.primary.main, 0.2)} 0%, 
      ${alpha(theme.palette.grey[700], 0.3)} 50%, 
      ${alpha(theme.palette.primary.main, 0.2)} 100%
    )`,
  }
}));

const Title = styled(Typography)(({ theme }) => ({
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  color: alpha(theme.palette.common.white, 0.9),
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  margin: theme.spacing(1, 0),
}));

const Content = styled(Box)({
  flexGrow: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const NetworkView = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
  '& .react-flow__node': {
    background: 'none',
    border: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
    '&.selected': {
      boxShadow: 'none',
    }
  },
  '& .react-flow__edge': {
    stroke: alpha('#C4A052', 0.4),
    strokeWidth: 1,
  },
  '& .react-flow__edge.animated': {
    stroke: alpha('#C4A052', 0.6),
  },
  '& .react-flow__controls': {
    backgroundColor: theme.palette.grey[800],
    border: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  }
}));

const Description = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  '& .title': {
    fontSize: '0.75rem',
    color: alpha(theme.palette.common.white, 0.7),
    marginBottom: theme.spacing(1),
  },
  '& .text': {
    fontSize: '0.8rem',
    color: theme.palette.common.white,
    lineHeight: 1.4,
  },
}));

const SystemNode: React.FC<{ data: { label: string; type: string; metadata?: any } }> = ({ data }) => {
  return (
    <Tooltip 
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Type: {data.type}</Typography>
          {data.metadata && Object.entries(data.metadata).map(([key, value]) => (
            <Typography key={key} variant="body2">
              {key}: {String(value)}
            </Typography>
          ))}
        </Box>
      }
      arrow
      placement="right"
    >
      <Box>
        <Typography variant="body2" sx={{ 
          color: 'common.white',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '150px'
        }}>
          {data.label}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const SidePanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(window.innerHeight * 0.8);
  const [isDraggingWidth, setIsDraggingWidth] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startWidth = useRef(0);
  const startHeight = useRef(0);
  const [showLabels, setShowLabels] = useState(true);

  // Example nodes and edges - this would be dynamic based on system state
  const nodes: Node[] = [
    {
      id: '1',
      type: 'viewer',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Product Vision',
        color: '#4CAF50',
        opacity: 0.8,
        metadata: {
          Type: 'Strategy',
          Status: 'Active',
          'Last Modified': '2024-03-20',
          'Node Count': '5',
          Version: '1.0.0'
        }
      },
      style: { width: 60, height: 60 },
    },
    {
      id: '2',
      type: 'viewer',
      position: { x: 250, y: 50 },
      data: { 
        label: 'Tech Stack',
        color: '#2196F3',
        opacity: 0.7,
        metadata: {
          Type: 'Architecture',
          Status: 'Running',
          'Input Nodes': '2',
          'Output Nodes': '1',
          Performance: '98.5%'
        }
      },
      style: { width: 40, height: 40 },
    },
    {
      id: '3',
      type: 'viewer',
      position: { x: 200, y: 200 },
      data: { 
        label: 'User Flow',
        color: '#FFC107',
        opacity: 0.6,
        metadata: {
          Type: 'Design',
          Status: 'Active',
          'Input Type': 'Research',
          'Output Type': 'Prototype',
          Model: 'User Testing'
        }
      },
      style: { width: 50, height: 50 },
    },
  ];

  const edges: Edge[] = [
    { 
      id: 'e1-2', 
      source: '1', 
      target: '2',
      type: 'default',
      animated: true,
    },
    { 
      id: 'e1-3', 
      source: '1', 
      target: '3',
      type: 'default',
      animated: false,
    },
  ];

  const handleWidthMouseDown = (e: React.MouseEvent) => {
    setIsDraggingWidth(true);
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'ew-resize';
  };

  const handleHeightMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHeight(true);
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.cursor = 'ns-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingWidth) {
      const delta = e.clientX - startX.current;
      const newWidth = Math.min(Math.max(startWidth.current - delta, 200), 600);
      setWidth(newWidth);
    }
    if (isDraggingHeight) {
      const delta = e.clientY - startY.current;
      const newHeight = Math.min(Math.max(startHeight.current - delta, 300), window.innerHeight);
      setHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingWidth(false);
    setIsDraggingHeight(false);
    document.body.style.cursor = '';
  };

  useEffect(() => {
    if (isDraggingWidth || isDraggingHeight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingWidth, isDraggingHeight]);

  return (
    <Panel
      elevation={0}
      sx={{
        transform: isExpanded ? 'translateX(0)' : 'translateX(calc(100% - 40px))',
        width: isExpanded ? `${width}px` : '40px',
        height: `${height}px`,
      }}
    >
      <TopDragHandle onMouseDown={handleHeightMouseDown} />
      <Header onMouseDown={handleWidthMouseDown}>
        <Title variant="subtitle2">System View</Title>
        <IconButton 
          size="small" 
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ 
            color: 'common.white',
            padding: '6px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              color: 'primary.main',
              transform: 'translateX(-1px)',
            }
          }}
        >
          {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Header>
      <Content>
        <Description>
          <Typography className="title">System Overview</Typography>
          <Typography className="text">
            Currently viewing a project with 3 active components. The main project node (green) 
            connects to a processing chain and an individual node. The chain is currently running 
            with optimal performance, while Node B is handling text-to-vector transformations 
            using GPT-4.
          </Typography>
        </Description>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          px: 2,
          py: 1,
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? 'Hide Labels' : 'Show Labels'}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
          <SystemView 
            nodes={nodes} 
            edges={edges} 
            showLabels={showLabels}
          />
        </Box>
      </Content>
    </Panel>
  );
};

const TopDragHandle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '4px',
  cursor: 'ns-resize',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[700], 0.3),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '1px',
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      ${alpha('#FFD700', 0.2)} 0%, 
      ${alpha('#FFD700', 0.4)} 50%, 
      ${alpha('#FFD700', 0.2)} 100%
    )`,
  }
}));

export default SidePanel; 