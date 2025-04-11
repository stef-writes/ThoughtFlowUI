import React from 'react';
import {
  Dialog,
  DialogContent,
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
  LinearProgress,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
      template: node?.data.metadata?.template || '',
      inputs: node?.data.metadata?.inputs || [],
      context: node?.data.metadata?.context || '',
      tokenLimit: node?.data.metadata?.tokenLimit || 2000,
      temperature: node?.data.metadata?.temperature || 0.7,
      topP: node?.data.metadata?.topP || 1.0,
      frequencyPenalty: node?.data.metadata?.frequencyPenalty || 0.0,
      presencePenalty: node?.data.metadata?.presencePenalty || 0.0,
      model: node?.data.metadata?.model || 'gpt-4',
      version: node?.data.metadata?.version || 1,
    } as NodeMetadata,
  });

  // Status colors
  const statusColors = {
    draft: 'bg-gray-300',
    'in-progress': 'bg-blue-400',
    completed: 'bg-green-500',
    archived: 'bg-gray-500',
  };

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
          template: node.data.metadata?.template || '',
          inputs: node.data.metadata?.inputs || [],
          context: node.data.metadata?.context || '',
          tokenLimit: node.data.metadata?.tokenLimit || 2000,
          temperature: node.data.metadata?.temperature || 0.7,
          topP: node.data.metadata?.topP || 1.0,
          frequencyPenalty: node.data.metadata?.frequencyPenalty || 0.0,
          presencePenalty: node.data.metadata?.presencePenalty || 0.0,
          model: node.data.metadata?.model || 'gpt-4',
          version: node.data.metadata?.version || 1,
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
      {/* Status Bar */}
      <Box sx={{ 
        height: 4,
        backgroundColor: statusColors[nodeData.metadata.status as keyof typeof statusColors],
      }} />

      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        background: 'linear-gradient(to right, #1976d2, #2196f3)',
        color: 'white'
      }}>
        <TextField
          value={nodeData.label}
          onChange={(e) => setNodeData({ ...nodeData, label: e.target.value })}
          placeholder="Node Name"
          variant="standard"
          sx={{ 
            '& .MuiInputBase-root': { color: 'white' },
            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255, 255, 255, 0.42)' },
            '& .MuiInput-underline:hover:before': { borderBottomColor: 'rgba(255, 255, 255, 0.87)' },
            '& .MuiInput-underline:after': { borderBottomColor: 'white' },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.7)' }
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{ color: 'white' }}
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
        <MenuItem onClick={handleSettingsClose}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2">System Information</Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(nodeData.metadata.created).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last Modified: {new Date(nodeData.metadata.lastModified).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Version: {nodeData.metadata.version}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3} py={2}>
          {/* Model Select */}
          <Accordion 
            elevation={0}
            defaultExpanded
            sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: 'action.hover',
                '& .MuiAccordionSummary-content': { my: 0 }
              }}
            >
              <Typography variant="subtitle2">Model Select</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Model</InputLabel>
                    <Select
                      value={nodeData.metadata.model}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        metadata: { ...nodeData.metadata, model: e.target.value }
                      })}
                      label="Model"
                    >
                      <MenuItem value="gpt-4">GPT-4</MenuItem>
                      <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                      <MenuItem value="claude-2">Claude 2</MenuItem>
                      <MenuItem value="claude-3">Claude 3</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Token Limit"
                    type="number"
                    value={nodeData.metadata.tokenLimit}
                    onChange={(e) => setNodeData({
                      ...nodeData,
                      metadata: { ...nodeData.metadata, tokenLimit: parseInt(e.target.value) }
                    })}
                    size="small"
                    sx={{ width: '150px' }}
                  />
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Model Config */}
          <Accordion 
            elevation={0}
            sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: 'action.hover',
                '& .MuiAccordionSummary-content': { my: 0 }
              }}
            >
              <Typography variant="subtitle2">Model Config</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <TextField
                  label="System Message"
                  value={nodeData.metadata.template}
                  onChange={(e) => setNodeData({
                    ...nodeData,
                    metadata: { ...nodeData.metadata, template: e.target.value }
                  })}
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                  helperText="The system message that guides the LLM's behavior"
                />

                <TextField
                  label="Output Instructions"
                  value={nodeData.metadata.context}
                  onChange={(e) => setNodeData({
                    ...nodeData,
                    metadata: { ...nodeData.metadata, context: e.target.value }
                  })}
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                  helperText="Instructions for how the LLM should format its output"
                />
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Advanced Settings */}
          <Accordion 
            elevation={0}
            sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: 'action.hover',
                '& .MuiAccordionSummary-content': { my: 0 }
              }}
            >
              <Typography variant="subtitle2">Advanced Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Temperature"
                    type="number"
                    value={nodeData.metadata.temperature}
                    onChange={(e) => setNodeData({
                      ...nodeData,
                      metadata: { ...nodeData.metadata, temperature: parseFloat(e.target.value) }
                    })}
                    size="small"
                    sx={{ width: '150px' }}
                    inputProps={{ step: 0.1, min: 0, max: 2 }}
                    helperText="Controls randomness (0-2)"
                  />

                  <TextField
                    label="Top P"
                    type="number"
                    value={nodeData.metadata.topP}
                    onChange={(e) => setNodeData({
                      ...nodeData,
                      metadata: { ...nodeData.metadata, topP: parseFloat(e.target.value) }
                    })}
                    size="small"
                    sx={{ width: '150px' }}
                    inputProps={{ step: 0.1, min: 0, max: 1 }}
                    helperText="Controls diversity (0-1)"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Frequency Penalty"
                    type="number"
                    value={nodeData.metadata.frequencyPenalty}
                    onChange={(e) => setNodeData({
                      ...nodeData,
                      metadata: { ...nodeData.metadata, frequencyPenalty: parseFloat(e.target.value) }
                    })}
                    size="small"
                    sx={{ width: '150px' }}
                    inputProps={{ step: 0.1, min: -2, max: 2 }}
                    helperText="Controls repetition (-2 to 2)"
                  />

                  <TextField
                    label="Presence Penalty"
                    type="number"
                    value={nodeData.metadata.presencePenalty}
                    onChange={(e) => setNodeData({
                      ...nodeData,
                      metadata: { ...nodeData.metadata, presencePenalty: parseFloat(e.target.value) }
                    })}
                    size="small"
                    sx={{ width: '150px' }}
                    inputProps={{ step: 0.1, min: -2, max: 2 }}
                    helperText="Controls topic diversity (-2 to 2)"
                  />
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Content */}
          <Accordion 
            elevation={0}
            defaultExpanded={incomingConnections.length > 0}
            sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: 'action.hover',
                '& .MuiAccordionSummary-content': { my: 0 }
              }}
            >
              <Typography variant="subtitle2">Connections</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {incomingConnections.length > 0 ? (
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Active Connections</InputLabel>
                    <Select
                      multiple
                      value={nodeData.selectedSources}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        selectedSources: e.target.value as string[]
                      })}
                      input={<OutlinedInput label="Active Connections" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const sourceNode = sourceNodes.find(n => n.id === value);
                            return (
                              <Chip 
                                key={value} 
                                label={sourceNode?.label || `Node ${value}`}
                                size="small"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {sourceNodes.map((sourceNode) => (
                        <MenuItem key={sourceNode.id} value={sourceNode.id}>
                          <Checkbox checked={nodeData.selectedSources.indexOf(sourceNode.id) > -1} />
                          <ListItemText primary={sourceNode.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No incoming connections
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion 
            elevation={0}
            defaultExpanded
            sx={{ 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: 'action.hover',
                '& .MuiAccordionSummary-content': { my: 0 }
              }}
            >
              <Typography variant="subtitle2">User Input</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="User Input"
                value={nodeData.content}
                onChange={(e) => setNodeData({ ...nodeData, content: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Output</Typography>
          <TextField
            label="Node Output"
            value={nodeData.metadata.additionalInput || ''}
            onChange={(e) => setNodeData({
              ...nodeData,
              metadata: { ...nodeData.metadata, additionalInput: e.target.value }
            })}
            multiline
            rows={4}
            fullWidth
          />
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
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Dialog>
  );
};

export default NodeExpandedView; 