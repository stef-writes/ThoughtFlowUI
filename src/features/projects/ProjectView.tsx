import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid as MuiGrid, 
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

interface Workspace {
  id: string;
  name: string;
  description: string;
  scriptchains: number;
  lastUpdated: string;
}

// Mock data
const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Real Estate Marketing',
    description: 'Generates marketing content for property listings based on Zillow and Census data.',
    scriptchains: 1,
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

const ProjectView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const theme = useTheme();

  // Mock project data
  const project = {
    id: projectId,
    name: 'Product Vision',
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
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 500,
            color: theme.palette.primary.main
          }}>
            Project Workspaces
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Workspaces help you organize different aspects of your project. Each workspace can contain multiple scriptchains,
            allowing you to manage related workflows efficiently.
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
            color: theme.palette.primary.main,
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
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            New Workspace
          </Button>
        </Box>

        <MuiGrid container spacing={4}>
          {mockWorkspaces.map((workspace) => (
            <MuiGrid item xs={12} sm={6} md={4} key={workspace.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderRadius: 3,
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
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
                        color: theme.palette.primary.main,
                        mr: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: '8px',
                        p: 0.5
                      }} />
                      <Box>
                        <Typography variant="h6" component="h2" sx={{ 
                          fontWeight: 600,
                          mb: 0.5,
                          color: theme.palette.primary.main
                        }}>
                          {workspace.name}
                        </Typography>
                        <Chip 
                          label={workspace.scriptchains} 
                          size="small"
                          sx={{ 
                            height: 20,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
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
                        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ 
                          fontSize: 16, 
                          color: theme.palette.primary.main,
                          mr: 0.5 
                        }} />
                        <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
                          Updated: {workspace.lastUpdated}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </MuiGrid>
          ))}
        </MuiGrid>
      </Container>
    </Box>
  );
};

export default ProjectView; 