import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import {
  Build as BuilderIcon,
  TrendingUp as SimIcon,
  RocketLaunch as LaunchIcon,
  Settings as OpsIcon,
  CheckCircle as DoneIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { RecommendedAction, RecommendationCategory } from '../types';

const CATEGORY_CONFIG: Record<
  RecommendationCategory,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  complete_builder: {
    icon: <BuilderIcon />,
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
  },
  run_simulation: {
    icon: <SimIcon />,
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
  },
  finish_launch: {
    icon: <LaunchIcon />,
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
  resolve_issues: {
    icon: <OpsIcon />,
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.08)',
  },
  review_operations: {
    icon: <OpsIcon />,
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
  },
  business_running: {
    icon: <DoneIcon />,
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
};

interface RecommendedNextStepProps {
  action: RecommendedAction;
}

const RecommendedNextStep: React.FC<RecommendedNextStepProps> = ({ action }) => {
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[action.category];

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: config.color + '44',
        bgcolor: config.bg,
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box
            width={44}
            height={44}
            borderRadius={2}
            bgcolor={config.color + '22'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            sx={{ color: config.color }}
          >
            {config.icon}
          </Box>

          <Box flex={1} minWidth={0}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing="0.06em"
              display="block"
              mb={0.25}
            >
              Recommended Next Step
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color={config.color} mb={0.5}>
              {action.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              {action.description}
            </Typography>
            <Button
              variant="contained"
              size="small"
              endIcon={<ArrowIcon />}
              onClick={() => navigate(action.path)}
              sx={{
                bgcolor: config.color,
                '&:hover': { bgcolor: config.color, filter: 'brightness(0.9)' },
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              {action.ctaLabel}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecommendedNextStep;
