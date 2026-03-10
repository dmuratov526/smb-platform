import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  TodayOutlined as TodayIcon,
  WarningAmberOutlined as OverdueIcon,
  ErrorOutline as CriticalIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { RecurringTask, OperationalIssue } from '../types';

interface FocusSummaryProps {
  tasksDueSoon: RecurringTask[];
  overdueTasks: RecurringTask[];
  highPriorityIssues: OperationalIssue[];
  areas: { id: string; name: string }[];
}

const severityColor = {
  low: 'default',
  medium: 'warning',
  high: 'warning',
  critical: 'error',
} as const;

const FocusSummary: React.FC<FocusSummaryProps> = ({
  tasksDueSoon,
  overdueTasks,
  highPriorityIssues,
  areas,
}) => {
  const theme = useTheme();
  const isEmpty = tasksDueSoon.length === 0 && overdueTasks.length === 0 && highPriorityIssues.length === 0;

  const getAreaName = (areaId: string) =>
    areas.find((a) => a.id === areaId)?.name ?? 'General';

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
      <CardContent sx={{ pb: '16px !important' }}>
        {isEmpty ? (
          <Box
            py={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            sx={{ opacity: 0.6 }}
          >
            <TodayIcon sx={{ fontSize: 32, color: 'success.main' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No urgent items right now
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {overdueTasks.length > 0 && (
              <Box>
                <Box display="flex" alignItems="center" gap={0.75} mb={1}>
                  <OverdueIcon sx={{ fontSize: 14, color: 'error.main' }} />
                  <Typography variant="caption" fontWeight={700} color="error.main" textTransform="uppercase" letterSpacing="0.05em">
                    Overdue ({overdueTasks.length})
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={0.75}>
                  {overdueTasks.map((task) => (
                    <Box
                      key={task.id}
                      px={1.5}
                      py={1}
                      borderRadius={1.5}
                      bgcolor={alpha(theme.palette.error.main, 0.06)}
                    >
                      <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getAreaName(task.areaId)}
                        {task.owner ? ` · ${task.owner}` : ''}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {overdueTasks.length > 0 && tasksDueSoon.length > 0 && (
              <Divider />
            )}

            {tasksDueSoon.length > 0 && (
              <Box>
                <Box display="flex" alignItems="center" gap={0.75} mb={1}>
                  <TodayIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                  <Typography variant="caption" fontWeight={700} color="warning.main" textTransform="uppercase" letterSpacing="0.05em">
                    Due Soon ({tasksDueSoon.length})
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={0.75}>
                  {tasksDueSoon.slice(0, 4).map((task) => (
                    <Box key={task.id} display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box minWidth={0}>
                        <Typography variant="body2" fontWeight={500} color="text.primary" noWrap>
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getAreaName(task.areaId)}
                        </Typography>
                      </Box>
                      <Chip
                        label={task.nextDue}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          flexShrink: 0,
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {highPriorityIssues.length > 0 && (tasksDueSoon.length > 0 || overdueTasks.length > 0) && (
              <Divider />
            )}

            {highPriorityIssues.length > 0 && (
              <Box>
                <Box display="flex" alignItems="center" gap={0.75} mb={1}>
                  <CriticalIcon sx={{ fontSize: 14, color: 'error.main' }} />
                  <Typography variant="caption" fontWeight={700} color="error.main" textTransform="uppercase" letterSpacing="0.05em">
                    High Priority Issues ({highPriorityIssues.length})
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={0.75}>
                  {highPriorityIssues.slice(0, 3).map((issue) => (
                    <Box key={issue.id} display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                      <Box minWidth={0}>
                        <Typography variant="body2" fontWeight={500} color="text.primary" noWrap>
                          {issue.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getAreaName(issue.areaId)}
                        </Typography>
                      </Box>
                      <Chip
                        label={issue.severity}
                        size="small"
                        color={severityColor[issue.severity]}
                        sx={{
                          height: 18,
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          flexShrink: 0,
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FocusSummary;
