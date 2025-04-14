import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/Folder';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import ScheduleIcon from '@mui/icons-material/Schedule';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Mock recent activity data
  const recentActivity = [
    {
      id: '1',
      type: 'project',
      name: 'Authentication System',
      lastModified: '2 hours ago',
      path: '/projects/1'
    },
    {
      id: '2',
      type: 'workspace',
      name: 'User Flow',
      lastModified: '3 hours ago',
      path: '/projects/1/workspaces/1'
    },
    {
      id: '3',
      type: 'scriptchain',
      name: 'Login Process',
      lastModified: '4 hours ago',
      path: '/projects/1/workspaces/1/scriptchains/1'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderIcon sx={{ fontSize: 20 }} />;
      case 'workspace':
        return <WorkspacesIcon sx={{ fontSize: 20 }} />;
      case 'scriptchain':
        return <AccountTreeIcon sx={{ fontSize: 20 }} />;
      default:
        return <FolderIcon sx={{ fontSize: 20 }} />;
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box 
        sx={{ 
          mb: 6,
          p: 4,
          borderRadius: 2,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.2)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome to ThoughtFlow
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your AI-powered workspace for building and managing intelligent workflows
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                borderColor: theme.palette.primary.main,
              }
            }}
          >
            <CardActionArea 
              onClick={() => navigate('/projects/new')}
              sx={{ height: '100%', p: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AddIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1">New Project</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Create a new project to organize your workflows
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                borderColor: theme.palette.primary.main,
              }
            }}
          >
            <CardActionArea 
              onClick={() => navigate('/projects')}
              sx={{ height: '100%', p: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FolderIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1">Projects</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                View and manage your existing projects
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Recent Activity
      </Typography>
      <Grid container spacing={2}>
        {recentActivity.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              <CardActionArea 
                onClick={() => navigate(item.path)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        mr: 1,
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {getIcon(item.type)}
                    </Box>
                    <Typography variant="subtitle1">{item.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: 'text.secondary',
                        mr: 0.5 
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      Modified: {item.lastModified}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage; 