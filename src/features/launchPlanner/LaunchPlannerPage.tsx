import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  RocketLaunch as RocketIcon,
  ArrowForward as ArrowIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLaunchPlan, makeSelectLaunchReadiness } from './selectors';
import { initPlanForBusiness, updateTaskStatus, addTask, updateTask, deleteTask, addPhase, updatePhase, deletePhase } from './slice';
import { LaunchPhase, PlannerTask, PlannerTaskStatus } from './types';
import ReadinessSummary from './components/ReadinessSummary';
import PhaseProgress from './components/PhaseProgress';
import LaunchTaskList from './components/LaunchTaskList';

const LaunchPlannerPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  const plan = useAppSelector((s) =>
    activeBusinessId ? selectLaunchPlan(s, activeBusinessId) : undefined
  );

  const selectReadiness = useMemo(
    () => (activeBusinessId ? makeSelectLaunchReadiness(activeBusinessId) : null),
    [activeBusinessId]
  );
  const readiness = useAppSelector((s) => (selectReadiness ? selectReadiness(s) : null));

  useEffect(() => {
    if (activeBusinessId && activeBusiness && !plan) {
      dispatch(
        initPlanForBusiness({
          businessId: activeBusinessId,
          industry: activeBusiness.industry,
          category: activeBusiness.category,
        })
      );
    }
  }, [activeBusinessId, activeBusiness, plan, dispatch]);

  const handleTaskStatusChange = (
    phaseId: string,
    taskId: string,
    status: PlannerTaskStatus
  ) => {
    if (!activeBusinessId) return;
    dispatch(updateTaskStatus({ businessId: activeBusinessId, phaseId, taskId, status }));
  };

  const handleTaskEdit = (
    phaseId: string,
    taskId: string,
    updates: Partial<Omit<PlannerTask, 'id' | 'phaseId'>>
  ) => {
    if (!activeBusinessId) return;
    dispatch(updateTask({ businessId: activeBusinessId, phaseId, taskId, updates }));
  };

  const handleTaskDelete = (phaseId: string, taskId: string) => {
    if (!activeBusinessId) return;
    dispatch(deleteTask({ businessId: activeBusinessId, phaseId, taskId }));
  };

  const handleTaskAdd = (
    phaseId: string,
    task: Omit<PlannerTask, 'id' | 'phaseId'>
  ) => {
    if (!activeBusinessId) return;
    dispatch(addTask({ businessId: activeBusinessId, phaseId, task }));
  };

  const handlePhaseEdit = (
    phaseId: string,
    updates: Partial<Pick<LaunchPhase, 'name' | 'description'>>
  ) => {
    if (!activeBusinessId) return;
    dispatch(updatePhase({ businessId: activeBusinessId, phaseId, updates }));
  };

  const handlePhaseDelete = (phaseId: string) => {
    if (!activeBusinessId) return;
    dispatch(deletePhase({ businessId: activeBusinessId, phaseId }));
  };

  const handlePhaseAdd = (phase: Omit<LaunchPhase, 'id' | 'order' | 'tasks'>) => {
    if (!activeBusinessId) return;
    dispatch(addPhase({ businessId: activeBusinessId, phase }));
  };

  if (!activeBusinessId || !activeBusiness) {
    return (
      <Box>
        <PageHeader
          title="Launch Planner"
          description="Turn your business model into an executable launch roadmap."
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={10}
          textAlign="center"
        >
          <Box
            width={64}
            height={64}
            borderRadius={3}
            bgcolor={alpha(theme.palette.primary.main, 0.08)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
          >
            <RocketIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            No business selected
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={380} mb={3}>
            Create a business first, then use the Launch Planner to organize and track your
            path from preparation to go-live.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/onboarding')}
            sx={{ borderRadius: 2 }}
          >
            Create a Business
          </Button>
        </Box>
      </Box>
    );
  }

  if (!plan || !readiness) {
    return (
      <Box>
        <PageHeader
          title="Launch Planner"
          description="Turn your business model into an executable launch roadmap."
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={10}
          textAlign="center"
        >
          <Box
            width={64}
            height={64}
            borderRadius={3}
            bgcolor={alpha(theme.palette.warning.main, 0.08)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
          >
            <RocketIcon sx={{ fontSize: 32, color: 'warning.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            No launch plan yet
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={380} mb={3}>
            Complete the Business Builder to generate a tailored launch plan for{' '}
            <strong>{activeBusiness.name}</strong>.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ArrowIcon />}
            onClick={() => navigate('/builder')}
            sx={{ borderRadius: 2 }}
          >
            Go to Business Builder
          </Button>
        </Box>
      </Box>
    );
  }

  const activePhase = plan.phases[readiness.activePhaseIndex];
  const isReadyToLaunch = readiness.overallPercent >= 80;

  return (
    <Box>
      <PageHeader
        title="Launch Planner"
        description="Track your readiness and execute the steps needed to go live."
        actions={
          <Box display="flex" alignItems="center" gap={1.5}>
            <Chip
              label={activeBusiness.name}
              size="small"
              sx={{
                bgcolor: activeBusiness.logoColor,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
            {plan.targetLaunchDate && (
              <Chip
                icon={<CalendarIcon sx={{ fontSize: 12 }} />}
                label={`Target: ${plan.targetLaunchDate}`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.72rem' }}
              />
            )}
          </Box>
        }
      />

      {/* Launch-ready banner */}
      {isReadyToLaunch && (
        <Alert
          severity="success"
          icon={<RocketIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <strong>{activeBusiness.name}</strong> is {readiness.overallPercent}% launch ready.
          Complete the remaining tasks and you're good to go live.
        </Alert>
      )}

      {/* Active phase context */}
      {activePhase && !isReadyToLaunch && (
        <Box
          mb={3}
          p={2}
          borderRadius={2}
          bgcolor={alpha(theme.palette.primary.main, 0.04)}
          border={`1px solid ${alpha(theme.palette.primary.main, 0.15)}`}
          display="flex"
          alignItems="center"
          gap={1.5}
        >
          <Box
            width={8}
            height={8}
            borderRadius="50%"
            bgcolor="primary.main"
            flexShrink={0}
            sx={{ animation: 'pulse 2s infinite' }}
          />
          <Typography variant="body2" color="text.primary">
            <strong>Currently working on:</strong>{' '}
            <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
              {activePhase.name}
            </span>{' '}
            — {activePhase.description}
          </Typography>
        </Box>
      )}

      {/* Readiness summary */}
      <ReadinessSummary readiness={readiness} business={activeBusiness} />

      {/* Phase progress overview */}
      <PhaseProgress
        phaseReadiness={readiness.phaseReadiness}
        activePhaseIndex={readiness.activePhaseIndex}
      />

      {/* Task list grouped by phase */}
      <LaunchTaskList
        phases={plan.phases}
        activePhaseIndex={readiness.activePhaseIndex}
        onTaskStatusChange={handleTaskStatusChange}
        onTaskEdit={handleTaskEdit}
        onTaskDelete={handleTaskDelete}
        onTaskAdd={handleTaskAdd}
        onPhaseEdit={handlePhaseEdit}
        onPhaseDelete={handlePhaseDelete}
        onPhaseAdd={handlePhaseAdd}
      />
    </Box>
  );
};

export default LaunchPlannerPage;
