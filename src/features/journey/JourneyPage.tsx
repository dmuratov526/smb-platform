import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  Typography,
  Chip,
  Grid,
  LinearProgress,
  Button,
  Alert,
} from '@mui/material';
import {
  BusinessCenter as BuilderIcon,
  BarChart as SimulatorIcon,
  RocketLaunch as PlannerIcon,
  Handyman as OpsIcon,
  Insights as MonitorIcon,
  CheckCircle as DoneIcon,
  PlayCircleOutline as ActiveIcon,
  LockOutlined as LockedIcon,
  ArrowForward as ArrowIcon,
  EmojiObjects as TipIcon,
  AutoGraph as ProgressIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppSelector } from '../../app/hooks';
import { selectActiveBusinessModel } from '../businessModel/selectors';
import { computeBuilderHealth } from '../dashboard/utils';
import { computeReadiness } from '../launchPlanner/utils';

/* ─── Types ─── */
type StageStatus = 'done' | 'active' | 'upcoming';

interface StageConfig {
  key: string;
  number: number;
  label: string;
  sublabel: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  ctaLabel: string;
  completionPct: number;
  status: StageStatus;
  statsLine?: string;
}

/* ─── Page ─── */
const JourneyPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);
  const model = useAppSelector(selectActiveBusinessModel);
  const simulatorState = useAppSelector((s) => s.simulator);
  const plannerState = useAppSelector((s) => s.launchPlanner);
  const opsState = useAppSelector((s) => s.operations);

  /* ── Compute per-stage completion ── */
  const builderHealth = useMemo(() => computeBuilderHealth(model), [model]);

  const plannerReadiness = useMemo(() => {
    const plan = plannerState.plans[activeBusinessId ?? ''];
    if (!plan) return { overallPercent: 0, totalTasks: 0, completedTasks: 0 };
    return computeReadiness(plan);
  }, [plannerState, activeBusinessId]);

  const simulatorPct = useMemo(() => {
    const bizScenarios = simulatorState.scenarios[activeBusinessId ?? ''] ?? [];
    const hasScenarios = bizScenarios.length > 0;
    const hasActive = !!simulatorState.activeScenarioId[activeBusinessId ?? ''];
    if (!hasScenarios) return 0;
    if (!hasActive) return 30;
    return 65;
  }, [simulatorState, activeBusinessId]);

  const opsPct = useMemo(() => {
    const data = opsState.data[activeBusinessId ?? ''];
    if (!data) return 0;
    const totalTasks = data.recurringTasks?.length ?? 0;
    const openIssues = data.issues?.filter((i) => i.status === 'open').length ?? 0;
    if (totalTasks === 0) return 15;
    if (openIssues > 3) return 40;
    return 70;
  }, [opsState, activeBusinessId]);

  /* ── Determine overall journey stage ── */
  const monitorPct = opsPct > 0 || plannerReadiness.overallPercent >= 70 ? 75 : 0;

  const overallPct = Math.round(
    builderHealth.completenessPercent * 0.3 +
    simulatorPct * 0.2 +
    plannerReadiness.overallPercent * 0.2 +
    opsPct * 0.15 +
    monitorPct * 0.15
  );

  /* ── Stage definitions ── */
  const stages: StageConfig[] = useMemo(() => {
    const b = builderHealth.completenessPercent;
    const s = simulatorPct;
    const p = plannerReadiness.overallPercent;
    const o = opsPct;

    const getStatus = (pct: number, prev: number): StageStatus => {
      if (pct >= 80) return 'done';
      if (pct > 0 || prev >= 60) return 'active';
      return 'upcoming';
    };

    return [
      {
        key: 'builder',
        number: 1,
        label: 'Business Builder',
        sublabel: 'Design your model',
        description:
          'Define your offer, revenue streams, cost structure, team, and go-to-market strategy. Turn your idea into a structured business system.',
        icon: <BuilderIcon />,
        path: '/builder',
        color: '#6366F1',
        ctaLabel: b >= 80 ? 'Review Builder' : b > 0 ? 'Continue Building' : 'Start Building',
        completionPct: b,
        status: getStatus(b, 100),
        statsLine: `${builderHealth.filledFields} / ${builderHealth.totalFields} fields complete`,
      },
      {
        key: 'simulator',
        number: 2,
        label: 'Business Simulator',
        sublabel: 'Test your assumptions',
        description:
          'Run financial scenarios, adjust pricing, staffing, and costs. Find your break-even point and validate your model before investing.',
        icon: <SimulatorIcon />,
        path: '/simulator',
        color: '#8B5CF6',
        ctaLabel: s >= 80 ? 'View Results' : s > 0 ? 'Keep Simulating' : 'Run Simulation',
        completionPct: s,
        status: getStatus(s, b),
        statsLine: (() => { const sc = simulatorState.scenarios[activeBusinessId ?? ''] ?? []; return `${sc.length} scenario${sc.length !== 1 ? 's' : ''} configured`; })(),
      },
      {
        key: 'planner',
        number: 3,
        label: 'Launch Planner',
        sublabel: 'Plan your launch',
        description:
          'Convert your validated business model into an actionable launch roadmap. Set milestones, assign tasks, and track your path to opening day.',
        icon: <PlannerIcon />,
        path: '/planner',
        color: '#0EA5E9',
        ctaLabel: p >= 80 ? 'Launch Ready!' : p > 0 ? 'Continue Planning' : 'Build Your Plan',
        completionPct: p,
        status: getStatus(p, s),
        statsLine: `${plannerReadiness.completedTasks} / ${plannerReadiness.totalTasks} tasks done`,
      },
      {
        key: 'operations',
        number: 4,
        label: 'Operations',
        sublabel: 'Run your business',
        description:
          'Manage day-to-day processes, recurring tasks, and operational issues. Keep your business running smoothly after launch.',
        icon: <OpsIcon />,
        path: '/operations',
        color: '#10B981',
        ctaLabel: o >= 60 ? 'Manage Ops' : o > 0 ? 'Review Operations' : 'Set Up Operations',
        completionPct: o,
        status: getStatus(o, p),
        statsLine: o > 0 ? 'Operations workspace active' : 'Not yet configured',
      },
      {
        key: 'monitor',
        number: 5,
        label: 'Monitor & Grow',
        sublabel: 'Track & improve',
        description:
          'Use your dashboard, analytics, and AI assistant to monitor performance, spot issues, and find growth opportunities across all modules.',
        icon: <MonitorIcon />,
        path: '/dashboard',
        color: '#F59E0B',
        ctaLabel: 'Open Dashboard',
        completionPct: monitorPct,
        status: getStatus(monitorPct, o),
        statsLine: monitorPct > 0 ? 'Dashboard & analytics available' : 'Complete earlier steps first',
      },
    ];
  }, [builderHealth, simulatorPct, plannerReadiness, opsPct, simulatorState]);

  /* ── Next recommended action ── */
  const nextStage = stages.find((s) => s.status === 'active' && s.completionPct < 80) ?? stages[0];

  const bizColor = activeBusiness?.logoColor ?? theme.palette.primary.main;

  return (
    <Box>
      {!activeBusiness && (
        <Alert
          severity="info"
          sx={{ mb: 2.5, borderRadius: 2 }}
          action={
            <Button size="small" color="inherit" sx={{ fontWeight: 700 }} onClick={() => navigate('/onboarding')}>
              Create Business
            </Button>
          }
        >
          No business selected. Create your first business to start tracking your journey progress.
        </Alert>
      )}
      {/* ══ Hero ══ */}
      <Box
        mb={4}
        p={3.5}
        borderRadius={3}
        sx={{
          background: `linear-gradient(135deg, ${alpha(bizColor, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 50%, ${alpha(theme.palette.background.paper, 0)} 100%)`,
          border: `1px solid ${alpha(bizColor, 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', right: -60, top: -60, width: 220, height: 220, borderRadius: '50%', bgcolor: alpha(bizColor, 0.06), pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', right: 80, bottom: -80, width: 160, height: 160, borderRadius: '50%', bgcolor: alpha(bizColor, 0.04), pointerEvents: 'none' }} />

        <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2} position="relative">
          <Box>
            <Typography variant="caption" fontWeight={700} sx={{ color: bizColor, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Business Journey
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.2, mt: 0.5, letterSpacing: '-0.03em' }}>
              {activeBusiness?.name ?? 'Your Business'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.75} sx={{ maxWidth: 500 }}>
              Follow this guided journey to build, simulate, launch, and grow your business step by step.
            </Typography>
          </Box>

          {/* Overall progress ring (numeric) */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={96}
            height={96}
            borderRadius="50%"
            flexShrink={0}
            sx={{
              background: `conic-gradient(${bizColor} ${overallPct * 3.6}deg, ${alpha(bizColor, 0.12)} 0deg)`,
              boxShadow: `0 0 0 4px ${alpha(bizColor, 0.12)}`,
            }}
          >
            <Box
              width={72}
              height={72}
              borderRadius="50%"
              bgcolor="background.default"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography fontWeight={900} sx={{ fontSize: '1.4rem', lineHeight: 1, color: bizColor }}>
                {overallPct}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>% done</Typography>
            </Box>
          </Box>
        </Box>

        {/* Overall progress bar */}
        <Box mt={2.5}>
          <Box display="flex" justifyContent="space-between" mb={0.75}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.72rem' }}>
              Overall journey progress
            </Typography>
            <Box display="flex" gap={1}>
              {stages.map((s) => (
                <Box key={s.key} display="flex" alignItems="center" gap={0.3}>
                  {s.status === 'done'
                    ? <DoneIcon sx={{ fontSize: 11, color: 'success.main' }} />
                    : s.status === 'active'
                    ? <ActiveIcon sx={{ fontSize: 11, color: s.color }} />
                    : <LockedIcon sx={{ fontSize: 11, color: 'text.disabled' }} />}
                </Box>
              ))}
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallPct}
            sx={{
              height: 6, borderRadius: 3,
              bgcolor: alpha(bizColor, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${bizColor}, ${alpha(bizColor, 0.7)})`,
              },
            }}
          />
        </Box>
      </Box>

      {/* ══ Stage Cards ══ */}
      <Grid container spacing={2} mb={3}>
        {stages.map((stage, idx) => {
          const isDone = stage.status === 'done';
          const isActive = stage.status === 'active';
          const isUpcoming = stage.status === 'upcoming';

          return (
            <Grid item xs={12} sm={6} md={12 / 5} key={stage.key}>
              {/* Connector line above (mobile hidden) */}
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: isActive
                    ? `2px solid ${stage.color}`
                    : isDone
                    ? `1.5px solid ${alpha('#10B981', 0.4)}`
                    : `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  opacity: isUpcoming ? 0.6 : 1,
                  boxShadow: isActive ? `0 0 0 3px ${alpha(stage.color, 0.12)}, 0 4px 20px ${alpha(stage.color, 0.12)}` : 'none',
                  '&:hover': isUpcoming ? {} : {
                    boxShadow: `0 0 0 3px ${alpha(stage.color, 0.2)}, 0 6px 24px ${alpha(stage.color, 0.15)}`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => !isUpcoming && navigate(stage.path)}
                  disabled={isUpcoming}
                  sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', p: 0 }}
                >
                  {/* Stage header */}
                  <Box
                    px={2} pt={2} pb={1.5}
                    sx={{
                      background: isDone
                        ? `linear-gradient(135deg, ${alpha('#10B981', 0.08)}, ${alpha('#10B981', 0.03)})`
                        : isActive
                        ? `linear-gradient(135deg, ${alpha(stage.color, 0.1)}, ${alpha(stage.color, 0.03)})`
                        : `${alpha(theme.palette.text.primary, 0.02)}`,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Box
                        width={38}
                        height={38}
                        borderRadius={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          bgcolor: isDone
                            ? alpha('#10B981', 0.15)
                            : isActive
                            ? alpha(stage.color, 0.14)
                            : alpha(theme.palette.text.primary, 0.06),
                          color: isDone ? '#10B981' : isActive ? stage.color : 'text.disabled',
                          '& svg': { fontSize: 20 },
                        }}
                      >
                        {stage.icon}
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                        <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Step {stage.number}
                        </Typography>
                        {isDone ? (
                          <Chip label="✓ Done" size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 800, bgcolor: alpha('#10B981', 0.12), color: '#10B981', '& .MuiChip-label': { px: 0.75 } }} />
                        ) : isActive ? (
                          <Chip label="In Progress" size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 700, bgcolor: alpha(stage.color, 0.12), color: stage.color, '& .MuiChip-label': { px: 0.75 } }} />
                        ) : (
                          <Chip label="Upcoming" size="small" sx={{ height: 18, fontSize: '0.58rem', fontWeight: 600, bgcolor: alpha(theme.palette.text.primary, 0.05), color: 'text.disabled', '& .MuiChip-label': { px: 0.75 } }} />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={800} color={isUpcoming ? 'text.disabled' : 'text.primary'} sx={{ fontSize: '0.88rem', lineHeight: 1.3 }}>
                      {stage.label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.68rem', color: isActive ? stage.color : 'text.secondary', fontWeight: 600 }}>
                      {stage.sublabel}
                    </Typography>
                  </Box>

                  {/* Card body */}
                  <Box px={2} py={1.75} flex={1} display="flex" flexDirection="column">
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', lineHeight: 1.55, mb: 1.5, flex: 1 }}>
                      {stage.description}
                    </Typography>

                    {/* Progress */}
                    {!isUpcoming && (
                      <Box mb={1.5}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>{stage.statsLine}</Typography>
                          <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem', color: isDone ? '#10B981' : stage.color }}>
                            {stage.completionPct}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, stage.completionPct)}
                          sx={{
                            height: 4, borderRadius: 2,
                            bgcolor: alpha(isDone ? '#10B981' : stage.color, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 2,
                              bgcolor: isDone ? '#10B981' : stage.color,
                            },
                          }}
                        />
                      </Box>
                    )}

                    {/* CTA */}
                    <Button
                      size="small"
                      variant={isActive ? 'contained' : 'outlined'}
                      disabled={isUpcoming}
                      fullWidth
                      endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
                      onClick={(e) => { e.stopPropagation(); navigate(stage.path); }}
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        height: 32,
                        ...(isActive && {
                          background: `linear-gradient(135deg, ${stage.color}, ${alpha(stage.color, 0.82)})`,
                          boxShadow: `0 2px 10px ${alpha(stage.color, 0.3)}`,
                          '&:hover': { background: stage.color },
                        }),
                        ...(isDone && {
                          borderColor: alpha('#10B981', 0.4),
                          color: '#10B981',
                          '&:hover': { borderColor: '#10B981', bgcolor: alpha('#10B981', 0.05) },
                        }),
                      }}
                    >
                      {stage.ctaLabel}
                    </Button>
                  </Box>
                </CardActionArea>

                {/* Active stage indicator bar */}
                {isActive && (
                  <Box height={3} sx={{ background: `linear-gradient(90deg, ${stage.color}, ${alpha(stage.color, 0.5)})` }} />
                )}
              </Card>

              {/* Connector arrow between cards (desktop) */}
              {idx < stages.length - 1 && (
                <Box
                  display={{ xs: 'none', md: 'flex' }}
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    position: 'absolute',
                    right: -12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                >
                </Box>
              )}
            </Grid>
          );
        })}
      </Grid>

      {/* ══ Recommendation + Quick Stats ══ */}
      <Grid container spacing={2}>
        {/* Next recommended action */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: `1.5px solid ${alpha(nextStage.color, 0.35)}`,
              borderRadius: 2.5,
              background: `linear-gradient(135deg, ${alpha(nextStage.color, 0.06)}, ${alpha(nextStage.color, 0.02)})`,
              overflow: 'hidden',
            }}
          >
            <Box px={2.5} py={2} display="flex" alignItems="center" gap={2}>
              <Box
                width={44}
                height={44}
                borderRadius={2}
                flexShrink={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ bgcolor: alpha(nextStage.color, 0.15), color: nextStage.color, '& svg': { fontSize: 22 } }}
              >
                <TipIcon />
              </Box>
              <Box flex={1}>
                <Typography variant="caption" fontWeight={700} sx={{ color: nextStage.color, fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Recommended Next Step
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} color="text.primary" mt={0.25}>
                  {nextStage.ctaLabel} — {nextStage.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {nextStage.description.split('.')[0]}.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate(nextStage.path)}
                endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
                sx={{
                  flexShrink: 0,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '0.76rem',
                  background: `linear-gradient(135deg, ${nextStage.color}, ${alpha(nextStage.color, 0.8)})`,
                  boxShadow: `0 2px 10px ${alpha(nextStage.color, 0.3)}`,
                  '&:hover': { background: nextStage.color },
                }}
              >
                Go Now
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Quick stats */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2.5, height: '100%' }}>
            <Box px={2.5} py={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <ProgressIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Journey Stats
                </Typography>
              </Box>
              <Grid container spacing={1.5}>
                {[
                  { label: 'Builder', value: `${builderHealth.completenessPercent}%`, color: '#6366F1' },
                  { label: 'Simulator', value: `${simulatorPct}%`, color: '#8B5CF6' },
                  { label: 'Planner', value: `${plannerReadiness.overallPercent}%`, color: '#0EA5E9' },
                  { label: 'Operations', value: `${opsPct}%`, color: '#10B981' },
                ].map((stat) => (
                  <Grid item xs={6} key={stat.label}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.4}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{stat.label}</Typography>
                        <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem', color: stat.color }}>{stat.value}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={parseInt(stat.value)}
                        sx={{ height: 4, borderRadius: 2, bgcolor: alpha(stat.color, 0.1), '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: stat.color } }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JourneyPage;
