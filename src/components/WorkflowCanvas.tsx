import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import CustomNode from './CustomNode';
import NodeExpandedView from './NodeExpandedView';
import { Paper, Button, Tooltip, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowNode } from '../types/workflow';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const WorkflowCanvas: React.FC = () => {
  const { nodes, edges, addEdge: addEdgeToStore, updateNodePosition, addNode } = useWorkflowStore();
  const [expandedNode, setExpandedNode] = useState<WorkflowNode | null>(null);

  const handleAddNode = () => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      type: 'custom',
      position: { x: window.innerWidth / 3, y: window.innerHeight / 3 },
      data: {
        label: 'New Node',
        content: '',
      },
    };
    addNode(newNode);
  };

  // Filter edges based on selected source nodes
  const filteredEdges = useMemo(() => {
    return edges.filter(edge => {
      const targetNode = nodes.find(node => node.id === edge.target);
      if (!targetNode || !targetNode.data.selectedSources || targetNode.data.selectedSources.length === 0) return true;
      return targetNode.data.selectedSources.includes(edge.source);
    });
  }, [edges, nodes]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Check if connection already exists
      const connectionExists = edges.some(
        edge => edge.source === params.source && edge.target === params.target
      );
      
      if (!connectionExists) {
        addEdgeToStore(params as Edge);
      }
    },
    [addEdgeToStore, edges]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateNodePosition(node.id, { x: node.position.x, y: node.position.y });
    },
    [updateNodePosition]
  );

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setExpandedNode(node as WorkflowNode);
    }
  }, [nodes]);

  const handleCloseExpandedView = useCallback(() => {
    setExpandedNode(null);
  }, []);

  return (
    <Paper 
      className="workflow-canvas"
      sx={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Add Node Button */}
      <Tooltip title="Add new node" arrow>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNode}
          sx={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            backgroundColor: theme => alpha(theme.palette.primary.main, 0.9),
            backdropFilter: 'blur(8px)',
            '&:hover': {
              backgroundColor: theme => theme.palette.primary.main,
            },
            textTransform: 'none',
            px: 3,
            py: 1,
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          Add Node
        </Button>
      </Tooltip>

      <ReactFlow
        nodes={nodes}
        edges={filteredEdges}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        style={{
          backgroundColor: 'transparent'
        }}
        onNodeDoubleClick={(_, node) => handleNodeDoubleClick(node.id)}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'default',
          animated: true,
          style: { stroke: '#C4A052', strokeWidth: 2 },
        }}
      >
        <Background 
          color="rgba(255, 255, 255, 0.05)"
          gap={20}
          size={1}
        />
        <Controls 
          style={{
            backgroundColor: '#1A1A1A',
            borderColor: 'rgba(255, 255, 255, 0.08)',
          }}
        />
        <MiniMap 
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
        />
      </ReactFlow>
      <NodeExpandedView
        node={expandedNode}
        onClose={handleCloseExpandedView}
      />
    </Paper>
  );
};

export default WorkflowCanvas; 