import React from 'react';
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PsychologyIcon from '@mui/icons-material/Psychology';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
      title: 'Visual Workflow Editor',
      description: 'Create and manage complex workflows with an intuitive drag-and-drop interface'
    },
    {
      icon: <AutoGraphIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Connections',
      description: 'Connect nodes intelligently with multiple input support and visual feedback'
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
      title: 'NLP Integration',
      description: 'Analyze and process natural language within your workflow nodes'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f0f7ff 0%, #ffffff 100%)'
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          pt: 12,
          pb: 6,
          textAlign: 'center'
        }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            ThoughtfulUI
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            A modern workflow editor with NLP capabilities
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/workflow')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.3)'
            }}
          >
            Launch Editor
          </Button>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mt: 4, mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 