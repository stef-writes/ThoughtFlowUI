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

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const WorkflowCanvas: React.FC = () => {
  const { nodes, edges, addEdge: addEdgeToStore, updateNodePosition } = useWorkflowStore();
  const [expandedNode, setExpandedNode] = useState<Node | null>(null);

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
      setExpandedNode(node);
    }
  }, [nodes]);

  const handleCloseExpandedView = useCallback(() => {
    setExpandedNode(null);
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <ReactFlow
        nodes={nodes}
        edges={filteredEdges}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        style={{
          background: '#f8f8f8'
        }}
        onNodeDoubleClick={(_, node) => handleNodeDoubleClick(node.id)}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'default',
          animated: true
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <NodeExpandedView
        node={expandedNode}
        onClose={handleCloseExpandedView}
      />
    </div>
  );
};

export default WorkflowCanvas; 