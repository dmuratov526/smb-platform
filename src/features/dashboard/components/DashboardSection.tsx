import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DashboardSectionProps {
  title: string;
  navPath?: string;
  navLabel?: string;
  children: React.ReactNode;
  mb?: number;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  navPath,
  navLabel = 'Open',
  children,
  mb = 3,
}) => {
  const navigate = useNavigate();

  return (
    <Box mb={mb}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Typography
          variant="overline"
          fontWeight={700}
          color="text.secondary"
          letterSpacing="0.08em"
        >
          {title}
        </Typography>
        {navPath && (
          <Button
            size="small"
            endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate(navPath)}
            sx={{ fontSize: '0.75rem', minWidth: 0, px: 1 }}
          >
            {navLabel}
          </Button>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default DashboardSection;
