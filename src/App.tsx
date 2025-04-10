import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import WorkflowCanvas from './components/WorkflowCanvas';
import WorkflowToolbar from './components/WorkflowToolbar';
import CustomNode from './components/CustomNode';
import { ReactFlowProvider } from 'reactflow';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const nodeTypes = {
  custom: CustomNode,
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100vw',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <WorkflowToolbar />
        <Box sx={{ 
          flexGrow: 1, 
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 64px)',
          '& .react-flow': {
            width: '100%',
            height: '100%'
          }
        }}>
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
