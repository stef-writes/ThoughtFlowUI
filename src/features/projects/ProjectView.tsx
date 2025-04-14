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

// Mock data for workspaces
const mockWorkspaces = [
  {
    id: '1',
    name: 'Backend Architecture',
    description: 'Server-side components and infrastructure',
    loci: 3,
    lastUpdated: '2024-03-15 14:30',
    status: 'active',
  },
  {
    id: '2',
    name: 'Frontend Development',
    description: 'User interface and client-side logic',
    loci: 4,
    lastUpdated: '2024-03-14 09:15',
    status: 'active',
  },
  {
    id: '3',
    name: 'Data Pipeline',
    description: 'Data processing and analytics workflows',
    loci: 2,
    lastUpdated: '2024-03-13 16:45',
    status: 'active',
  },
];

const ProjectView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const theme = useTheme();

  // Mock project data
  const project = {
    id: projectId,
    name: `Project ${projectId}`,
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
          <Typography color="text.primary">{project.name}</Typography>
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
            Project Workspaces
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
            Workspaces help you organize different aspects of your project. Each workspace can contain multiple loci, 
            which are specific focus areas or components of your work. Use workspaces to group related features, 
            user flows, or development phases together.
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
            Workspaces
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Add workspace logic */}}
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
            New Workspace
          </Button>
        </Box>

        <Grid container spacing={4}>
          {mockWorkspaces.map((workspace) => (
            <Grid item xs={12} sm={6} md={4} key={workspace.id}>
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
                  onClick={() => navigate(`/projects/${projectId}/workspaces/${workspace.id}`)}
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
                          {workspace.name}
                        </Typography>
                        <Chip 
                          label={workspace.status} 
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
                      {workspace.description}
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
                          {workspace.loci} loci
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ 
                          fontSize: 16, 
                          color: 'text.secondary',
                          mr: 0.5 
                        }} />
                        <Typography variant="body2" color="text.secondary">
                          Updated: {workspace.lastUpdated}
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

export default ProjectView; 