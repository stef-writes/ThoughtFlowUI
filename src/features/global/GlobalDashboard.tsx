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
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Mock data with enterprise-style project names
const mockProjects = [
  {
    id: '1',
    name: 'Customer Onboarding',
    description: 'Streamline new customer integration processes',
    workflows: 3,
    teamSize: 8,
    lastUpdated: '2024-03-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Product Development',
    description: 'End-to-end product lifecycle management',
    workflows: 3,
    teamSize: 12,
    lastUpdated: '2024-03-14',
    status: 'active',
  },
  {
    id: '3',
    name: 'Quality Assurance',
    description: 'Automated testing and validation workflows',
    workflows: 3,
    teamSize: 6,
    lastUpdated: '2024-03-13',
    status: 'active',
  },
];

const GlobalDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
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
            Projects
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Add project logic */}}
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
            New Project
          </Button>
        </Box>

        <Grid container spacing={4}>
          {mockProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
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
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FolderIcon sx={{ 
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
                          {project.name}
                        </Typography>
                        <Chip 
                          label={project.status} 
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
                      {project.description}
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
                        <GroupIcon sx={{ 
                          fontSize: 16, 
                          color: 'text.secondary',
                          mr: 0.5 
                        }} />
                        <Typography variant="body2" color="text.secondary">
                          {project.teamSize} members
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon sx={{ 
                          fontSize: 16, 
                          color: 'text.secondary',
                          mr: 0.5 
                        }} />
                        <Typography variant="body2" color="text.secondary">
                          Updated {project.lastUpdated}
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

export default GlobalDashboard; 