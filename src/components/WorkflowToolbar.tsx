import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const WorkflowToolbar: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, workspaceId, scriptchainId } = useParams();

  const breadcrumbs = [
    { label: 'Projects', path: '/projects' },
    { label: `Project ${projectId}`, path: `/projects/${projectId}` },
    { label: `Workspace ${workspaceId}`, path: `/projects/${projectId}/workspaces/${workspaceId}` },
    { label: `Scriptchain ${scriptchainId}`, path: `/projects/${projectId}/workspaces/${workspaceId}/scriptchains/${scriptchainId}` }
  ];

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {breadcrumbs.map((breadcrumb, index) => (
          index === breadcrumbs.length - 1 ? (
            <Typography key={breadcrumb.path} color="text.primary">
              {breadcrumb.label}
            </Typography>
          ) : (
            <Link
              key={breadcrumb.path}
              color="inherit"
              href={breadcrumb.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(breadcrumb.path);
              }}
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              {breadcrumb.label}
            </Link>
          )
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default WorkflowToolbar; 