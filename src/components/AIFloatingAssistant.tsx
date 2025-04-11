import React, { useState } from 'react';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { styled } from '@mui/material/styles';

const FloatingAssistant = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
  borderRadius: '50%',
  boxShadow: theme.shadows[4],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(12),
  right: theme.spacing(3),
  width: '300px',
  height: '400px',
  zIndex: 1000,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
}));

const MessageBubble = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  maxWidth: '80%',
  alignSelf: 'flex-start',
}));

const AIFloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Tooltip 
        title="AI Assistant" 
        placement="left"
        open={isHovered}
        onOpen={() => setIsHovered(true)}
        onClose={() => setIsHovered(false)}
      >
        <FloatingAssistant>
          <IconButton
            size="large"
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <SmartToyIcon fontSize="large" />
          </IconButton>
        </FloatingAssistant>
      </Tooltip>
      
      {isOpen && (
        <ChatWindow>
          <Typography variant="h6" gutterBottom>
            Albus
          </Typography>
          <MessageBubble>
            Hi, I'm Albus, your global AI co-pilot. How can I help you today?
          </MessageBubble>
        </ChatWindow>
      )}
    </>
  );
};

export default AIFloatingAssistant; 