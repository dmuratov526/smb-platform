import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  RocketLaunch as RocketIcon,
  AddTask as PromoteIcon,
  ExpandLess as ExpandIcon,
  OpenInNew as LinkIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { RootState } from '../../../app/store';
import { computeReadiness } from '../../launchPlanner/utils';
import { addRecurringTask } from '../slice';
import { OperationalArea } from '../types';

interface LaunchTransitionBannerProps {
  businessId: string;
  areas: OperationalArea[];
}

const LaunchTransitionBanner: React.FC<LaunchTransitionBannerProps> = ({
  businessId,
  areas,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);
  const [promotedIds, setPromotedIds] = useState<Set<string>>(new Set());

  const plan = useSelector(
    (state: RootState) => state.launchPlanner.plans[businessId]
  );

  const readiness = useMemo(
    () => (plan ? computeReadiness(plan) : null),
    [plan]
  );

  const completedTasks = useMemo(
    () =>
      plan
        ? plan.phases
            .flatMap((p) => p.tasks)
            .filter((t) => t.status === 'completed')
        : [],
    [plan]
  );

  if (!plan || !readiness || completedTasks.length === 0) return null;

  const defaultAreaId = areas[0]?.id ?? '';

  const handlePromote = (taskId: string, title: string, description?: string) => {
    dispatch(
      addRecurringTask({
        businessId,
        task: {
          title,
          description,
          frequency: 'weekly',
          status: 'pending',
          nextDue: 'This Week',
          areaId: defaultAreaId,
        },
      })
    );
    setPromotedIds((prev) => new Set([...prev, taskId]));
  };

  const readinessColor =
    readiness.overallPercent >= 80
      ? 'success'
      : readiness.overallPercent >= 50
      ? 'primary'
      : 'inherit';

  const readinessTextColor =
    readiness.overallPercent >= 80
      ? theme.palette.success.main
      : readiness.overallPercent >= 50
      ? theme.palette.primary.main
      : theme.palette.text.secondary;

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        bgcolor: alpha(theme.palette.primary.main, 0.025),
        mb: 3,
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Box display="flex" alignItems="center" gap={1.5} flex={1} minWidth={0}>
            <Box
              width={34}
              height={34}
              borderRadius={1.5}
              bgcolor={alpha(theme.palette.primary.main, 0.1)}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <RocketIcon sx={{ fontSize: 17, color: 'primary.main' }} />
            </Box>
            <Box flex={1} minWidth={0}>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                From Launch Planner
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {completedTasks.length} completed launch{' '}
                {completedTasks.length === 1 ? 'task' : 'tasks'} ·{' '}
                {readiness.overallPercent}% launch readiness
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
            <Button
              size="small"
              endIcon={<LinkIcon sx={{ fontSize: 12 }} />}
              onClick={() => navigate('/planner')}
              sx={{ fontSize: '0.72rem', height: 28, px: 1.25 }}
            >
              View Planner
            </Button>
            <IconButton
              size="small"
              onClick={() => setExpanded((e) => !e)}
              sx={{ p: 0.5 }}
            >
              <ExpandIcon
                sx={{
                  fontSize: 16,
                  color: 'text.secondary',
                  transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box mt={1.5} mb={expanded ? 2 : 0}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="text.secondary">
              Launch readiness
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: readinessTextColor }}
            >
              {readiness.overallPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={readiness.overallPercent}
            color={readinessColor === 'inherit' ? 'primary' : readinessColor}
            sx={{ height: 4, borderRadius: 2 }}
          />
        </Box>

        <Collapse in={expanded}>
          <Box mt={0.5}>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              textTransform="uppercase"
              letterSpacing="0.05em"
              display="block"
              mb={1}
            >
              Completed launch tasks — promote to recurring operations
            </Typography>
            <Box display="flex" flexDirection="column" gap={0.75}>
              {completedTasks.slice(0, 5).map((task) => {
                const isPromoted = promotedIds.has(task.id);
                return (
                  <Box
                    key={task.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1.5}
                    px={1.25}
                    py={0.75}
                    borderRadius={1.5}
                    bgcolor={
                      isPromoted
                        ? alpha(theme.palette.success.main, 0.06)
                        : alpha(theme.palette.background.paper, 0.7)
                    }
                    border={`1px solid ${
                      isPromoted
                        ? alpha(theme.palette.success.main, 0.2)
                        : theme.palette.divider
                    }`}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color={isPromoted ? 'text.secondary' : 'text.primary'}
                      noWrap
                      flex={1}
                      sx={{ textDecoration: isPromoted ? 'line-through' : 'none' }}
                    >
                      {task.title}
                    </Typography>

                    {isPromoted ? (
                      <Chip
                        label="Added to Ops"
                        size="small"
                        color="success"
                        sx={{
                          height: 20,
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          flexShrink: 0,
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    ) : (
                      <Tooltip title="Add as a recurring operational task">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PromoteIcon sx={{ fontSize: 13 }} />}
                          onClick={() =>
                            handlePromote(task.id, task.title, task.description)
                          }
                          sx={{
                            fontSize: '0.68rem',
                            height: 24,
                            flexShrink: 0,
                            borderRadius: 1.5,
                            px: 1,
                            minWidth: 0,
                          }}
                        >
                          Add to Ops
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}

              {completedTasks.length > 5 && (
                <Typography variant="caption" color="text.secondary" pl={0.5}>
                  +{completedTasks.length - 5} more completed tasks in the Launch
                  Planner
                </Typography>
              )}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default LaunchTransitionBanner;
