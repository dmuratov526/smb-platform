import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Divider } from '@mui/material';
import {
  CheckCircleOutline as HealthyIcon,
  WarningAmber as WarningIcon,
  ErrorOutline as CriticalIcon,
} from '@mui/icons-material';
import { OpsHealth } from '../types';

interface StatItemProps {
  label: string;
  value: number;
  color?: string;
  emphasized?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, color = 'text.primary', emphasized = false }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={0.75}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={emphasized ? 700 : 600} color={color}>
      {value}
    </Typography>
  </Box>
);

interface OperationsSummaryWidgetProps {
  ops: OpsHealth;
}

const OperationsSummaryWidget: React.FC<OperationsSummaryWidgetProps> = ({ ops }) => {
  if (!ops.hasData) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="body2" color="text.secondary">
            No operations data found. Set up the Operations workspace to start tracking tasks and issues.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const healthColor =
    ops.overallHealth === 'good'
      ? 'success'
      : ops.overallHealth === 'fair'
      ? 'warning'
      : 'error';

  const HealthIcon =
    ops.overallHealth === 'good'
      ? HealthyIcon
      : ops.overallHealth === 'fair'
      ? WarningIcon
      : CriticalIcon;

  const healthLabel =
    ops.overallHealth === 'good'
      ? 'Healthy'
      : ops.overallHealth === 'fair'
      ? 'Fair'
      : 'Needs Attention';

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
              Operational Health
            </Typography>
            <Typography variant="subtitle2" fontWeight={700}>
              {healthLabel}
            </Typography>
          </Box>
          <Chip
            icon={<HealthIcon sx={{ fontSize: '14px !important' }} />}
            label={healthLabel}
            size="small"
            color={healthColor}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>

        <Divider sx={{ mb: 1 }} />

        <StatItem
          label="Open Issues"
          value={ops.openIssues}
          color={ops.openIssues > 3 ? 'error.main' : ops.openIssues > 0 ? 'warning.main' : 'success.main'}
          emphasized={ops.openIssues > 0}
        />
        {ops.criticalIssues > 0 && (
          <StatItem
            label="Critical Issues"
            value={ops.criticalIssues}
            color="error.main"
            emphasized
          />
        )}
        <StatItem
          label="Tasks Due Soon"
          value={ops.tasksDueSoon}
          color={ops.tasksDueSoon > 0 ? 'warning.main' : 'text.primary'}
        />
        <StatItem
          label="Overdue Tasks"
          value={ops.tasksOverdue}
          color={ops.tasksOverdue > 0 ? 'error.main' : 'text.primary'}
          emphasized={ops.tasksOverdue > 0}
        />
        <StatItem
          label="Completed Tasks"
          value={ops.tasksCompleted}
          color="success.main"
        />
      </CardContent>
    </Card>
  );
};

export default OperationsSummaryWidget;
