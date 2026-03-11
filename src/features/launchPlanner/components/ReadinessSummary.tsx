import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  Pending as InProgressIcon,
  RadioButtonUnchecked as NotStartedIcon,
  Block as BlockedIcon,
  RocketLaunch as RocketIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { LaunchReadiness } from '../types';
import { Business } from '../../../types';

interface ReadinessSummaryProps {
  readiness: LaunchReadiness;
  business: Business;
}

const ReadinessSummary: React.FC<ReadinessSummaryProps> = ({ readiness, business }) => {
  const theme = useTheme();

  const readinessColor =
    readiness.overallPercent >= 80
      ? theme.palette.success.main
      : readiness.overallPercent >= 50
      ? theme.palette.warning.main
      : theme.palette.error.main;

  const readinessLabel =
    readiness.overallPercent >= 80
      ? 'On Track'
      : readiness.overallPercent >= 50
      ? 'In Progress'
      : readiness.overallPercent >= 20
      ? 'Early Stage'
      : 'Just Starting';

  const readinessChipColor =
    readiness.overallPercent >= 80
      ? 'success'
      : readiness.overallPercent >= 50
      ? 'warning'
      : ('error' as const);

  const stats = [
    {
      label: 'Completed',
      value: readiness.completedTasks,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.08),
      icon: <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />,
    },
    {
      label: 'In Progress',
      value: readiness.inProgressTasks,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.08),
      icon: <InProgressIcon sx={{ fontSize: 16, color: 'primary.main' }} />,
    },
    {
      label: 'Not Started',
      value: readiness.remainingTasks,
      color: theme.palette.text.secondary,
      bgColor: alpha(theme.palette.text.secondary, 0.06),
      icon: <NotStartedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />,
    },
    {
      label: 'Blocked',
      value: readiness.blockedTasks,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.08),
      icon: <BlockedIcon sx={{ fontSize: 16, color: 'error.main' }} />,
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        background: `linear-gradient(135deg, ${alpha(readinessColor, 0.07)} 0%, ${alpha(theme.palette.background.paper, 1)} 55%)`,
        border: `1px solid ${alpha(readinessColor, 0.22)}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header row */}
        <Box display="flex" alignItems="flex-start" gap={1.25} mb={1.5}>
          <Box
            width={34}
            height={34}
            borderRadius={1.5}
            bgcolor={alpha(readinessColor, 0.12)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            mt={0.25}
          >
            <RocketIcon sx={{ fontSize: 17, color: readinessColor }} />
          </Box>
          <Box flex={1} minWidth={0}>
            {/* Title row with percentage — no chip competition */}
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mb={0.5}>
              <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.78rem', lineHeight: 1.3 }}>
                Launch Readiness
              </Typography>
              <Typography
                fontWeight={800}
                sx={{ color: readinessColor, lineHeight: 1, flexShrink: 0, fontSize: '1.25rem' }}
              >
                {readiness.overallPercent}%
              </Typography>
            </Box>
            {/* Chips on their own row */}
            <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
              <Chip
                label={readinessLabel}
                size="small"
                color={readinessChipColor}
                sx={{ fontWeight: 700, fontSize: '0.65rem', height: 18, '& .MuiChip-label': { px: 0.75 } }}
              />
              <Chip
                label={business.name}
                size="small"
                sx={{
                  bgcolor: business.logoColor,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 18,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={readiness.overallPercent}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: alpha(readinessColor, 0.12),
            mb: 0.75,
            '& .MuiLinearProgress-bar': { bgcolor: readinessColor, borderRadius: 3 },
          }}
        />
        <Typography variant="caption" color="text.secondary" display="block" mb={1.75} sx={{ fontSize: '0.68rem' }}>
          {readiness.completedTasks} of {readiness.totalTasks} tasks complete
        </Typography>

        {/* Stats — 2×2 compact grid */}
        <Grid container spacing={1}>
          {stats.map((stat) => (
            <Grid item xs={6} key={stat.label}>
              <Box
                display="flex"
                alignItems="center"
                gap={0.75}
                p={1}
                borderRadius={1.5}
                bgcolor={stat.bgColor}
                border={`1px solid ${alpha(stat.color, 0.14)}`}
              >
                {stat.icon}
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    display="block"
                    sx={{ color: stat.color, fontSize: '0.9rem', lineHeight: 1.2 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReadinessSummary;
