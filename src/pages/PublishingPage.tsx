import React, { useState } from 'react';
import { Box, Typography, TextField, Chip, Paper, useTheme, alpha, Tooltip } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import TimelineIcon from '@mui/icons-material/Timeline';
import StorageIcon from '@mui/icons-material/Storage';
import LockIcon from '@mui/icons-material/Lock';
import SyncIcon from '@mui/icons-material/Sync';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';

const PublishingPage: React.FC = () => {
  const theme = useTheme();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const contentTypes = [
    { label: 'Text', icon: <TextFieldsIcon fontSize="small" />, color: '#4CAF50' },
    { label: 'Image', icon: <ImageIcon fontSize="small" />, color: '#2196F3' },
    { label: 'Audio', icon: <AudiotrackIcon fontSize="small" />, color: '#9C27B0' },
    { label: 'Graph', icon: <TimelineIcon fontSize="small" />, color: '#FF9800' },
    { label: 'Data', icon: <StorageIcon fontSize="small" />, color: '#E91E63' },
  ];

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Hardcoded blog post content for the example
  const hardcodedBlogPost = `# Find Your Forever Home: Space, Style, and Stability Await!

Imagine waking up in a home that perfectly blends comfort, space, and connection to a vibrant community. Welcome to [Property Address - Placeholder], a stunning 4-bedroom, 3-bathroom Single Family residence offering an incredible lifestyle opportunity.

Step inside this beautifully maintained 2,500 sqft home, built in 1995, and feel the immediate sense of space. With four generously sized bedrooms, there's room for everyone – whether you need dedicated home offices, playrooms for the kids, or quiet retreats. The three full bathrooms ensure busy mornings run smoothly.

But the appeal extends far beyond the front door. Situated on a spacious 8,750 sqft lot, you'll have plenty of room for backyard barbecues, gardening projects, or simply relaxing under the open sky. It's the perfect canvas for creating lasting memories.

This isn't just a house; it's a home nestled within a thriving neighborhood. The area boasts impressive demographics that speak volumes about its quality of life. With a median household income of $85,000 and 45% of residents holding a Bachelor's degree or higher, you'll be joining a community of driven and successful individuals. 

The stability of the neighborhood is reflected in its high owner-occupancy rate of 65%, creating a welcoming atmosphere where neighbors often become friends. The average household size of 2.6 hints at a family-friendly environment, perfect for putting down roots.

From its spacious interiors and ample outdoor space to its location within a stable and affluent community, this property truly offers the best of both worlds. It's more than just a house; it's the key to unlocking the lifestyle you've been dreaming of.

Ready to learn more? Contact us today for a private showing and discover why this could be your perfect forever home!`;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Publishing
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              Transform your workflow outputs into beautiful, interactive publications
            </Typography>
            <Chip
              icon={<LockIcon sx={{ fontSize: '1rem !important' }} />}
              label="Coming Soon"
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                borderRadius: 1,
                '& .MuiChip-icon': {
                  color: theme.palette.warning.main,
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search for Node"
          variant="outlined"
          sx={{
            backgroundColor: alpha(theme.palette.background.paper, 0.5),
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: alpha(theme.palette.divider, 0.1),
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {contentTypes.map(type => (
            <Chip
              key={type.label}
              icon={type.icon}
              label={type.label}
              onClick={() => handleTypeToggle(type.label)}
              sx={{
                backgroundColor: selectedTypes.includes(type.label)
                  ? alpha(type.color, 0.2)
                  : alpha(theme.palette.action.hover, 0.1),
                color: selectedTypes.includes(type.label)
                  ? type.color
                  : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: selectedTypes.includes(type.label)
                    ? alpha(type.color, 0.3)
                    : alpha(theme.palette.action.hover, 0.2),
                },
                '& .MuiChip-icon': {
                  color: 'inherit',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Main Content Area: Grid + Editor */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Canvas Area */}
        <Box
          sx={{
            flexGrow: 1,
            position: 'relative',
            backgroundColor: alpha(theme.palette.background.paper, 0.2),
            borderRadius: 2,
            p: 3,
            backgroundImage: `linear-gradient(${alpha(theme.palette.divider, 0.05)} 1px, transparent 1px),
                             linear-gradient(90deg, ${alpha(theme.palette.divider, 0.05)} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 2,
          }}
        >
          {/* Live Data Example Block */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1
            }}>
              <Typography variant="subtitle2">Real-time Analytics</Typography>
              <Tooltip title="Auto-updates from workflow nodes" arrow>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  alignItems: 'center',
                  color: theme.palette.primary.main,
                  fontSize: '0.75rem'
                }}>
                  <LinkIcon sx={{ fontSize: '0.875rem' }} />
                  <SyncIcon 
                    sx={{ 
                      fontSize: '0.875rem',
                      animation: 'spin 2s linear infinite',
                      '@keyframes spin': {
                        '0%': {
                          transform: 'rotate(0deg)',
                        },
                        '100%': {
                          transform: 'rotate(360deg)',
                        },
                      },
                    }} 
                  />
                </Box>
              </Tooltip>
            </Box>
            <Box
              sx={{
                height: 150,
                backgroundColor: alpha(theme.palette.background.paper, 0.3),
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2,
                borderRadius: 1,
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                pb: 1
              }}>
                <Typography variant="caption" color="text.secondary">
                  Source: @analytics_node
                </Typography>
                <Typography variant="caption" color="success.main">
                  Live •
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: theme.palette.success.main
              }}>
                <TimelineIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">+12.5% vs last hour</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
                Last update: Just now
              </Typography>
            </Box>
          </Paper>

          {/* Existing Monthly Revenue Block */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>Monthly Revenue</Typography>
            <Box
              sx={{
                height: 150,
                backgroundColor: alpha(theme.palette.background.paper, 0.3),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
              <TimelineIcon sx={{ fontSize: 40, color: alpha(theme.palette.primary.main, 0.3) }} />
            </Box>
          </Paper>

          {/* Existing Executive Summary Block */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>Executive Summary</Typography>
            <Typography variant="body2" color="text.secondary">
              Revenue increased by 25% in Q3 2024, driven by strong performance in...
            </Typography>
          </Paper>
        </Box>

        {/* New Document Editor Section */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.4),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Live Document Editor</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Combine static text with dynamic content pulled directly from your workflow nodes.
            Simply type `@` followed by the node label (e.g., `@BlogPostGenerator`) to embed its latest output.
          </Typography>

          {/* Simulated Editor Content */}
          <Box
            sx={{
              p: 2,
              border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.background.default, 0.3),
              minHeight: 200,
            }}
          >
            <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: theme.palette.primary.main }}>
              @BlogPostGenerator
            </Typography>
            <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
              {hardcodedBlogPost}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PublishingPage; 