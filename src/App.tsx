import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import theme from './theme';
import Layout from './components/Layout';
import Projects from './features/global/Projects';
import ProjectView from './features/projects/ProjectView';
import WorkspaceView from './features/workspaces/WorkspaceView';
import WorkflowCanvas from './components/WorkflowCanvas';
import WorkflowToolbar from './components/WorkflowToolbar';
import AIFloatingAssistant from './components/AIFloatingAssistant';
import HomePage from './pages/HomePage';
import PublishingPage from './pages/PublishingPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ReactFlowProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectView />} />
              <Route path="/projects/:projectId/workspaces/:workspaceId" element={<WorkspaceView />} />
              <Route path="/publishing" element={<PublishingPage />} />
              <Route 
                path="/projects/:projectId/workspaces/:workspaceId/scriptchains/:scriptchainId" 
                element={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: 0,
                    padding: 0
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
              <Route 
                path="/projects/:projectId/workspaces/:workspaceId/scriptchains/new" 
                element={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: 0,
                    padding: 0
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
