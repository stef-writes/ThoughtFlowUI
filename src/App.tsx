import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkflowCanvas from './components/WorkflowCanvas';
import WorkflowToolbar from './components/WorkflowToolbar';
import GlobalDashboard from './features/global/GlobalDashboard';
import ProjectView from './features/projects/ProjectView';
import Layout from './components/Layout';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<GlobalDashboard />} />
            <Route path="/projects/:projectId" element={<ProjectView />} />
            <Route
              path="/projects/:projectId/workflows/:workflowId"
              element={
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 'calc(100vh - 64px)', // Subtract AppBar height
                  width: '100%',
                  overflow: 'hidden',
                }}>
                  <WorkflowToolbar />
                  <Box sx={{ 
                    flexGrow: 1, 
                    position: 'relative',
                    width: '100%',
                    height: 'calc(100% - 64px)', // Subtract toolbar height
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
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
