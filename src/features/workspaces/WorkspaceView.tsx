import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ScriptChain {
  id: string;
  name: string;
  description: string;
  status: string;
  lastUpdated: string;
}

// Mock data for scriptchains
const initialScriptChains: ScriptChain[] = [
  {
    id: '1',
    name: 'Real Estate Marketing Content Generator',
    description: 'Generates property analysis, blog posts, and social media content from property & demographic data.',
    status: 'active',
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

const WorkspaceView: React.FC = () => {
  const { projectId, workspaceId } = useParams();
  const navigate = useNavigate();
  const [scriptchains, setScriptchains] = useState<ScriptChain[]>(initialScriptChains);
  const [isNewScriptchainDialogOpen, setIsNewScriptchainDialogOpen] = useState(false);
  const [newScriptchainName, setNewScriptchainName] = useState('');
  const [newScriptchainDescription, setNewScriptchainDescription] = useState('');

  const handleCreateScriptchain = () => {
    if (!newScriptchainName.trim()) return;

    const newScriptchain: ScriptChain = {
      id: String(Date.now()), // Simple ID generation
      name: newScriptchainName,
      description: newScriptchainDescription,
      status: 'active',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setScriptchains([...scriptchains, newScriptchain]);
    setNewScriptchainName('');
    setNewScriptchainDescription('');
    setIsNewScriptchainDialogOpen(false);
    navigate(`/projects/${projectId}/workspaces/${workspaceId}/scriptchains/${newScriptchain.id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workspace Scriptchains
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Scriptchains are the core workflows in your workspace. Each scriptchain represents a specific
          sequence of operations that can be executed, modified, and monitored.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            onClick={() => setIsNewScriptchainDialogOpen(true)}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                New Scriptchain
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {scriptchains.map((scriptchain) => (
          <Grid item xs={12} sm={6} md={4} key={scriptchain.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {scriptchain.name}
                  </Typography>
                  <Chip 
                    label={scriptchain.status}
                    size="small"
                    color="success"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {scriptchain.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Updated: {scriptchain.lastUpdated}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  onClick={() => navigate(`/projects/${projectId}/workspaces/${workspaceId}/scriptchains/${scriptchain.id}`)}
                >
                  Open
                </Button>
                <Box>
                  <Tooltip title="Run">
                    <IconButton size="small">
                      <PlayArrowIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <IconButton size="small">
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={isNewScriptchainDialogOpen} 
        onClose={() => setIsNewScriptchainDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Scriptchain</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Scriptchain Name"
              fullWidth
              value={newScriptchainName}
              onChange={(e) => setNewScriptchainName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newScriptchainDescription}
              onChange={(e) => setNewScriptchainDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewScriptchainDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateScriptchain}
            variant="contained"
            disabled={!newScriptchainName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspaceView; 