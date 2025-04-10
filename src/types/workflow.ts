export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: Position;
  data: {
    label: string;
    content?: string;
    selectedSources?: string[];
    nlpAnalysis?: {
      sentiment?: string;
      keywords?: string[];
      summary?: string;
    };
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
} 