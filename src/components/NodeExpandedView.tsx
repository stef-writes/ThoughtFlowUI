import React from 'react';
import {
  Dialog,
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
  Menu,
  SelectChangeEvent,
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { WorkflowNode, NodeMetadata } from '../types/workflow';
import { useWorkflowStore } from '../store/workflowStore';

interface NodeExpandedViewProps {
  node: WorkflowNode | null;
  onClose: () => void;
}

const NodeExpandedView: React.FC<NodeExpandedViewProps> = ({ node, onClose }) => {
  const { updateNode, edges, nodes } = useWorkflowStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [nodeData, setNodeData] = React.useState({
    label: node?.data.label || '',
    content: node?.data.content || '',
    selectedSources: [] as string[],
    metadata: {
      created: node?.data.metadata?.created || new Date().toISOString(),
      lastModified: node?.data.metadata?.lastModified || new Date().toISOString(),
      author: node?.data.metadata?.author || '',
      tags: node?.data.metadata?.tags || [],
      priority: node?.data.metadata?.priority || 'medium',
      status: node?.data.metadata?.status || 'draft',
      version: node?.data.metadata?.version || 1,
      dependencies: node?.data.metadata?.dependencies || [],
      notes: node?.data.metadata?.notes || '',
      customFields: node?.data.metadata?.customFields || {},
    } as NodeMetadata,
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
        metadata: {
          created: node.data.metadata?.created || new Date().toISOString(),
          lastModified: node.data.metadata?.lastModified || new Date().toISOString(),
          author: node.data.metadata?.author || '',
          tags: node.data.metadata?.tags || [],
          priority: node.data.metadata?.priority || 'medium',
          status: node.data.metadata?.status || 'draft',
          version: node.data.metadata?.version || 1,
          dependencies: node.data.metadata?.dependencies || [],
          notes: node.data.metadata?.notes || '',
          customFields: node.data.metadata?.customFields || {},
        },
      });
    }
  }, [node]);

  const handleSave = () => {
    if (node) {
      updateNode(node.id, {
        data: {
          ...node.data,
          ...nodeData,
          metadata: {
            ...nodeData.metadata,
            lastModified: new Date().toISOString(),
          },
        },
      });
    }
    onClose();
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
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
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        bgcolor: 'primary.light'
      }}>
        <Typography color="white">Edit Node</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            color="primary"
          >
            <SettingsIcon />
          </IconButton>
          <IconButton 
            onClick={onClose}
            size="small"
            edge="end"
            aria-label="close"
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleSettingsClose}>Export Node Data</MenuItem>
        <MenuItem onClick={handleSettingsClose}>Duplicate Node</MenuItem>
        <MenuItem onClick={handleSettingsClose}>Delete Node</MenuItem>
        <Divider />
        <MenuItem onClick={handleSettingsClose}>Advanced Settings</MenuItem>
      </Menu>
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
          
          <Divider />
          <Typography variant="subtitle1" gutterBottom>
            Metadata
          </Typography>
          
          <Box display="flex" gap={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={nodeData.metadata.status}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  metadata: { ...nodeData.metadata, status: e.target.value as any }
                })}
                label="Status"
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={nodeData.metadata.priority}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  metadata: { ...nodeData.metadata, priority: e.target.value as any }
                })}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <TextField
            label="Author"
            value={nodeData.metadata.author}
            onChange={(e) => setNodeData({
              ...nodeData,
              metadata: { ...nodeData.metadata, author: e.target.value }
            })}
            fullWidth
          />
          
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={nodeData.metadata.tags}
            onChange={(_, newValue) => setNodeData({
              ...nodeData,
              metadata: { ...nodeData.metadata, tags: newValue }
            })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags"
              />
            )}
          />
          
          <TextField
            label="Notes"
            value={nodeData.metadata.notes}
            onChange={(e) => setNodeData({
              ...nodeData,
              metadata: { ...nodeData.metadata, notes: e.target.value }
            })}
            multiline
            rows={2}
            fullWidth
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              System Information
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(nodeData.metadata.created).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Modified: {new Date(nodeData.metadata.lastModified).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Version: {nodeData.metadata.version}
              </Typography>
            </Stack>
          </Box>
          
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
                  onChange={(event: SelectChangeEvent<typeof nodeData.selectedSources>) => {
                    setNodeData({
                      ...nodeData,
                      selectedSources: typeof event.target.value === 'string' ? [event.target.value] : event.target.value
                    });
                  }}
                  input={<OutlinedInput label="Select Source Nodes" />}
                  renderValue={(selected: string[]) => {
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
              Node Output
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
                No Output Generated Yet
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 1, 
          p: 2, 
          borderTop: '1px solid rgba(0, 0, 0, 0.12)' 
        }}
      >
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          startIcon={<SettingsIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          variant="outlined"
          color="primary"
        >
          Smart Config
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Dialog>
  );
};

export default NodeExpandedView; 