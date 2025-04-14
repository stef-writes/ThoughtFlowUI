import { create } from 'zustand';
import { WorkflowState, WorkflowNode, WorkflowEdge } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowStore extends WorkflowState {
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (edgeId: string) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
}

// Initialize nodes
const marketDataNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 100, y: 100 },
  data: {
    label: 'Market Data Processor',
    content: 'Processes market reports and trend data to extract structured insights',
    metadata: {
      temperature: 0.4,
      tokenLimit: 800,
      inputs: ['Market reports', 'Trend data'],
      context: 'Extract and structure key market data points',
      status: 'in-progress'
    }
  }
};

const competitorNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 100, y: 300 },
  data: {
    label: 'Competitor Analysis',
    content: 'Analyzes competitor data and market positioning',
    metadata: {
      temperature: 0.5,
      tokenLimit: 800,
      inputs: ['Competitor data', 'Market positioning'],
      context: 'Process competitive information and structure relative market positions',
      status: 'in-progress'
    }
  }
};

const customerNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 100, y: 500 },
  data: {
    label: 'Customer Feedback Processor',
    content: 'Processes customer feedback and survey data',
    metadata: {
      temperature: 0.4,
      tokenLimit: 800,
      inputs: ['Customer feedback', 'Survey data'],
      context: 'Process qualitative feedback and extract key themes',
      status: 'in-progress'
    }
  }
};

const insightNode: WorkflowNode = {
  id: uuidv4(),
  type: 'custom',
  position: { x: 500, y: 300 },
  data: {
    label: 'Strategic Insight Generator',
    content: 'Generates strategic recommendations from multiple inputs',
    metadata: {
      temperature: 0.6,
      tokenLimit: 1200,
      inputs: ['Market insights', 'Competitive analysis', 'Customer insights'],
      context: 'Merge multiple input streams and generate actionable insights',
      status: 'in-progress'
    }
  }
};

// Initialize edges
const edges: WorkflowEdge[] = [
  {
    id: uuidv4(),
    source: marketDataNode.id,
    target: insightNode.id,
    animated: true
  },
  {
    id: uuidv4(),
    source: competitorNode.id,
    target: insightNode.id,
    animated: true
  },
  {
    id: uuidv4(),
    source: customerNode.id,
    target: insightNode.id,
    animated: true
  }
];

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [marketDataNode, competitorNode, customerNode, insightNode],
  edges: edges,
  
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