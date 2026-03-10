import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  CheckCircleOutline as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  BlockOutlined as BlockedIcon,
} from '@mui/icons-material';
import { LaunchHealth } from '../types';

interface LaunchProgressSummaryProps {
  launch: LaunchHealth;
}

const LaunchProgressSummary: React.FC<LaunchProgressSummaryProps> = ({ launch }) => {
  if (!launch.hasPlan) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="body2" color="text.secondary">
            No launch plan found. Open the Launch Planner to start tracking your readiness.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const progressColor =
    launch.overallPercent >= 80
      ? 'success'
      : launch.overallPercent >= 40
      ? 'warning'
      : 'primary';

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing="0.06em"
              display="block"
            >
              Launch Readiness
            </Typography>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {launch.overallPercent}%
            </Typography>
          </Box>
          <Chip
            label={`Phase: ${launch.currentPhaseName || 'Foundation'}`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={launch.overallPercent}
          color={progressColor as 'success' | 'warning' | 'primary'}
          sx={{ height: 6, borderRadius: 3, mb: 2 }}
        />

        <Divider sx={{ mb: 1.5 }} />

        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={0.75}>
            <CompletedIcon sx={{ fontSize: 14, color: 'success.main' }} />
            <Typography variant="body2" color="text.secondary">
              <Box component="span" fontWeight={700} color="text.primary">
                {launch.completedTasks}
              </Box>{' '}
              completed
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.75}>
            <PendingIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              <Box component="span" fontWeight={700} color="text.primary">
                {launch.remainingTasks}
              </Box>{' '}
              remaining
            </Typography>
          </Box>
          {launch.blockedTasks > 0 && (
            <Box display="flex" alignItems="center" gap={0.75}>
              <BlockedIcon sx={{ fontSize: 14, color: 'error.main' }} />
              <Typography variant="body2" color="error.main" fontWeight={600}>
                {launch.blockedTasks} blocked
              </Typography>
            </Box>
          )}
        </Box>

        {launch.nextMilestoneName && (
          <Box mt={1.5} pt={1.5} borderTop="1px solid" borderColor="divider">
            <Typography variant="caption" color="text.secondary">
              Next milestone:{' '}
              <Box component="span" fontWeight={600} color="text.primary">
                {launch.nextMilestoneName}
              </Box>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LaunchProgressSummary;
