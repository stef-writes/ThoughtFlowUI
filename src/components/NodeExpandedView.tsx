import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { WorkflowNode, WorkflowEdge } from '../types/workflow';
import { useWorkflowStore } from '../store/workflowStore';

interface NodeExpandedViewProps {
  node: WorkflowNode | null;
  onClose: () => void;
}

const NodeExpandedView: React.FC<NodeExpandedViewProps> = ({ node, onClose }) => {
  const { updateNode, edges, nodes } = useWorkflowStore();
  const [nodeData, setNodeData] = React.useState({
    label: node?.data.label || '',
    content: node?.data.content || '',
    selectedSources: [] as string[],
  });

  // Find incoming connections to this node
  const incomingConnections = React.useMemo(() => {
    if (!node) return [];
    return edges.filter(edge => edge.target === node.id);
  }, [edges, node]);

  // Find source nodes for incoming connections
  const sourceNodes = React.useMemo(() => {
    if (!node) return [];
    const sourceIds = incomingConnections.map(edge => edge.source);
    return sourceIds.map(id => {
      const sourceNode = nodes.find(n => n.id === id);
      return {
        id,
        label: sourceNode?.data.label || `Node ${id}`,
      };
    });
  }, [incomingConnections, node, nodes]);

  React.useEffect(() => {
    if (node) {
      setNodeData({
        label: node.data.label || '',
        content: node.data.content || '',
        selectedSources: node.data.selectedSources || [],
      });
    }
  }, [node]);

  const handleSave = () => {
    if (node) {
      updateNode(node.id, {
        data: {
          ...node.data,
          ...nodeData,
        },
      });
    }
    onClose();
  };

  const handleSourceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    setNodeData({
      ...nodeData,
      selectedSources: value,
    });
  };

  if (!node) return null;

  return (
    <Dialog
      open={!!node}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '60vh',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Node</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3} py={2}>
          <TextField
            label="Node Name"
            value={nodeData.label}
            onChange={(e) => setNodeData({ ...nodeData, label: e.target.value })}
            fullWidth
          />
          <TextField
            label="Content"
            value={nodeData.content}
            onChange={(e) => setNodeData({ ...nodeData, content: e.target.value })}
            multiline
            rows={4}
            fullWidth
          />
          
          {incomingConnections.length > 0 && (
            <>
              <Divider />
              <Typography variant="subtitle1" gutterBottom>
                Incoming Connections
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="source-select-label">Select Source Nodes</InputLabel>
                <Select
                  labelId="source-select-label"
                  multiple
                  value={nodeData.selectedSources}
                  onChange={handleSourceChange}
                  input={<OutlinedInput label="Select Source Nodes" />}
                  renderValue={(selected) => {
                    const selectedLabels = selected.map(id => {
                      const sourceNode = sourceNodes.find(n => n.id === id);
                      return sourceNode?.label || `Node ${id}`;
                    });
                    return selectedLabels.join(', ');
                  }}
                >
                  {sourceNodes.map((sourceNode) => (
                    <MenuItem key={sourceNode.id} value={sourceNode.id}>
                      <Checkbox checked={nodeData.selectedSources.indexOf(sourceNode.id) > -1} />
                      <ListItemText primary={sourceNode.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              NLP Analysis
            </Typography>
            {node.data.nlpAnalysis ? (
              <Box>
                <Typography variant="body2">
                  Sentiment: {node.data.nlpAnalysis.sentiment || 'Not analyzed'}
                </Typography>
                <Typography variant="body2">
                  Keywords: {node.data.nlpAnalysis.keywords?.join(',') || 'Not analyzed'}
                </Typography>
                <Typography variant="body2">
                  Summary: {node.data.nlpAnalysis.summary || 'Not analyzed'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No NLP analysis available
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeExpandedView; 