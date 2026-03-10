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
        mb: 3,
        background: `linear-gradient(135deg, ${alpha(readinessColor, 0.06)} 0%, ${alpha(theme.palette.background.paper, 1)} 60%)`,
        border: `1px solid ${alpha(readinessColor, 0.2)}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Left: Readiness score */}
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <Box
                width={40}
                height={40}
                borderRadius={2}
                bgcolor={alpha(readinessColor, 0.12)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <RocketIcon sx={{ fontSize: 20, color: readinessColor }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                  Launch Readiness
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={readinessLabel}
                    size="small"
                    color={readinessChipColor}
                    sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20 }}
                  />
                  <Chip
                    label={business.name}
                    size="small"
                    sx={{
                      bgcolor: business.logoColor,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="baseline" gap={0.75} mb={1}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ color: readinessColor, lineHeight: 1 }}
              >
                {readiness.overallPercent}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                overall readiness
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={readiness.overallPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(readinessColor, 0.12),
                mb: 1.5,
                '& .MuiLinearProgress-bar': {
                  bgcolor: readinessColor,
                  borderRadius: 4,
                },
              }}
            />

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {readiness.completedTasks} of {readiness.totalTasks} tasks complete
              </Typography>
              {business.category && (
                <Chip
                  label={business.category.replace(/_/g, ' ')}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.65rem',
                    height: 18,
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}
            </Box>
          </Grid>

          {/* Right: Stat breakdown */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={1.5}>
              {stats.map((stat) => (
                <Grid item xs={6} sm={3} key={stat.label}>
                  <Box
                    p={1.5}
                    borderRadius={1.5}
                    bgcolor={stat.bgColor}
                    border={`1px solid ${alpha(stat.color, 0.15)}`}
                    textAlign="center"
                  >
                    <Box display="flex" justifyContent="center" mb={0.5}>
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{ color: stat.color, lineHeight: 1.2 }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReadinessSummary;
