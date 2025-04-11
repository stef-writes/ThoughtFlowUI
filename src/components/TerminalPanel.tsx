import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';

const Panel = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  left: 0,
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
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const getTerminalContent = () => {
    switch (title) {
      case 'Project Terminal':
        return (
          <>
            <span className="section"># Project Management</span>
            <span className="command">project init &lt;name&gt; [--template=&lt;template_name&gt;]</span>
            <span className="comment"># Initialize new project</span>
            <span className="command">project status</span>
            <span className="comment"># Show project health metrics</span>
            <span className="command">project config</span>
            <span className="comment"># View/modify project settings</span>
            <span className="command">project deploy [--env=&lt;environment&gt;]</span>
            <span className="comment"># Deploy project</span>

            <span className="section"># AI Assistant</span>
            <span className="command">project ai suggest &lt;prompt&gt;</span>
            <span className="comment"># Get AI suggestions for project</span>
            <span className="command">project ai analyze</span>
            <span className="comment"># Get AI analysis of project structure</span>
            <span className="command">project ai optimize</span>
            <span className="comment"># Get optimization recommendations</span>
          </>
        );
      case 'Workflow Terminal':
        return (
          <>
            <span className="section"># Chain Operations</span>
            <span className="command">chain create &lt;name&gt;</span>
            <span className="comment"># Create new script chain</span>
            <span className="command">chain add &lt;node_type&gt; [--config=&lt;config&gt;]</span>
            <span className="comment"># Add node to chain</span>
            <span className="command">chain connect &lt;from&gt; &lt;to&gt;</span>
            <span className="comment"># Connect nodes</span>
            <span className="command">chain execute [--async]</span>
            <span className="comment"># Execute chain</span>

            <span className="section"># AI Integration</span>
            <span className="command">chain ai validate</span>
            <span className="comment"># Validate chain structure</span>
            <span className="command">chain ai optimize</span>
            <span className="comment"># Optimize chain performance</span>
            <span className="command">chain ai explain</span>
            <span className="comment"># Explain chain behavior</span>

            <span className="section"># Node Operations</span>
            <span className="command">node config &lt;node_id&gt;</span>
            <span className="comment"># Configure node</span>
            <span className="command">node test &lt;node_id&gt;</span>
            <span className="comment"># Test node in isolation</span>
            <span className="command">node debug &lt;node_id&gt;</span>
            <span className="comment"># Debug specific node</span>
            <span className="command">node monitor &lt;node_id&gt;</span>
            <span className="comment"># Monitor node performance</span>

            <span className="section"># AI Features</span>
            <span className="command">node ai suggest-inputs</span>
            <span className="comment"># Suggest input configurations</span>
            <span className="command">node ai explain-behavior</span>
            <span className="comment"># Explain node behavior</span>
            <span className="command">node ai optimize</span>
            <span className="comment"># Optimize node configuration</span>
          </>
        );
      case 'Global Terminal':
        return (
          <>
            <span className="section"># Workspace Operations</span>
            <span className="command">workspace ls</span>
            <span className="comment"># List all workspaces</span>
            <span className="command">workspace create &lt;name&gt; [--type=&lt;type&gt;]</span>
            <span className="comment"># Create new workspace</span>
            <span className="command">workspace switch &lt;name&gt;</span>
            <span className="comment"># Switch active workspace</span>
            <span className="command">workspace share &lt;user&gt;</span>
            <span className="comment"># Share workspace with user</span>

            <span className="section"># AI Integration</span>
            <span className="command">workspace ai search &lt;query&gt;</span>
            <span className="comment"># Semantic search across workspace</span>
            <span className="command">workspace ai refactor</span>
            <span className="comment"># AI-assisted code refactoring</span>
            <span className="command">workspace ai document</span>
            <span className="comment"># Generate documentation</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Panel
      elevation={0}
      sx={{
        transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 40px))',
        height: isExpanded ? `${height}px` : '40px',
      }}
    >
      <Header onMouseDown={handleMouseDown}>
        <Title variant="subtitle2">{title}</Title>
        <ArrowContainer>
          <IconButton 
            size="small" 
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{ 
              color: 'common.white',
              padding: '6px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateY(-1px)',
              }
            }}
          >
            {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
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