import { create } from 'zustand';
import { WorkflowState, WorkflowNode, WorkflowEdge } from '../types/workflow';

interface WorkflowStore extends WorkflowState {
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (edgeId: string) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
    
  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    })),
    
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    })),
    
  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),
    
  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),
    
  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    })),
})); 