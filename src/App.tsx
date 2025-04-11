import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import theme from './theme';
import Layout from './components/Layout';
import GlobalDashboard from './features/global/GlobalDashboard';
import ProjectView from './features/projects/ProjectView';
import WorkflowCanvas from './components/WorkflowCanvas';
import WorkflowToolbar from './components/WorkflowToolbar';
import AIFloatingAssistant from './components/AIFloatingAssistant';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ReactFlowProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<GlobalDashboard />} />
              <Route path="/projects/:projectId" element={<ProjectView />} />
              <Route 
                path="/projects/:projectId/workflows/:workflowId" 
                element={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: 'calc(100vh - 64px)',
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                    <WorkflowToolbar />
                    <Box sx={{ 
                      flexGrow: 1, 
                      position: 'relative',
                      width: '100%',
                      height: 'calc(100% - 64px)',
                      '& .react-flow': {
                        width: '100%',
                        height: '100%'
                      }
                    }}>
                      <WorkflowCanvas />
                    </Box>
                  </Box>
                }
              />
            </Routes>
          </Layout>
          <AIFloatingAssistant />
        </ReactFlowProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
