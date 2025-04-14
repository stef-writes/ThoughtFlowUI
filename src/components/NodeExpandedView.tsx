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
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ZenModeIcon from '@mui/icons-material/VisibilityOff';
import NormalModeIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import ApiIcon from '@mui/icons-material/Api';
import EditIcon from '@mui/icons-material/Edit';
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
  
  // Initialize nodeData state
  const [nodeData, setNodeData] = React.useState({
    label: '',
    content: '',
    selectedSources: [] as string[],
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      template: '',
      inputs: [],
      context: '',
      tokenLimit: 2000,
      temperature: 0.7,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      model: 'gpt-4',
      version: 1,
      additionalInput: '',
      dataSource: { type: 'none' } as NodeMetadata['dataSource'], // Default data source
    } as NodeMetadata,
  });

  // Effect to update state when node prop changes
  React.useEffect(() => {
    if (node) {
      setNodeData({
        label: node.data.label || '',
        content: node.data.content || '',
        selectedSources: node.data.selectedSources || [],
        metadata: {
          ...node.data.metadata,
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
          additionalInput: node.data.metadata?.additionalInput || '',
          // Ensure dataSource is correctly populated from the node prop
          dataSource: node.data.metadata?.dataSource || { type: 'none' },
        }
      });
    } else {
      // Reset state if node is null (e.g., view closed)
      setNodeData({
        label: '',
        content: '',
        selectedSources: [],
        metadata: {
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          template: '',
          inputs: [],
          context: '',
          tokenLimit: 2000,
          temperature: 0.7,
          topP: 1.0,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          model: 'gpt-4',
          version: 1,
          additionalInput: '',
          dataSource: { type: 'none' },
        } as NodeMetadata,
      });
    }
  }, [node]);

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
                '&:before': { display: 'none' },
                '& .MuiAccordionSummary-root': {
                  minHeight: '48px',
                  padding: '0 16px',
                },
                '& .MuiAccordionDetails-root': {
                  padding: '16px',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  bgcolor: 'transparent',
                  '& .MuiAccordionSummary-content': { my: 0 }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Smart Config</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {/* Model Selection - More Compact */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <Select
                        value={nodeData.metadata.model}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          metadata: { ...nodeData.metadata, model: e.target.value }
                        })}
                        sx={{ 
                          '& .MuiSelect-select': { py: 1 },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                        }}
                      >
                        <MenuItem value="gpt-4">GPT-4</MenuItem>
                        <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                        <MenuItem value="claude-2">Claude 2</MenuItem>
                        <MenuItem value="claude-3">Claude 3</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      type="number"
                      value={nodeData.metadata.tokenLimit}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        metadata: { ...nodeData.metadata, tokenLimit: parseInt(e.target.value) }
                      })}
                      size="small"
                      sx={{ 
                        width: '120px',
                        '& .MuiOutlinedInput-root': { py: 1 },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                      }}
                      placeholder="Token Limit"
                    />
                  </Box>

                  {/* Model Configuration - Simplified */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      value={nodeData.metadata.template}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        metadata: { ...nodeData.metadata, template: e.target.value }
                      })}
                      multiline
                      rows={1}
                      size="small"
                      fullWidth
                      placeholder="System Message"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { py: 1 },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                      }}
                    />

                    <TextField
                      value={nodeData.metadata.context}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        metadata: { ...nodeData.metadata, context: e.target.value }
                      })}
                      multiline
                      rows={1}
                      size="small"
                      fullWidth
                      placeholder="Output Instructions"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { py: 1 },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                      }}
                    />
                  </Box>

                  {/* Advanced Settings - More Compact */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3,
                    flexWrap: 'wrap',
                    '& > *': {
                      flex: '1 1 200px',
                      minWidth: '200px'
                    }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          mb: 1
                        }}
                      >
                        Temperature
                      </Typography>
                      <TextField
                        type="number"
                        value={nodeData.metadata.temperature}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          metadata: { ...nodeData.metadata, temperature: parseFloat(e.target.value) }
                        })}
                        size="small"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': { py: 1 },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                        }}
                        placeholder="0.7"
                      />
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          mb: 1
                        }}
                      >
                        Top P
                      </Typography>
                      <TextField
                        type="number"
                        value={nodeData.metadata.topP}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          metadata: { ...nodeData.metadata, topP: parseFloat(e.target.value) }
                        })}
                        size="small"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': { py: 1 },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                        }}
                        placeholder="1.0"
                      />
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          mb: 1
                        }}
                      >
                        Freq Penalty
                      </Typography>
                      <TextField
                        type="number"
                        value={nodeData.metadata.frequencyPenalty}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          metadata: { ...nodeData.metadata, frequencyPenalty: parseFloat(e.target.value) }
                        })}
                        size="small"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': { py: 1 },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                        }}
                        placeholder="0.0"
                      />
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          mb: 1
                        }}
                      >
                        Presence Penalty
                      </Typography>
                      <TextField
                        type="number"
                        value={nodeData.metadata.presencePenalty}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          metadata: { ...nodeData.metadata, presencePenalty: parseFloat(e.target.value) }
                        })}
                        size="small"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': { py: 1 },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                        }}
                        placeholder="0.0"
                      />
                    </Box>
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
                '&:before': { display: 'none' },
                '& .MuiAccordionSummary-root': {
                  minHeight: '48px',
                  padding: '0 16px',
                },
                '& .MuiAccordionDetails-root': {
                  padding: '16px',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  bgcolor: 'transparent',
                  '& .MuiAccordionSummary-content': { my: 0 }
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Connections</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {incomingConnections.length > 0 ? (
                  <FormControl fullWidth>
                    <Select
                      multiple
                      value={nodeData.selectedSources}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        selectedSources: e.target.value as string[]
                      })}
                      sx={{ 
                        '& .MuiSelect-select': { py: 1 },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.12)' }
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip 
                              key={value} 
                              label={sourceNodes.find(n => n.id === value)?.label || value}
                              size="small"
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'common.white',
                                '& .MuiChip-deleteIcon': { color: 'common.white' }
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {sourceNodes.map((source) => (
                        <MenuItem key={source.id} value={source.id}>
                          <Checkbox 
                            checked={nodeData.selectedSources.indexOf(source.id) > -1}
                            sx={{ 
                              color: 'primary.main',
                              '&.Mui-checked': { color: 'primary.main' }
                            }}
                          />
                          <ListItemText 
                            primary={source.label}
                            sx={{ 
                              '& .MuiTypography-root': { 
                                fontSize: '0.875rem',
                                color: 'text.primary'
                              }
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No incoming connections
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Data Source */}
            <Accordion 
              elevation={0}
              sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '&:before': { display: 'none' },
                '& .MuiAccordionSummary-root': {
                  minHeight: '48px',
                  padding: '0 16px',
                },
                '& .MuiAccordionDetails-root': {
                  padding: '16px',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  bgcolor: 'transparent',
                  '& .MuiAccordionSummary-content': { my: 0 }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUploadIcon fontSize="small" sx={{ color: '#C4A052' }} />
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Data Source</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={nodeData.metadata.dataSource?.type || 'none'}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        metadata: {
                          ...nodeData.metadata,
                          dataSource: {
                            ...nodeData.metadata.dataSource,
                            type: e.target.value as 'url' | 'api' | 'file' | 'manual' | 'none'
                          }
                        }
                      })}
                    >
                      <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: '#C4A052', '&.Mui-checked': { color: '#C4A052' } }} />}
                        label={
                          <Typography sx={{ color: 'text.primary' }}>No External Data</Typography>
                        }
                      />
                      <FormControlLabel
                        value="url"
                        control={<Radio sx={{ color: '#C4A052', '&.Mui-checked': { color: '#C4A052' } }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinkIcon fontSize="small" />
                            <Typography sx={{ color: 'text.primary' }}>URL</Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="api"
                        control={<Radio sx={{ color: '#C4A052', '&.Mui-checked': { color: '#C4A052' } }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ApiIcon fontSize="small" />
                            <Typography sx={{ color: 'text.primary' }}>API</Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="file"
                        control={<Radio sx={{ color: '#C4A052', '&.Mui-checked': { color: '#C4A052' } }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CloudUploadIcon fontSize="small" />
                            <Typography sx={{ color: 'text.primary' }}>File Upload</Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="manual"
                        control={<Radio sx={{ color: '#C4A052', '&.Mui-checked': { color: '#C4A052' } }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EditIcon fontSize="small" />
                            <Typography sx={{ color: 'text.primary' }}>Manual Input</Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {nodeData.metadata.dataSource?.type === 'url' && (
                    <TextField
                      fullWidth
                      placeholder="https://example.com/data.json"
                      value={nodeData.metadata.dataSource.url || ''}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        metadata: {
                          ...nodeData.metadata,
                          dataSource: {
                            type: 'url',
                            url: e.target.value
                          }
                        }
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'text.primary',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.12)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C4A052',
                          },
                        },
                      }}
                    />
                  )}

                  {nodeData.metadata.dataSource?.type === 'api' && (
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        placeholder="API Endpoint"
                        value={nodeData.metadata.dataSource.apiEndpoint || ''}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          metadata: {
                            ...nodeData.metadata,
                            dataSource: {
                              type: 'api',
                              apiEndpoint: e.target.value,
                              apiKey: nodeData.metadata.dataSource?.apiKey || ''
                            }
                          }
                        })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.12)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#C4A052',
                            },
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        type="password"
                        placeholder="API Key"
                        value={nodeData.metadata.dataSource.apiKey || ''}
                        onChange={(e) => setNodeData({
                          ...nodeData,
                          metadata: {
                            ...nodeData.metadata,
                            dataSource: {
                              type: 'api',
                              apiEndpoint: nodeData.metadata.dataSource?.apiEndpoint || '',
                              apiKey: e.target.value
                            }
                          }
                        })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.12)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#C4A052',
                            },
                          },
                        }}
                      />
                    </Stack>
                  )}

                  {nodeData.metadata.dataSource?.type === 'file' && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: '#C4A052',
                          backgroundColor: 'rgba(196, 160, 82, 0.08)',
                        },
                      }}
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNodeData({
                              ...nodeData,
                              metadata: {
                                ...nodeData.metadata,
                                dataSource: {
                                  type: 'file',
                                  file
                                }
                              }
                            });
                          }
                        }}
                      />
                    </Button>
                  )}

                  {nodeData.metadata.dataSource?.type === 'manual' && (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Enter your data here..."
                      value={nodeData.metadata.dataSource.manualInput || ''}
                      onChange={(e) => setNodeData({
                        ...nodeData,
                        metadata: {
                          ...nodeData.metadata,
                          dataSource: {
                            type: 'manual',
                            manualInput: e.target.value
                          }
                        }
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'text.primary',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.12)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C4A052',
                          },
                        },
                      }}
                    />
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* User Input */}
            <Accordion 
              elevation={0}
              defaultExpanded
              sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '&:before': { display: 'none' },
                '& .MuiAccordionSummary-root': {
                  minHeight: '48px',
                  padding: '0 16px',
                },
                '& .MuiAccordionDetails-root': {
                  padding: '16px',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  bgcolor: 'transparent',
                  '& .MuiAccordionSummary-content': { my: 0 }
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>User Input</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  value={nodeData.content}
                  onChange={(e) => setNodeData({ ...nodeData, content: e.target.value })}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your input here..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      py: 1,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      transition: 'border-color 0.2s ease-in-out'
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      lineHeight: 1.5
                    }
                  }}
                />
              </AccordionDetails>
            </Accordion>

            {/* Output */}
            <Accordion 
              elevation={0}
              defaultExpanded
              sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '&:before': { display: 'none' },
                '& .MuiAccordionSummary-root': {
                  minHeight: '48px',
                  padding: '0 16px',
                },
                '& .MuiAccordionDetails-root': {
                  padding: '16px',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  bgcolor: 'transparent',
                  '& .MuiAccordionSummary-content': { my: 0 }
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>Output</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  value={nodeData.metadata.additionalInput}
                  onChange={(e) => setNodeData({
                    ...nodeData,
                    metadata: { ...nodeData.metadata, additionalInput: e.target.value }
                  })}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder="Output will appear here..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      py: 1,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      transition: 'border-color 0.2s ease-in-out'
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      lineHeight: 1.5
                    }
                  }}
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