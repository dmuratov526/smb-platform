import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Chip } from '@mui/material';
import {
  CheckCircleOutline as HealthyIcon,
  WarningAmberOutlined as WarningIcon,
  ErrorOutline as CriticalIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { OperationsSummary } from '../types';

interface OperationsOverviewProps {
  summary: OperationsSummary;
  businessName: string;
}

const healthConfig = {
  good: { label: 'Operations Healthy', color: 'success' as const, icon: HealthyIcon },
  fair: { label: 'Attention Needed', color: 'warning' as const, icon: WarningIcon },
  poor: { label: 'Critical Issues', color: 'error' as const, icon: CriticalIcon },
};

const OperationsOverview: React.FC<OperationsOverviewProps> = ({ summary, businessName }) => {
  const theme = useTheme();
  const health = healthConfig[summary.overallHealth];
  const HealthIcon = health.icon;

  const stats = [
    {
      label: 'Open Issues',
      value: summary.openIssues,
      sub: summary.criticalIssues > 0 ? `${summary.criticalIssues} critical` : 'None critical',
      color: summary.criticalIssues > 0 ? theme.palette.error.main : summary.openIssues > 0 ? theme.palette.warning.main : theme.palette.success.main,
    },
    {
      label: 'Due Soon',
      value: summary.tasksDueSoon,
      sub: summary.tasksOverdue > 0 ? `${summary.tasksOverdue} overdue` : 'No overdue',
      color: summary.tasksOverdue > 0 ? theme.palette.error.main : theme.palette.text.primary,
    },
    {
      label: 'Completed This Period',
      value: summary.tasksCompleted,
      sub: `of ${summary.tasksCompleted + summary.tasksDueSoon} recurring tasks`,
      color: theme.palette.success.main,
    },
    {
      label: 'Operational Areas',
      value: summary.totalAreas,
      sub: `${summary.healthyAreas} healthy · ${summary.atRiskAreas + summary.criticalAreas} need attention`,
      color: theme.palette.text.primary,
    },
  ];

  return (
    <Box mb={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Operations Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {businessName} · Current period
          </Typography>
        </Box>
        <Chip
          icon={<HealthIcon sx={{ fontSize: '16px !important' }} />}
          label={health.label}
          color={health.color}
          size="small"
          sx={{ fontWeight: 600, px: 0.5 }}
        />
      </Box>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                  display="block"
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  mt={0.5}
                  mb={0.25}
                  sx={{ color: stat.color }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.sub}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OperationsOverview;
