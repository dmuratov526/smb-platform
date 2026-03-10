import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <Box mb={3}>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={2}
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom={false}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {description}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
            {actions}
          </Box>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default PageHeader;
