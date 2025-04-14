import React from 'react';
import { 
  Box, 
  Button,
  Stack,
  Typography,
  keyframes,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import logo from '../assets/NutZiLogo2.png';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: '240px',
      right: 0,
      bottom: 0,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Stack spacing={12} sx={{ 
        alignItems: 'center',
      }}>
        <Box 
          component="img"
          src={logo}
          alt="Albus"
          sx={{
            width: '200px',
            height: '200px',
            opacity: 0,
            animation: `${fadeIn} 0.8s ease-out forwards`,
          }}
        />
        <Stack spacing={6} sx={{ 
          alignItems: 'center',
          opacity: 0,
          animation: `${fadeIn} 0.8s ease-out 0.2s forwards`,
        }}>
          <Typography 
            sx={{ 
              fontSize: '1.15rem',
              color: '#fff',
              letterSpacing: '0.15em',
              fontWeight: 300,
              textTransform: 'uppercase',
            }}
          >
            Be Thoughtful.
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.05em',
              fontWeight: 300,
            }}
          >
            Redefine how humans engineer creative solutions.
          </Typography>
        </Stack>
        <Stack spacing={4} sx={{
          alignItems: 'center',
          opacity: 0,
          animation: `${fadeIn} 0.8s ease-out 0.4s forwards`,
        }}>
          <Button
            variant="text"
            startIcon={<AccountTreeIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => navigate('/projects/1/workspaces/1')}
            sx={{
              color: '#fff',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              '&:hover': {
                background: 'none',
                opacity: 0.7,
              }
            }}
          >
            See it in Action
          </Button>
          <Button
            variant="text"
            startIcon={<AutoGraphIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => navigate('/projects/1/workspaces/1/scriptchains/1')}
            sx={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              '&:hover': {
                background: 'none',
                color: '#fff',
              }
            }}
          >
            Try Editor
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HomePage; 