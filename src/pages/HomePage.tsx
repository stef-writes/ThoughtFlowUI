import React from 'react';
import { 
  Box, 
  Button,
  Stack,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.background.default,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}20 0%, transparent 70%)`,
        zIndex: 0
      }
    }}>
      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AccountTreeIcon />}
          onClick={() => navigate('/projects/1/workspaces/1')}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            textTransform: 'none',
            borderRadius: theme.shape.borderRadius,
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              background: theme.palette.primary.light,
              boxShadow: '0 2px 8px rgba(196, 160, 82, 0.15)',
            }
          }}
        >
          See Scriptchain in Action
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<AutoGraphIcon />}
          onClick={() => navigate('/projects/1/workspaces/1/scriptchains/1')}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            textTransform: 'none',
            borderRadius: theme.shape.borderRadius,
            borderColor: 'rgba(196, 160, 82, 0.5)',
            color: theme.palette.text.primary,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          Try Editor
        </Button>
      </Stack>
    </Box>
  );
};

export default HomePage; 