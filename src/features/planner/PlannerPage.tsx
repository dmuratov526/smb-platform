import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as PendingIcon,
  PlayCircle as InProgressIcon,
  Block as BlockedIcon,
  FlagOutlined as MilestoneIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockLaunchPlans } from '../../mock/launchPlan';
import { LaunchTask, LaunchTaskStatus, LaunchTaskPriority } from '../../types';

const statusIcon: Record<LaunchTaskStatus, React.ReactNode> = {
  completed: <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />,
  in_progress: <InProgressIcon sx={{ fontSize: 16, color: 'primary.main' }} />,
  pending: <PendingIcon sx={{ fontSize: 16, color: 'text.disabled' }} />,
  blocked: <BlockedIcon sx={{ fontSize: 16, color: 'error.main' }} />,
};

const statusColor: Record<LaunchTaskStatus, 'success' | 'primary' | 'default' | 'error'> = {
  completed: 'success',
  in_progress: 'primary',
  pending: 'default',
  blocked: 'error',
};

const priorityColor: Record<LaunchTaskPriority, 'error' | 'warning' | 'primary' | 'default'> = {
  critical: 'error',
  high: 'warning',
  medium: 'primary',
  low: 'default',
};

const groupByCategory = (tasks: LaunchTask[]) => {
  return tasks.reduce<Record<string, LaunchTask[]>>((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});
};

