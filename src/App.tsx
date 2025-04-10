import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkflowCanvas from './components/WorkflowCanvas';
import WorkflowToolbar from './components/WorkflowToolbar';
import Home from './components/Home';
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
          <Route path="/" element={<Home />} />
          <Route
            path="/workflow"
            element={
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
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
