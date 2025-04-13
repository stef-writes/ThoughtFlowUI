import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';

interface PanelProps {
  isSidebarCollapsed: boolean;
}

const Panel = styled(Paper)<PanelProps>(({ theme, isSidebarCollapsed }) => ({
  position: 'fixed',
  left: isSidebarCollapsed ? '45px' : '240px',
  right: 0,
  bottom: 0,
  height: '300px',
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderTop: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  boxShadow: `0 -1px 0 ${alpha(theme.palette.grey[700], 0.1)}`,
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 2),
  height: '40px',
  backgroundColor: theme.palette.grey[900],
  borderBottom: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
  position: 'relative',
  cursor: 'ns-resize',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    padding: '1px',
    background: `linear-gradient(90deg, 
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
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, 
      ${alpha(theme.palette.primary.main, 0.2)} 0%, 
      ${alpha(theme.palette.grey[700], 0.3)} 50%, 
      ${alpha(theme.palette.primary.main, 0.2)} 100%
    )`,
  }
}));

const Title = styled(Typography)(({ theme }) => ({
  flex: 1,
  fontSize: '0.875rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: alpha(theme.palette.common.white, 0.9),
  '&::before': {
    content: '">"',
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    opacity: 0.8,
  }
}));

const ArrowContainer = styled(Box)({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
});

const Content = styled(Box)({
  flexGrow: 1,
  overflow: 'auto',
});

const CommandText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  padding: theme.spacing(2),
  fontSize: '0.75rem',
  '& .section': {
    color: theme.palette.primary.main,
    fontWeight: 500,
    marginBottom: theme.spacing(1),
    display: 'block',
  },
  '& .command': {
    color: theme.palette.common.white,
    marginLeft: theme.spacing(2),
    display: 'block',
  },
  '& .comment': {
    color: alpha(theme.palette.common.white, 0.5),
    marginLeft: theme.spacing(2),
    display: 'block',
  }
}));

interface TerminalPanelProps {
  title: string;
  isSidebarCollapsed?: boolean;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, isSidebarCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height, setHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.cursor = 'ns-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const delta = startY.current - e.clientY;
    const newHeight = Math.min(Math.max(startHeight.current + delta, 200), 600);
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const getTerminalContent = () => (
    <>
      <span className="section"># Navigation</span>
      <span className="command">goto project &lt;project_name&gt;</span>
      <span className="comment"># Navigate to a specific project</span>
      <span className="command">goto workspace &lt;workspace_name&gt;</span>
      <span className="comment"># Navigate to a specific workspace</span>
      <span className="command">goto loci &lt;loci_name&gt;</span>
      <span className="comment"># Navigate to a specific loci</span>

      <span className="section"># Operations</span>
      <span className="command">analyze &lt;node_id | chain_id&gt;</span>
      <span className="comment"># Get performance and parameter analysis</span>
      <span className="command">optimize &lt;node_id | chain_id&gt;</span>
      <span className="comment"># Get AI suggestions for improvements</span>
      <span className="command">debug &lt;node_id | chain_id&gt;</span>
      <span className="comment"># Start interactive debugging session</span>

      <span className="section"># System</span>
      <span className="command">show memory</span>
      <span className="comment"># Display memory usage</span>
      <span className="command">show status</span>
      <span className="comment"># Show system health and metrics</span>
      <span className="command">clear</span>
      <span className="comment"># Clear terminal output</span>
    </>
  );

  return (
    <Panel 
      isSidebarCollapsed={isSidebarCollapsed}
      sx={{ 
        height: `${height}px`,
        transform: isCollapsed ? 'translateY(calc(100% - 40px))' : 'translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Header 
        onMouseDown={handleMouseDown}
        sx={{
          cursor: isDragging ? 'ns-resize' : 'pointer',
        }}
      >
        <Title>{title}</Title>
        <ArrowContainer>
          <IconButton
            size="small"
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{ 
              color: 'text.secondary',
              transition: 'transform 0.2s ease',
              transform: isCollapsed ? 'rotate(180deg)' : 'none'
            }}
          >
            {isCollapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </ArrowContainer>
      </Header>
      <Content>
        <CommandText>
          {getTerminalContent()}
        </CommandText>
      </Content>
    </Panel>
  );
};

export default TerminalPanel; 