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
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ZenModeIcon from '@mui/icons-material/VisibilityOff';
import NormalModeIcon from '@mui/icons-material/Visibility';
import { WorkflowNode, NodeMetadata } from '../types/workflow';
import { useWorkflowStore } from '../store/workflowStore';

interface NodeExpandedViewProps {
  node: WorkflowNode | null;
  onClose: () => void;
}

const NodeExpandedView: React.FC<NodeExpandedViewProps> = ({ node, onClose }) => {
  const { updateNode, edges, nodes } = useWorkflowStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isZenMode, setIsZenMode] = React.useState(false);
  const [nodeData, setNodeData] = React.useState({
    label: node?.data.label || '',
    content: node?.data.content || '',
    selectedSources: [] as string[],
    metadata: {
      created: node?.data.metadata?.created || new Date().toISOString(),
      lastModified: node?.data.metadata?.lastModified || new Date().toISOString(),
      template: '',
      inputs: [],
      context: '',
      tokenLimit: 2000,
      temperature: 0.7,
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
          ...(isZenMode && {
            maxWidth: '800px',
            minHeight: '70vh',
            maxHeight: '90vh',
          }),
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(to right, #B49042, #C4A052)',
        color: '#121212'
      }}>
        <TextField
          value={nodeData.label}
          onChange={(e) => setNodeData({ ...nodeData, label: e.target.value })}
          placeholder="Node Name"
          variant="standard"
          sx={{ 
            '& .MuiInputBase-root': { color: '#121212' },
            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(0, 0, 0, 0.42)' },
            '& .MuiInput-underline:hover:before': { borderBottomColor: 'rgba(0, 0, 0, 0.87)' },
            '& .MuiInput-underline:after': { borderBottomColor: '#121212' },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(0, 0, 0, 0.7)' }
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}>
            <IconButton
              onClick={() => setIsZenMode(!isZenMode)}
              size="small"
              sx={{ color: '#121212' }}
            >
              {isZenMode ? <NormalModeIcon /> : <ZenModeIcon />}
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{ color: '#121212' }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton 
            onClick={onClose}
            size="small"
            edge="end"
            aria-label="close"
            sx={{ color: '#121212' }}
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
              Created: {nodeData.metadata.created ? new Date(nodeData.metadata.created).toLocaleString() : 'Not set'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last Modified: {nodeData.metadata.lastModified ? new Date(nodeData.metadata.lastModified).toLocaleString() : 'Not set'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Version: {nodeData.metadata.version}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <DialogContent dividers>
        {isZenMode ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            height: '100%',
            p: 3
          }}>
            {/* User Input */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>User Input</Typography>
              <TextField
                value={nodeData.content}
                onChange={(e) => setNodeData({ ...nodeData, content: e.target.value })}
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                placeholder="Enter your input here..."
              />
            </Box>

            {/* Input Selector */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>Input Sources</Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={nodeData.selectedSources}
                  onChange={(e) => setNodeData({
                    ...nodeData,
                    selectedSources: e.target.value as string[]
                  })}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={sourceNodes.find(n => n.id === value)?.label || value}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {sourceNodes.map((source) => (
                    <MenuItem key={source.id} value={source.id}>
                      <Checkbox checked={nodeData.selectedSources.indexOf(source.id) > -1} />
                      <ListItemText primary={source.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Output */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Output</Typography>
              <TextField
                value={nodeData.metadata.additionalInput}
                onChange={(e) => setNodeData({
                  ...nodeData,
                  metadata: { ...nodeData.metadata, additionalInput: e.target.value }
                })}
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                placeholder="Output will appear here..."
              />
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={3} py={2}>
            {/* Smart Config */}
            <Accordion 
              elevation={0}
              sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2">Smart Config</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Model Selection */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Model Selection</Typography>
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
                  </Box>

                  {/* Model Configuration */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Model Configuration</Typography>
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
                  </Box>

                  {/* Advanced Settings */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Advanced Settings</Typography>
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
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Connections */}
            <Accordion 
              elevation={0}
              defaultExpanded={incomingConnections.length > 0}
              sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={sourceNodes.find(n => n.id === value)?.label || value}
                                size="small"
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {sourceNodes.map((source) => (
                          <MenuItem key={source.id} value={source.id}>
                            <Checkbox checked={nodeData.selectedSources.indexOf(source.id) > -1} />
                            <ListItemText primary={source.label} />
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

            {/* User Input */}
            <Accordion 
              elevation={0}
              defaultExpanded
              sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
                  value={nodeData.content}
                  onChange={(e) => setNodeData({ ...nodeData, content: e.target.value })}
                  multiline
                  rows={6}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your input here..."
                />
              </AccordionDetails>
            </Accordion>

            {/* Output */}
            <Accordion 
              elevation={0}
              defaultExpanded
              sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
                <Typography variant="subtitle2">Output</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  value={nodeData.metadata.additionalInput}
                  onChange={(e) => setNodeData({
                    ...nodeData,
                    metadata: { ...nodeData.metadata, additionalInput: e.target.value }
                  })}
                  multiline
                  rows={6}
                  fullWidth
                  variant="outlined"
                  placeholder="Output will appear here..."
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
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