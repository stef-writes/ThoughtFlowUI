import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, alpha } from '@mui/material/styles';

const Panel = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  right: 0,
  bottom: 0,
  width: '300px',
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  display: 'flex',
  flexDirection: 'row',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderLeft: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  boxShadow: `-1px 0 0 ${alpha(theme.palette.grey[700], 0.1)}`,
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.75),
  width: '40px',
  height: '100%',
  backgroundColor: theme.palette.grey[900],
  borderRight: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  position: 'relative',
  cursor: 'ew-resize',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    padding: '1px',
    background: `linear-gradient(180deg, 
      ${alpha('#FFD700', 0.2)} 0%, 
      ${alpha('#FFD700', 0.4)} 50%, 
      ${alpha('#FFD700', 0.2)} 100%
    )`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '1px',
    background: `linear-gradient(180deg, 
      ${alpha(theme.palette.primary.main, 0.2)} 0%, 
      ${alpha(theme.palette.grey[700], 0.3)} 50%, 
      ${alpha(theme.palette.primary.main, 0.2)} 100%
    )`,
  }
}));

const Content = styled(Box)({
  flexGrow: 1,
  overflow: 'auto',
});

const SidePanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(window.innerHeight * 0.8);
  const [isDraggingWidth, setIsDraggingWidth] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startWidth = useRef(0);
  const startHeight = useRef(0);

  const handleWidthMouseDown = (e: React.MouseEvent) => {
    setIsDraggingWidth(true);
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'ew-resize';
  };

  const handleHeightMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHeight(true);
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.cursor = 'ns-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingWidth) {
      const delta = e.clientX - startX.current;
      const newWidth = Math.min(Math.max(startWidth.current - delta, 200), 600);
      setWidth(newWidth);
    }
    if (isDraggingHeight) {
      const delta = e.clientY - startY.current;
      const newHeight = Math.min(Math.max(startHeight.current - delta, 300), window.innerHeight);
      setHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingWidth(false);
    setIsDraggingHeight(false);
    document.body.style.cursor = '';
  };

  useEffect(() => {
    if (isDraggingWidth || isDraggingHeight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingWidth, isDraggingHeight]);

  return (
    <Panel
      elevation={0}
      sx={{
        transform: isExpanded ? 'translateX(0)' : 'translateX(calc(100% - 40px))',
        width: isExpanded ? `${width}px` : '40px',
        height: `${height}px`,
      }}
    >
      <TopDragHandle onMouseDown={handleHeightMouseDown} />
      <Header onMouseDown={handleWidthMouseDown}>
        <IconButton 
          size="small" 
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ 
            color: 'common.white',
            padding: '6px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              color: 'primary.main',
              transform: 'translateX(-1px)',
            }
          }}
        >
          {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Header>
      <Content>
        {/* Placeholder for future content */}
      </Content>
    </Panel>
  );
};

const TopDragHandle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '4px',
  cursor: 'ns-resize',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[700], 0.3),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '1px',
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      ${alpha('#FFD700', 0.2)} 0%, 
      ${alpha('#FFD700', 0.4)} 50%, 
      ${alpha('#FFD700', 0.2)} 100%
    )`,
  }
}));

export default SidePanel; 