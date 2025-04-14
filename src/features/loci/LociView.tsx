import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// Mock data for scriptchains
const mockScriptChains = [
  {
    id: '1',
    name: 'Payment Authorization',
    description: 'Handles payment verification and authorization processes',
    nodes: 5,
    lastRun: '2024-03-15 14:30',
    status: 'active',
  },
  {
    id: '2',
    name: 'Transaction Settlement',
    description: 'Manages transaction clearing and settlement workflows',
    nodes: 4,
    lastRun: '2024-03-14 09:15',
    status: 'active',
  },
  {
    id: '3',
    name: 'Fraud Detection',
    description: 'Implements fraud detection algorithms and alerts',
    nodes: 3,
    lastRun: '2024-03-13 16:45',
    status: 'active',
  },
];

const LociView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, workspaceId, lociId } = useParams();
  const theme = useTheme();

  // Mock loci data
  const loci = {
    id: lociId,
    name: `Loci ${lociId}`,
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          sx={{ mb: 4 }}
        >
          <Link 
            component={RouterLink} 
            to="/" 
            color="inherit" 
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Projects
          </Link>
          <Link 
            component={RouterLink} 
            to={`/projects/${projectId}`}
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Project {projectId}
          </Link>
          <Link 
            component={RouterLink} 
            to={`/projects/${projectId}/workspaces/${workspaceId}`}
            color="inherit"
            sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Workspace {workspaceId}
          </Link>
          <Typography color="text.primary">{loci.name}</Typography>
        </Breadcrumbs>

        {/* Description Section */}
        <Box 
          sx={{ 
            mb: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
            Script Chains
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
            Script chains are the core automation components in ThoughtFlow. Each chain is a sequence of connected nodes 
            that process and transform data. Use script chains to create sophisticated workflows, integrate AI models, 
            and automate complex tasks. Chain nodes together to build powerful, reusable automation sequences.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 6 
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            letterSpacing: '-0.5px'
          }}>
            ScriptChains
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Add scriptchain logic */}}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }
            }}
          >
            New ScriptChain
          </Button>
        </Box>

        <Grid container spacing={4}>
          {mockScriptChains.map((scriptchain) => (
            <Grid item xs={12} sm={6} md={4} key={scriptchain.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%' }}
                  onClick={() => navigate(`/projects/${projectId}/workspaces/${workspaceId}/loci/${lociId}/scriptchains/${scriptchain.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccountTreeIcon sx={{ 
                        fontSize: 32, 
                        color: 'primary.main', 
                        mr: 2,
                        backgroundColor: 'primary.light',
                        borderRadius: '8px',
                        p: 0.5
                      }} />
                      <Box>
                        <Typography variant="h6" component="h2" sx={{ 
                          fontWeight: 600,
                          mb: 0.5
                        }}>
                          {scriptchain.name}
                        </Typography>
                        <Chip 
                          label={scriptchain.status} 
                          size="small"
                          color="success"
                          sx={{ 
                            height: 20,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {scriptchain.description}
                    </Typography>

                    <Stack 
                      direction="row" 
                      spacing={2}
                      sx={{ 
                        mt: 'auto',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PlayCircleOutlineIcon sx={{ 
                          fontSize: 16, 
                          color: 'text.secondary',
                          mr: 0.5 
                        }} />
                        <Typography variant="body2" color="text.secondary">
                          {scriptchain.nodes} nodes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ 
                          fontSize: 16, 
                          color: 'text.secondary',
                          mr: 0.5 
                        }} />
                        <Typography variant="body2" color="text.secondary">
                          Last run: {scriptchain.lastRun}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LociView; 