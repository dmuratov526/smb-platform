import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as DoneIcon,
  RadioButtonUnchecked as PendingIcon,
  Close as CloseIcon,
  KeyboardArrowDown as MinimizeIcon,
  KeyboardArrowUp as ExpandIcon,
  RocketLaunch as RocketIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setChecklistMinimized, setChecklistDismissed } from '../../app/uiSlice';
import { selectActiveBusinessModel } from '../businessModel/selectors';
import { computeBuilderHealth } from '../dashboard/utils';
import { computeReadiness } from '../launchPlanner/utils';

interface CheckStep {
  id: string;
  label: string;
  description: string;
  path: string;
  done: boolean;
  timeEstimate: string;
  color: string;
}

const GettingStartedChecklist: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { checklistMinimized, checklistDismissed } = useAppSelector((s) => s.ui);
  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const model = useAppSelector(selectActiveBusinessModel);
  const simulatorState = useAppSelector((s) => s.simulator);
  const plannerState = useAppSelector((s) => s.launchPlanner);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  const builderHealth = useMemo(() => computeBuilderHealth(model), [model]);

  const plannerReadiness = useMemo(() => {
    const plan = plannerState.plans[activeBusinessId ?? ''];
    if (!plan) return { overallPercent: 0, totalTasks: 0, completedTasks: 0 };
    return computeReadiness(plan);
  }, [plannerState, activeBusinessId]);

  const bizScenarios = simulatorState.scenarios[activeBusinessId ?? ''] ?? [];

  const steps: CheckStep[] = useMemo(() => [
    {
      id: 'biz',
      label: 'Create your business',
      description: 'Set up your first business profile to get started.',
      path: '/businesses',
      done: !!activeBusinessId && businesses.length > 0,
      timeEstimate: '1 min',
      color: '#6366F1',
    },
    {
      id: 'builder',
      label: 'Complete Business Builder',
      description: 'Fill in your offer, customers, revenue model, and team.',
      path: '/builder',
      done: builderHealth.completenessPercent >= 70,
      timeEstimate: '10 min',
      color: '#6366F1',
    },
    {
      id: 'simulator',
      label: 'Run your first simulation',
      description: 'Test your financial assumptions and find your break-even.',
      path: '/simulator',
      done: bizScenarios.length > 0 && !!simulatorState.activeScenarioId[activeBusinessId ?? ''],
      timeEstimate: '5 min',
      color: '#8B5CF6',
    },
    {
      id: 'planner',
      label: 'Set up your launch plan',
      description: 'Create your roadmap and assign tasks to each launch phase.',
      path: '/planner',
      done: plannerReadiness.completedTasks >= 3,
      timeEstimate: '8 min',
      color: '#0EA5E9',
    },
    {
      id: 'finance',
      label: 'Log your first transaction',
      description: 'Add an income or expense to start tracking your finances.',
      path: '/finance',
      done: false,
      timeEstimate: '2 min',
      color: '#10B981',
    },
    {
      id: 'dashboard',
      label: 'Review your Dashboard',
      description: 'See your business health, priorities, and recommended actions.',
      path: '/dashboard',
      done: false,
      timeEstimate: '3 min',
      color: '#F59E0B',
    },
  ], [activeBusinessId, businesses, builderHealth, bizScenarios, simulatorState, plannerReadiness]);

  const doneCount = steps.filter((s) => s.done).length;
  const totalCount = steps.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);
  const nextStep = steps.find((s) => !s.done);

  const accentColor = activeBusiness?.logoColor ?? theme.palette.primary.main;

  if (checklistDismissed) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1300,
        width: checklistMinimized ? 'auto' : 320,
        transition: 'width 0.2s ease',
      }}
    >
      {checklistMinimized ? (
        /* ── Minimized pill ── */
        <Box
          onClick={() => dispatch(setChecklistMinimized(false))}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 10,
            bgcolor: accentColor,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: `0 4px 20px ${alpha(accentColor, 0.45)}`,
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: `0 6px 28px ${alpha(accentColor, 0.55)}`,
              transform: 'translateY(-2px)',
            },
          }}
        >
          <RocketIcon sx={{ fontSize: 16 }} />
          <Typography fontWeight={800} sx={{ fontSize: '0.8rem' }}>
            Getting Started
          </Typography>
          <Box
            px={0.75}
            py={0.1}
            borderRadius={1}
            bgcolor="rgba(255,255,255,0.25)"
            border="1px solid rgba(255,255,255,0.35)"
          >
            <Typography fontWeight={900} sx={{ fontSize: '0.72rem' }}>
              {doneCount}/{totalCount}
            </Typography>
          </Box>
          <ExpandIcon sx={{ fontSize: 16, opacity: 0.8 }} />
        </Box>
      ) : (
        /* ── Expanded card ── */
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: `0 8px 40px ${alpha(theme.palette.common.black, 0.18)}, 0 0 0 1px ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            px={2}
            py={1.5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              background: `linear-gradient(135deg, ${accentColor}, ${alpha(accentColor, 0.75)})`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <RocketIcon sx={{ fontSize: 16, color: '#fff' }} />
              <Typography fontWeight={800} sx={{ color: '#fff', fontSize: '0.85rem' }}>
                Getting Started
              </Typography>
              <Chip
                label={`${doneCount}/${totalCount}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  bgcolor: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.35)',
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            </Box>
            <Box display="flex" gap={0.25}>
              <Tooltip title="Minimize">
                <IconButton size="small" onClick={() => dispatch(setChecklistMinimized(true))} sx={{ color: 'rgba(255,255,255,0.8)', p: 0.4 }}>
                  <MinimizeIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dismiss">
                <IconButton size="small" onClick={() => dispatch(setChecklistDismissed(true))} sx={{ color: 'rgba(255,255,255,0.8)', p: 0.4 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Progress bar */}
          <Box px={2} pt={1.5} pb={1} borderBottom={`1px solid ${theme.palette.divider}`}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.68rem' }}>
                {doneCount === totalCount ? '🎉 All steps complete!' : `${totalCount - doneCount} steps remaining`}
              </Typography>
              <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem', color: accentColor }}>
                {progressPct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: alpha(accentColor, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${accentColor}, ${alpha(accentColor, 0.7)})`,
                },
              }}
            />
          </Box>

          {/* Steps list */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {steps.map((step, idx) => (
              <Box
                key={step.id}
                onClick={() => !step.done && navigate(step.path)}
                sx={{
                  px: 2,
                  py: 1.25,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.25,
                  cursor: step.done ? 'default' : 'pointer',
                  borderBottom: idx < steps.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                  transition: 'bgcolor 0.15s',
                  bgcolor: step === nextStep ? alpha(step.color, 0.04) : 'transparent',
                  '&:hover': step.done ? {} : { bgcolor: alpha(step.color, 0.06) },
                }}
              >
                {/* Check icon */}
                <Box flexShrink={0} mt={0.1}>
                  {step.done
                    ? <DoneIcon sx={{ fontSize: 17, color: '#10B981' }} />
                    : <PendingIcon sx={{ fontSize: 17, color: step === nextStep ? step.color : alpha(theme.palette.text.secondary, 0.4) }} />}
                </Box>

                {/* Text */}
                <Box flex={1} minWidth={0}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap={0.5}>
                    <Typography
                      variant="caption"
                      fontWeight={step.done ? 500 : step === nextStep ? 700 : 600}
                      sx={{
                        fontSize: '0.78rem',
                        color: step.done ? 'text.disabled' : 'text.primary',
                        textDecoration: step.done ? 'line-through' : 'none',
                        lineHeight: 1.3,
                      }}
                    >
                      {step.label}
                    </Typography>
                    {!step.done && (
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.62rem', flexShrink: 0 }}>
                        ~{step.timeEstimate}
                      </Typography>
                    )}
                  </Box>
                  {!step.done && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>
                      {step.description}
                    </Typography>
                  )}
                </Box>

                {/* Arrow for next step */}
                {step === nextStep && !step.done && (
                  <ArrowIcon sx={{ fontSize: 14, color: step.color, flexShrink: 0, mt: 0.25 }} />
                )}
              </Box>
            ))}
          </Box>

          {/* Footer */}
          <Box
            px={2}
            py={1.25}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderTop={`1px solid ${theme.palette.divider}`}
            bgcolor={alpha(theme.palette.text.primary, 0.01)}
          >
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: '0.68rem', cursor: 'pointer', '&:hover': { color: 'text.secondary' } }}
              onClick={() => navigate('/journey')}
            >
              View full journey →
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
              {activeBusiness?.name ?? 'No business selected'}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GettingStartedChecklist;