const PlannerPage: React.FC = () => {
  const theme = useTheme();
  const { activeBusinessId } = useAppSelector((s) => s.business);
  const plan = mockLaunchPlans.find((p) => p.businessId === activeBusinessId);
  const [tab, setTab] = useState(0);

  if (!plan) {
    return (
      <Box>
        <PageHeader title="Launch Planner" description="Convert your business model into a launch roadmap." />
        <Alert severity="info">No launch plan found for this business. Complete the Business Builder first.</Alert>
      </Box>
    );
  }

  const completedTasks = plan.tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = plan.tasks.filter((t) => t.status === 'in_progress').length;
  const blockedTasks = plan.tasks.filter((t) => t.status === 'blocked').length;
  const grouped = groupByCategory(plan.tasks);

  const milestoneStatus: Record<string, { label: string; color: 'success' | 'primary' | 'default' }> = {
    completed: { label: 'Completed', color: 'success' },
    in_progress: { label: 'In Progress', color: 'primary' },
    upcoming: { label: 'Upcoming', color: 'default' },
  };

  return (
    <Box>
      <PageHeader
        title="Launch Planner"
        description="Track tasks, milestones, and launch readiness from model to execution."
        actions={
          <Button variant="contained" size="small" startIcon={<AddIcon />}>
            Add Task
          </Button>
        }
      />

      {/* Readiness banner */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          boxShadow: 'none',
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Launch Readiness
                </Typography>
                <Chip
                  label={`${plan.readinessScore}%`}
                  size="small"
                  color={plan.readinessScore >= 80 ? 'success' : plan.readinessScore >= 50 ? 'warning' : 'error'}
                  sx={{ fontWeight: 700, fontSize: '0.8rem' }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={plan.readinessScore}
                color={plan.readinessScore >= 80 ? 'success' : plan.readinessScore >= 50 ? 'warning' : 'error'}
                sx={{ height: 8, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Target launch: <strong>{plan.targetLaunchDate}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={1.5}>
                {[
                  { label: 'Completed', value: completedTasks, color: 'success.main' },
                  { label: 'In Progress', value: inProgressTasks, color: 'primary.main' },
                  { label: 'Pending', value: plan.tasks.filter((t) => t.status === 'pending').length, color: 'text.secondary' },
                  { label: 'Blocked', value: blockedTasks, color: 'error.main' },
                ].map((stat) => (
                  <Grid item xs={6} key={stat.label}>
                    <Box textAlign="center" p={1} borderRadius={1.5} bgcolor="background.paper" border="1px solid" borderColor="divider">
                      <Typography variant="h6" fontWeight={700} color={stat.color}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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

      <Card>
        <Box borderBottom="1px solid" borderColor="divider" px={1}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Tasks by Category" />
            <Tab label="Milestones" />
          </Tabs>
        </Box>

        {/* Tasks tab */}
        {tab === 0 && (
          <CardContent>
            {Object.entries(grouped).map(([category, tasks], catIdx) => (
              <Box key={category} mb={catIdx < Object.keys(grouped).length - 1 ? 3 : 0}>
                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing="0.08em">
                    {category}
                  </Typography>
                  <Chip
                    label={`${tasks.filter((t) => t.status === 'completed').length}/${tasks.length}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                  />
                </Box>
                <List disablePadding>
                  {tasks.map((task, idx) => (
                    <React.Fragment key={task.id}>
                      {idx > 0 && <Divider />}
                      <ListItem
                        disablePadding
                        sx={{
                          py: 1.25,
                          opacity: task.status === 'blocked' ? 0.7 : 1,
                        }}
                      >
                        <Box mr={1.25} display="flex" alignItems="center">
                          {statusIcon[task.status]}
                        </Box>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                              <Typography
                                variant="body2"
                                fontWeight={task.status === 'completed' ? 400 : 500}
                                sx={{
                                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                  color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                                }}
                              >
                                {task.title}
                              </Typography>
                              <Chip
                                label={task.priority}
                                size="small"
                                color={priorityColor[task.priority]}
                                sx={{
                                  height: 16,
                                  fontSize: '0.6rem',
                                  fontWeight: 700,
                                  textTransform: 'capitalize',
                                  '& .MuiChip-label': { px: 0.75 },
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            task.dueDate || task.description ? (
                              <Typography variant="caption" color="text.secondary">
                                {task.description && `${task.description} · `}
                                {task.dueDate && `Due: ${task.dueDate}`}
                                {task.dependsOn?.length ? ` · Depends on ${task.dependsOn.length} task(s)` : ''}
                              </Typography>
                            ) : null
                          }
                        />
                        <Chip
                          label={task.status.replace('_', ' ')}
                          size="small"
                          color={statusColor[task.status]}
                          variant={task.status === 'completed' ? 'filled' : 'outlined'}
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.65rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { px: 0.75 },
                          }}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            ))}
          </CardContent>
        )}

        {/* Milestones tab */}
        {tab === 1 && (
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              {plan.milestones.map((milestone) => {
                const milestoneTasks = plan.tasks.filter((t) => milestone.taskIds.includes(t.id));
                const completedCount = milestoneTasks.filter((t) => t.status === 'completed').length;
                const progress = milestoneTasks.length > 0 ? (completedCount / milestoneTasks.length) * 100 : 0;
                const { label, color } = milestoneStatus[milestone.status];

                return (
                  <Card
                    key={milestone.id}
                    variant="outlined"
                    sx={{
                      borderColor:
                        milestone.status === 'completed'
                          ? 'success.main'
                          : milestone.status === 'in_progress'
                          ? 'primary.main'
                          : 'divider',
                      bgcolor:
                        milestone.status === 'completed'
                          ? alpha(theme.palette.success.main, 0.04)
                          : milestone.status === 'in_progress'
                          ? alpha(theme.palette.primary.main, 0.04)
                          : 'transparent',
                      boxShadow: 'none',
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MilestoneIcon
                            sx={{
                              fontSize: 18,
                              color:
                                milestone.status === 'completed'
                                  ? 'success.main'
                                  : milestone.status === 'in_progress'
                                  ? 'primary.main'
                                  : 'text.disabled',
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {milestone.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Target: {milestone.targetDate}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption" color="text.secondary">
                            {completedCount}/{milestoneTasks.length} tasks
                          </Typography>
                          <Chip label={label} size="small" color={color} sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={color === 'default' ? 'inherit' : color}
                        sx={{ mb: 1.5, height: 5 }}
                      />
                      <Box display="flex" gap={0.75} flexWrap="wrap">
                        {milestoneTasks.map((task) => (
                          <Chip
                            key={task.id}
                            label={task.title}
                            size="small"
                            variant={task.status === 'completed' ? 'filled' : 'outlined'}
                            color={task.status === 'completed' ? 'success' : 'default'}
                            sx={{ height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default PlannerPage;
