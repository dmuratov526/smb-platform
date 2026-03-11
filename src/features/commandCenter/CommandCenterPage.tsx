import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  Chip,
  Button,
  TextField,
  InputAdornment,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Send as SendIcon,
  WarningAmber as RiskIcon,
  LightbulbOutlined as ActionIcon,
  TrendingUp as GrowthIcon,
  RocketLaunch as LaunchIcon,
  BusinessCenter as BuilderIcon,
  BarChart as SimulatorIcon,
  SettingsOutlined as OpsIcon,
  AccountBalanceOutlined as FinanceNavIcon,
  ShowChartOutlined as FinanceIcon,
  ArrowForward as ArrowIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppSelector } from '../../app/hooks';
import { makeSelectDashboardSummary } from '../dashboard/selectors';
import { DashboardSummaryData } from '../dashboard/types';
import { Business } from '../../types';
import {
  CommandInsight,
  CommandInsightItem,
  AIResponseState,
  InsightSeverity,
} from './types';

/* ─── Constants ─── */

const PROMPT_CHIPS = [
  { label: 'Build my business model', prompt: 'Help me build my business model' },
  { label: 'Test a pricing scenario', prompt: 'Help me test a pricing scenario and margins' },
  { label: 'Create a launch plan', prompt: 'Create a launch plan for my business' },
  { label: 'Analyze cost structure', prompt: 'Analyze my cost structure and expenses' },
  { label: 'Identify key risks', prompt: 'Show key risks in my business' },
];

const WORKSPACES = [
  { label: 'Business Builder', path: '/builder', icon: <BuilderIcon sx={{ fontSize: 15 }} />, color: '#6366F1', desc: 'Design your model' },
  { label: 'Simulator', path: '/simulator', icon: <SimulatorIcon sx={{ fontSize: 15 }} />, color: '#8B5CF6', desc: 'Test assumptions' },
  { label: 'Launch Planner', path: '/planner', icon: <LaunchIcon sx={{ fontSize: 15 }} />, color: '#0EA5E9', desc: 'Plan your launch' },
  { label: 'Finance', path: '/finance', icon: <FinanceNavIcon sx={{ fontSize: 15 }} />, color: '#10B981', desc: 'Track finances' },
  { label: 'Operations', path: '/operations', icon: <OpsIcon sx={{ fontSize: 15 }} />, color: '#F59E0B', desc: 'Manage daily ops' },
];

/* ─── Insight generation ─── */

function generateInsights(
  summary: DashboardSummaryData,
  business: Business | undefined
): CommandInsight[] {
  const { builder, simulation, launch, ops } = summary;
  const insights: CommandInsight[] = [];

  // Key Risks
  const riskItems: CommandInsightItem[] = [];
  if (builder.completenessPercent < 60) {
    riskItems.push({ text: `Business model only ${builder.completenessPercent}% complete`, severity: 'high' });
  }
  if (!simulation.hasScenarios) {
    riskItems.push({ text: 'No financial simulation configured', severity: 'high' });
  } else if (!simulation.isViable) {
    riskItems.push({
      text: `Simulation shows monthly loss: $${Math.abs(simulation.operatingProfit).toLocaleString()}`,
      severity: 'critical',
    });
  }
  if (ops.hasData && ops.criticalIssues > 0) {
    riskItems.push({
      text: `${ops.criticalIssues} critical operational issue${ops.criticalIssues > 1 ? 's' : ''}`,
      severity: 'critical',
    });
  }
  if (ops.hasData && ops.tasksOverdue > 0) {
    riskItems.push({
      text: `${ops.tasksOverdue} recurring task${ops.tasksOverdue > 1 ? 's' : ''} overdue`,
      severity: 'medium',
    });
  }
  if (launch.hasPlan && launch.blockedTasks > 0) {
    riskItems.push({ text: `${launch.blockedTasks} launch task${launch.blockedTasks > 1 ? 's' : ''} blocked`, severity: 'high' });
  }
  if (riskItems.length === 0) {
    riskItems.push({ text: 'No critical risks detected', severity: 'positive' });
    riskItems.push({ text: 'Business model well-defined', severity: 'positive' });
    riskItems.push({ text: 'Financial assumptions validated', severity: 'positive' });
  }

  const riskHighCount = riskItems.filter((i) => i.severity === 'critical' || i.severity === 'high').length;
  insights.push({
    id: 'key-risks',
    type: 'risk',
    title: 'Key Risks',
    subtitle: riskHighCount > 0 ? `${riskHighCount} high-priority issue${riskHighCount > 1 ? 's' : ''}` : 'No critical risks',
    items: riskItems.slice(0, 5),
    actionLabel: 'View Dashboard',
    actionPath: '/dashboard',
    accentColor: riskItems.some((i) => i.severity === 'critical') ? '#EF4444'
      : riskItems.some((i) => i.severity === 'high') ? '#F59E0B'
      : '#10B981',
    isAITagged: true,
  });

  // Recommended Actions
  const rec = summary.recommendedAction;
  const actionItems: CommandInsightItem[] = [];
  actionItems.push({ text: rec.title, meta: 'Top priority', severity: 'positive' });
  if (builder.completenessPercent < 100) {
    const incomplete = builder.sections.filter((s) => !s.complete);
    if (incomplete.length > 0) {
      actionItems.push({ text: `Complete "${incomplete[0].label}" in Business Builder`, meta: `${incomplete.length} section${incomplete.length > 1 ? 's' : ''} left` });
    }
  }
  if (!simulation.hasScenarios) {
    actionItems.push({ text: 'Run Business Simulator to validate finances', meta: 'Required for launch' });
  } else if (simulation.isViable && simulation.operatingMargin < 20) {
    actionItems.push({ text: `Improve ${Math.round(simulation.operatingMargin)}% margin — test pricing scenarios`, meta: 'Growth opportunity' });
  }
  if (launch.hasPlan && launch.overallPercent < 80) {
    actionItems.push({ text: `Advance launch readiness past ${launch.overallPercent}%`, meta: launch.currentPhaseName || 'Current phase' });
  }

  insights.push({
    id: 'recommended-actions',
    type: 'action',
    title: 'Recommended Actions',
    subtitle: 'AI-prioritized next steps',
    items: actionItems.slice(0, 4),
    actionLabel: rec.ctaLabel,
    actionPath: rec.path,
    accentColor: '#6366F1',
    isAITagged: true,
  });

  // Financial Snapshot
  const finItems: CommandInsightItem[] = [];
  if (simulation.hasScenarios) {
    finItems.push({ text: `Monthly revenue`, meta: `$${simulation.monthlyRevenue.toLocaleString()}`, severity: 'neutral' });
    finItems.push({ text: `Monthly expenses`, meta: `$${simulation.monthlyExpenses.toLocaleString()}`, severity: 'neutral' });
    finItems.push({
      text: `Operating profit`,
      meta: `${simulation.operatingProfit >= 0 ? '+' : ''}$${simulation.operatingProfit.toLocaleString()} (${Math.round(simulation.operatingMargin)}%)`,
      severity: simulation.operatingProfit >= 0 ? 'positive' : 'critical',
    });
    finItems.push({ text: `Break-even revenue`, meta: `$${simulation.breakEvenRevenue.toLocaleString()}/mo`, severity: 'neutral' });
  } else {
    finItems.push({ text: 'No simulation data available', severity: 'medium' });
    finItems.push({ text: 'Run the Simulator to see projections', meta: 'Required step' });
    if (business) {
      finItems.push({ text: `Industry: ${business.industry}`, meta: business.category });
    }
  }

  insights.push({
    id: 'financial-snapshot',
    type: 'financial',
    title: 'Financial Snapshot',
    subtitle: simulation.hasScenarios ? simulation.activeScenarioName : 'No scenario active',
    items: finItems,
    actionLabel: 'Open Simulator',
    actionPath: '/simulator',
    accentColor: '#10B981',
    isAITagged: true,
  });

  // Growth Opportunities
  const growthItems: CommandInsightItem[] = [];
  if (simulation.hasScenarios && simulation.isViable) {
    if (simulation.operatingMargin < 20) {
      growthItems.push({ text: 'Raise pricing 10–15% to improve margins', meta: 'High-impact lever' });
    }
    growthItems.push({ text: 'Test aggressive scenario in Simulator', meta: 'Revenue modeling' });
  } else if (!simulation.hasScenarios) {
    growthItems.push({ text: 'Validate pricing model with simulation first', meta: 'Foundation step' });
  }
  if (builder.completenessPercent >= 70) {
    growthItems.push({ text: 'Explore additional revenue streams', meta: 'Diversification' });
  }
  growthItems.push({ text: 'Build a launch marketing strategy', meta: 'Customer acquisition' });
  if (launch.overallPercent >= 60) {
    growthItems.push({ text: 'Set up scalable operational processes', meta: 'Post-launch readiness' });
  }

  insights.push({
    id: 'growth-opportunities',
    type: 'opportunity',
    title: 'Growth Opportunities',
    subtitle: 'AI-identified potential',
    items: growthItems.slice(0, 4),
    actionLabel: 'Open Simulator',
    actionPath: '/simulator',
    accentColor: '#8B5CF6',
    isAITagged: true,
  });

  // Launch Readiness (full-width)
  const launchItems: CommandInsightItem[] = [];
  if (launch.hasPlan) {
    launchItems.push({
      text: `${launch.overallPercent}% launch-ready`,
      meta: 'Overall progress',
      severity: launch.overallPercent >= 80 ? 'positive' : launch.overallPercent >= 50 ? 'medium' : 'high',
    });
    launchItems.push({ text: `${launch.completedTasks} of ${launch.totalTasks} tasks completed`, meta: launch.currentPhaseName });
    if (launch.blockedTasks > 0) {
      launchItems.push({ text: `${launch.blockedTasks} task${launch.blockedTasks > 1 ? 's' : ''} blocked`, severity: 'high' });
    }
    if (launch.remainingTasks > 0) {
      launchItems.push({ text: `${launch.remainingTasks} task${launch.remainingTasks > 1 ? 's' : ''} remaining`, meta: `Phase: ${launch.currentPhaseName}` });
    }
  } else {
    launchItems.push({ text: 'No launch plan created yet', severity: 'medium' });
    launchItems.push({ text: `Complete Business Builder first (${builder.completenessPercent}% done)`, meta: 'Prerequisite' });
    launchItems.push({ text: 'Validate assumptions with Simulator', meta: 'Recommended sequence' });
  }

  insights.push({
    id: 'launch-status',
    type: 'launch',
    title: 'Launch Readiness',
    subtitle: launch.hasPlan ? (launch.currentPhaseName || 'Planning Phase') : 'Not started',
    items: launchItems,
    actionLabel: 'Open Launch Planner',
    actionPath: '/planner',
    accentColor: '#0EA5E9',
    span: 2,
    isAITagged: true,
  });

  return insights;
}

/* ─── Prompt matching ─── */

function matchPromptResponse(
  prompt: string,
  summary: DashboardSummaryData
): Omit<AIResponseState, 'status' | 'prompt'> {
  const p = prompt.toLowerCase();

  if (/build|model|describe.*business|offer|revenue stream/.test(p)) {
    return {
      responseText: `I can help you build your business model. It's currently ${summary.builder.completenessPercent}% complete. Let's continue defining your offer, customers, and revenue model.`,
      routeLabel: 'Open Business Builder',
      routePath: '/builder',
      focusInsightType: 'action',
    };
  }
  if (/pric|simul|scenario|margin|profit|break.?even|hire|employ/.test(p)) {
    const sim = summary.simulation;
    return {
      responseText: sim.hasScenarios
        ? `Your current scenario shows ${sim.isViable ? 'a viable' : 'an unprofitable'} projection — $${sim.monthlyRevenue.toLocaleString()}/mo revenue at ${Math.round(sim.operatingMargin)}% margin. Let's run more scenarios.`
        : "You haven't run any simulations yet. The Simulator will help you validate your financial assumptions before investing.",
      routeLabel: 'Open Simulator',
      routePath: '/simulator',
      focusInsightType: 'financial',
    };
  }
  if (/launch|plan|ready|go.?live|roadmap|milestone/.test(p)) {
    return {
      responseText: summary.launch.hasPlan
        ? `You're ${summary.launch.overallPercent}% launch-ready with ${summary.launch.completedTasks} tasks complete. Let's advance your plan to go-live.`
        : "You don't have a launch plan yet. Once your business model is ready, the Planner will convert it into an actionable roadmap.",
      routeLabel: 'Open Launch Planner',
      routePath: '/planner',
      focusInsightType: 'launch',
    };
  }
  if (/cost|expense|budget|cash|finance|revenue|money/.test(p)) {
    return {
      responseText: summary.simulation.hasScenarios
        ? `Your projected monthly expenses are $${summary.simulation.monthlyExpenses.toLocaleString()} against $${summary.simulation.monthlyRevenue.toLocaleString()} in revenue. Let's dig into the details.`
        : 'Run a simulation first to get accurate financial projections and a full cost breakdown.',
      routeLabel: 'View Finance',
      routePath: '/finance',
      focusInsightType: 'financial',
    };
  }
  if (/risk|problem|issue|danger|warning|weak/.test(p)) {
    const riskCount = summary.priorityItems.filter(
      (i) => i.severity === 'high' || i.severity === 'critical'
    ).length;
    return {
      responseText: riskCount > 0
        ? `I found ${riskCount} high-priority issue${riskCount > 1 ? 's' : ''} in your business that need attention.`
        : 'No critical risks detected right now. Your business is in good standing across the main dimensions.',
      focusInsightType: 'risk',
    };
  }
  if (/grow|scale|opportunit|expand|increase|improve/.test(p)) {
    return {
      responseText: "Let me surface growth opportunities for your business based on your current model, simulation data, and operational health.",
      routeLabel: 'Open Simulator',
      routePath: '/simulator',
      focusInsightType: 'opportunity',
    };
  }
  if (/operat|team|staff|process|day.to.day/.test(p)) {
    return {
      responseText: summary.ops.hasData
        ? `Your operations workspace has ${summary.ops.openIssues} open issues and ${summary.ops.tasksOverdue} overdue tasks. Let's review.`
        : "Your operations workspace is ready to configure. Set it up after your launch plan is in place.",
      routeLabel: 'Open Operations',
      routePath: '/operations',
      focusInsightType: 'ops',
    };
  }

  return {
    responseText: "Here's a full overview of your business — model health, financial projections, launch readiness, and operational status.",
    focusInsightType: 'action',
  };
}

/* ─── Severity helpers ─── */

const SEVERITY_COLORS: Record<InsightSeverity, string> = {
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#94A3B8',
  positive: '#10B981',
  neutral: '#64748B',
};

const INSIGHT_ICON: Record<string, React.ReactNode> = {
  risk: <RiskIcon sx={{ fontSize: 15 }} />,
  action: <ActionIcon sx={{ fontSize: 15 }} />,
  financial: <FinanceIcon sx={{ fontSize: 15 }} />,
  opportunity: <GrowthIcon sx={{ fontSize: 15 }} />,
  launch: <LaunchIcon sx={{ fontSize: 15 }} />,
  ops: <OpsIcon sx={{ fontSize: 15 }} />,
};

/* ─── InsightCard sub-component ─── */

interface InsightCardProps {
  insight: CommandInsight;
  highlighted: boolean;
  onAction: (path: string) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, highlighted, onAction }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: highlighted
          ? `1.5px solid ${alpha(insight.accentColor, 0.6)}`
          : `1px solid ${theme.palette.divider}`,
        borderLeft: `3px solid ${insight.accentColor}`,
        borderRadius: 2,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        boxShadow: highlighted
          ? `0 0 0 3px ${alpha(insight.accentColor, 0.1)}, 0 4px 20px ${alpha(insight.accentColor, 0.08)}`
          : 'none',
      }}
    >
      {/* Header */}
      <Box
        px={2}
        pt={1.75}
        pb={1.25}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom={`1px solid ${theme.palette.divider}`}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            width={26}
            height={26}
            borderRadius={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: alpha(insight.accentColor, 0.1), color: insight.accentColor }}
          >
            {INSIGHT_ICON[insight.type]}
          </Box>
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.8rem', lineHeight: 1.2, display: 'block' }}>
              {insight.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1 }}>
              {insight.subtitle}
            </Typography>
          </Box>
        </Box>
        {insight.isAITagged && (
          <Chip
            label="AI"
            size="small"
            icon={<AIIcon sx={{ fontSize: '10px !important' }} />}
            sx={{
              height: 18,
              fontSize: '0.58rem',
              fontWeight: 700,
              bgcolor: alpha('#6366F1', 0.1),
              color: '#6366F1',
              border: `1px solid ${alpha('#6366F1', 0.2)}`,
              '& .MuiChip-label': { px: 0.5 },
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
        )}
      </Box>

      {/* Items */}
      <Box px={2} pt={1.25} pb={1} flex={1}>
        {insight.type === 'launch' && insight.items[0]?.meta === 'Overall progress' ? (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.75rem', color: insight.accentColor }}>
                {insight.items[0].text}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                {insight.items.find((i) => i.text.includes('of') && i.text.includes('tasks'))?.text}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={parseInt(insight.items[0].text) || 0}
              sx={{
                height: 4,
                borderRadius: 2,
                mb: 1.25,
                bgcolor: alpha(insight.accentColor, 0.1),
                '& .MuiLinearProgress-bar': { bgcolor: insight.accentColor, borderRadius: 2 },
              }}
            />
            {insight.items.slice(1).map((item, i) => (
              <Box key={i} display="flex" alignItems="flex-start" gap={0.75} mb={0.6}>
                <Box
                  width={5}
                  height={5}
                  borderRadius="50%"
                  flexShrink={0}
                  mt={0.55}
                  sx={{
                    bgcolor: item.severity
                      ? SEVERITY_COLORS[item.severity]
                      : alpha(insight.accentColor, 0.5),
                  }}
                />
                <Box flex={1}>
                  <Typography variant="caption" color="text.primary" sx={{ fontSize: '0.75rem', lineHeight: 1.35 }}>
                    {item.text}
                  </Typography>
                  {item.meta && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem' }}>
                      {item.meta}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : insight.type === 'financial' ? (
          <Box>
            {insight.items.map((item, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={0.6}
                sx={{ borderBottom: i < insight.items.length - 1 ? `1px solid ${theme.palette.divider}` : 'none' }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.74rem' }}>
                  {item.text}
                </Typography>
                {item.meta ? (
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      fontSize: '0.78rem',
                      color: item.severity === 'positive' ? '#10B981'
                        : item.severity === 'critical' ? '#EF4444'
                        : 'text.primary',
                    }}
                  >
                    {item.meta}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                    —
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Box>
            {insight.items.map((item, i) => (
              <Box key={i} display="flex" alignItems="flex-start" gap={0.75} mb={0.7}>
                <Box
                  width={5}
                  height={5}
                  borderRadius="50%"
                  flexShrink={0}
                  mt={0.6}
                  sx={{
                    bgcolor: item.severity
                      ? SEVERITY_COLORS[item.severity]
                      : alpha(insight.accentColor, 0.5),
                  }}
                />
                <Box flex={1} minWidth={0}>
                  <Typography variant="caption" color="text.primary" sx={{ fontSize: '0.75rem', lineHeight: 1.35 }}>
                    {item.text}
                  </Typography>
                  {item.meta && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem', mt: 0.1 }}>
                      {item.meta}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer action */}
      {insight.actionLabel && insight.actionPath && (
        <Box px={2} pb={1.5} pt={0.5}>
          <Button
            size="small"
            variant="text"
            endIcon={<ArrowIcon sx={{ fontSize: 12 }} />}
            onClick={() => onAction(insight.actionPath!)}
            sx={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: insight.accentColor,
              px: 0,
              minWidth: 0,
              '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
            }}
          >
            {insight.actionLabel}
          </Button>
        </Box>
      )}
    </Card>
  );
};

/* ─── Business Snapshot Panel ─── */

interface BusinessSnapshotProps {
  summary: DashboardSummaryData;
  business: Business | undefined;
}

const BusinessSnapshotPanel: React.FC<BusinessSnapshotProps> = ({ summary, business }) => {
  const theme = useTheme();
  const { builder, simulation, launch, ops } = summary;

  const overallScore = Math.round(
    builder.completenessPercent * 0.3 +
    (simulation.hasScenarios ? (simulation.isViable ? 80 : 40) : 0) * 0.25 +
    launch.overallPercent * 0.25 +
    (ops.hasData ? (ops.overallHealth === 'good' ? 90 : ops.overallHealth === 'fair' ? 60 : 30) : 50) * 0.2
  );

  const scoreColor =
    overallScore >= 70 ? '#10B981' : overallScore >= 45 ? '#F59E0B' : '#EF4444';

  const healthBars = [
    { label: 'Business Model', value: builder.completenessPercent, color: '#6366F1' },
    {
      label: 'Financial Sim',
      value: simulation.hasScenarios ? (simulation.isViable ? 80 : 40) : 0,
      color: '#8B5CF6',
    },
    { label: 'Launch Readiness', value: launch.overallPercent, color: '#0EA5E9' },
    {
      label: 'Operations',
      value: ops.hasData
        ? ops.overallHealth === 'good' ? 90 : ops.overallHealth === 'fair' ? 60 : 30
        : 0,
      color: '#10B981',
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      {/* Business identity strip */}
      <Box
        px={2}
        py={1.5}
        sx={{
          background: `linear-gradient(135deg, ${alpha(business?.logoColor ?? '#6366F1', 0.1)}, ${alpha(business?.logoColor ?? '#6366F1', 0.04)})`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.85rem', display: 'block', lineHeight: 1.3 }}>
              {business?.name ?? 'No business selected'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
              {business?.category ?? '—'} · {business?.stage ?? '—'}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={48}
            height={48}
            borderRadius="50%"
            flexShrink={0}
            sx={{
              background: `conic-gradient(${scoreColor} ${overallScore * 3.6}deg, ${alpha(scoreColor, 0.1)} 0deg)`,
            }}
          >
            <Box
              width={36}
              height={36}
              borderRadius="50%"
              bgcolor="background.paper"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography fontWeight={900} sx={{ fontSize: '0.75rem', color: scoreColor, lineHeight: 1 }}>
                {overallScore}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Health bars */}
      <Box px={2} py={1.5}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.25 }}>
          Health Overview
        </Typography>
        {healthBars.map((bar) => (
          <Box key={bar.label} mb={0.9}>
            <Box display="flex" justifyContent="space-between" mb={0.3}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.69rem' }}>
                {bar.label}
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.69rem', color: bar.color }}>
                {bar.value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={bar.value}
              sx={{
                height: 3,
                borderRadius: 2,
                bgcolor: alpha(bar.color, 0.1),
                '& .MuiLinearProgress-bar': { bgcolor: bar.color, borderRadius: 2 },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Top recommendation */}
      <Box
        px={2}
        py={1.25}
        sx={{
          bgcolor: alpha('#6366F1', 0.04),
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.67rem', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 0.4 }}>
          AI Recommendation
        </Typography>
        <Typography variant="caption" color="text.primary" sx={{ fontSize: '0.73rem', lineHeight: 1.4, display: 'block' }}>
          {summary.recommendedAction.title}
        </Typography>
      </Box>
    </Card>
  );
};

/* ─── Workspace Launcher Grid ─── */

interface WorkspaceLaunchersProps {
  summary: DashboardSummaryData;
}

const WorkspaceLaunchers: React.FC<WorkspaceLaunchersProps> = ({ summary }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getCompleteness = (path: string) => {
    switch (path) {
      case '/builder': return summary.builder.completenessPercent;
      case '/simulator': return summary.simulation.hasScenarios ? (summary.simulation.isViable ? 75 : 45) : 0;
      case '/planner': return summary.launch.overallPercent;
      case '/finance': return 60;
      case '/operations': return summary.ops.hasData ? 70 : 0;
      default: return 0;
    }
  };

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
      <Box px={2} py={1.25} borderBottom={`1px solid ${theme.palette.divider}`}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Workspaces
        </Typography>
      </Box>
      <Box p={1.25}>
        <Grid container spacing={1}>
          {WORKSPACES.map((ws) => {
            const pct = getCompleteness(ws.path);
            return (
              <Grid item xs={6} key={ws.path}>
                <Box
                  onClick={() => navigate(ws.path)}
                  sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': {
                      borderColor: alpha(ws.color, 0.4),
                      bgcolor: alpha(ws.color, 0.04),
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.75} mb={0.6}>
                    <Box
                      width={22}
                      height={22}
                      borderRadius={0.75}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{ bgcolor: alpha(ws.color, 0.12), color: ws.color }}
                    >
                      {ws.icon}
                    </Box>
                    <Typography variant="caption" fontWeight={600} color="text.primary" noWrap sx={{ fontSize: '0.72rem', flex: 1 }}>
                      {ws.label}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 2.5,
                      borderRadius: 1,
                      bgcolor: alpha(ws.color, 0.1),
                      '& .MuiLinearProgress-bar': { bgcolor: ws.color, borderRadius: 1 },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', mt: 0.35, display: 'block' }}>
                    {pct}%
                  </Typography>
                </Box>
              </Grid>
            );
          })}
          {/* 5th item spans full width */}
          <Grid item xs={12}>
            <Box
              onClick={() => navigate('/journey')}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                border: `1px solid ${alpha('#6366F1', 0.3)}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${alpha('#6366F1', 0.06)}, ${alpha('#8B5CF6', 0.04)})`,
                transition: 'all 0.15s',
                '&:hover': { borderColor: '#6366F1', bgcolor: alpha('#6366F1', 0.08) },
              }}
            >
              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem', color: '#6366F1' }}>
                Business Journey
              </Typography>
              <ArrowIcon sx={{ fontSize: 12, color: '#6366F1' }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

/* ─── New User Welcome ─── */

const NEW_USER_STEPS = [
  { icon: <BuilderIcon sx={{ fontSize: 18 }} />, color: '#6366F1', label: 'Design your business', desc: 'Define offer, revenue, costs & team in the Business Builder.' },
  { icon: <SimulatorIcon sx={{ fontSize: 18 }} />, color: '#8B5CF6', label: 'Simulate & validate', desc: 'Test financial assumptions and find your break-even point.' },
  { icon: <LaunchIcon sx={{ fontSize: 18 }} />, color: '#0EA5E9', label: 'Plan your launch', desc: 'Turn your model into a phased launch roadmap.' },
  { icon: <FinanceNavIcon sx={{ fontSize: 18 }} />, color: '#10B981', label: 'Track & grow', desc: 'Monitor finances, operations, and key business metrics.' },
];

const NewUserWelcome: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      {/* Hero */}
      <Box
        mb={3}
        borderRadius={2.5}
        p={3}
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1a1f35 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: '25%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box width={32} height={32} borderRadius={2} display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            <AIIcon sx={{ fontSize: 17, color: '#fff' }} />
          </Box>
          <Typography variant="caption" fontWeight={700} sx={{ color: '#A5B4FC', fontSize: '0.75rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            AI Business Command Center
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight={800} sx={{ color: '#F1F5F9', lineHeight: 1.25, mb: 0.75, letterSpacing: '-0.02em' }}>
          Welcome. Let's build your business.
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 520, lineHeight: 1.6, mb: 2.5 }}>
          Start by creating your first business. The AI Command Center will then help you design, simulate, launch, and operate it — all from one place.
        </Typography>

        <Box display="flex" gap={1.5} flexWrap="wrap">
          <Button
            variant="contained"
            size="medium"
            onClick={() => navigate('/onboarding')}
            sx={{
              bgcolor: '#6366F1',
              '&:hover': { bgcolor: '#4F46E5' },
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '0.85rem',
              px: 2.5,
            }}
          >
            Create your first business
          </Button>
          <Button
            variant="outlined"
            size="medium"
            endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate('/journey')}
            sx={{
              borderColor: alpha('#6366F1', 0.5),
              color: '#A5B4FC',
              '&:hover': { borderColor: '#6366F1', bgcolor: alpha('#6366F1', 0.08) },
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            View Business Journey
          </Button>
        </Box>
      </Box>

      {/* How it works */}
      <Box mb={2}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>
          How it works
        </Typography>
        <Grid container spacing={1.5}>
          {NEW_USER_STEPS.map((step, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box
                p={2}
                borderRadius={2}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  height: '100%',
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Box
                    width={32}
                    height={32}
                    borderRadius={1.5}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ bgcolor: alpha(step.color, 0.1), color: step.color }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                    Step {i + 1}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.82rem', mb: 0.4, color: 'text.primary' }}>
                  {step.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.45 }}>
                  {step.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* AI capabilities preview */}
      <Box
        p={2}
        borderRadius={2}
        sx={{
          bgcolor: alpha('#6366F1', 0.04),
          border: `1px solid ${alpha('#6366F1', 0.15)}`,
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1.25}>
          <AIIcon sx={{ fontSize: 15, color: '#6366F1' }} />
          <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem', color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Once you create a business, AI will help you
          </Typography>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={0.75}>
          {[
            'Analyze your cost structure',
            'Find break-even point',
            'Identify business risks',
            'Build a launch roadmap',
            'Simulate pricing scenarios',
            'Track operational health',
          ].map((cap) => (
            <Chip
              key={cap}
              label={cap}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.71rem',
                fontWeight: 500,
                bgcolor: alpha('#6366F1', 0.08),
                color: '#6366F1',
                border: `1px solid ${alpha('#6366F1', 0.2)}`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ─── Main Page ─── */

const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();

  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  const selectSummary = useMemo(
    () => makeSelectDashboardSummary(activeBusinessId ?? ''),
    [activeBusinessId]
  );
  const summary = useAppSelector(selectSummary);

  const [inputValue, setInputValue] = useState('');
  const [aiState, setAIState] = useState<AIResponseState>({ status: 'idle' });
  const inputRef = useRef<HTMLInputElement>(null);

  const insights = useMemo(
    () => generateInsights(summary, activeBusiness),
    [summary, activeBusiness]
  );

  const triggerAI = useCallback((prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setAIState({ status: 'thinking', prompt: trimmed });
    setInputValue('');
    setTimeout(() => {
      const response = matchPromptResponse(trimmed, summary);
      setAIState({ status: 'complete', prompt: trimmed, ...response });
    }, 850);
  }, [summary]);

  const handleSubmit = useCallback(() => {
    triggerAI(inputValue);
  }, [inputValue, triggerAI]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isThinking = aiState.status === 'thinking';

  const handleChip = useCallback((prompt: string) => {
    if (!isThinking) triggerAI(prompt);
  }, [isThinking, triggerAI]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  /* ── No business: show welcome/onboarding screen ── */
  if (!activeBusiness) {
    return <NewUserWelcome />;
  }

  return (
    <Box>
      {/* ══ AI Hero Input ══ */}
      <Box
        mb={2.5}
        borderRadius={2.5}
        p={2.5}
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1a1f35 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: '30%', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Header label */}
        <Box display="flex" alignItems="center" gap={1} mb={1.75}>
          <Box
            width={28}
            height={28}
            borderRadius={1.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <AIIcon sx={{ fontSize: 15, color: '#fff' }} />
          </Box>
          <Typography variant="caption" fontWeight={700} sx={{ color: '#A5B4FC', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            AI Business Command Center
          </Typography>
          {activeBusiness && (
            <Chip
              label={activeBusiness.name}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.62rem',
                fontWeight: 700,
                bgcolor: alpha(activeBusiness.logoColor ?? '#6366F1', 0.25),
                color: activeBusiness.logoColor ?? '#A5B4FC',
                border: `1px solid ${alpha(activeBusiness.logoColor ?? '#6366F1', 0.4)}`,
                '& .MuiChip-label': { px: 0.75 },
                ml: 'auto',
              }}
            />
          )}
        </Box>

        {/* Prompt input */}
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="Ask anything — 'Help me improve margins', 'Create a launch plan', 'Show my financial risks'..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
          multiline
          maxRows={3}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isThinking ? (
                  <Box display="flex" alignItems="center" gap={0.75} px={0.5}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#A5B4FC', animation: 'pulse 1s infinite' }} />
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#A5B4FC', animation: 'pulse 1s infinite 0.2s' }} />
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#A5B4FC', animation: 'pulse 1s infinite 0.4s' }} />
                  </Box>
                ) : (
                  <IconButton
                    size="small"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    sx={{
                      bgcolor: inputValue.trim() ? '#6366F1' : alpha('#6366F1', 0.3),
                      color: '#fff',
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      '&:hover': { bgcolor: '#4F46E5' },
                      '&.Mui-disabled': { bgcolor: alpha('#6366F1', 0.2), color: alpha('#fff', 0.3) },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                )}
              </InputAdornment>
            ),
            sx: {
              bgcolor: alpha('#fff', 0.05),
              color: '#F1F5F9',
              borderRadius: 2,
              fontSize: '0.9rem',
              '& input, & textarea': { color: '#F1F5F9', '&::placeholder': { color: alpha('#94A3B8', 0.7) } },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha('#fff', 0.12),
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha('#6366F1', 0.5),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366F1',
                borderWidth: 1,
              },
            },
          }}
          sx={{ mb: 1.5 }}
        />

        {/* Prompt chips */}
        <Box display="flex" flexWrap="wrap" gap={0.75}>
          {PROMPT_CHIPS.map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              size="small"
              onClick={() => !isThinking && handleChip(chip.prompt)}
              sx={{
                height: 26,
                fontSize: '0.72rem',
                fontWeight: 500,
                bgcolor: alpha('#fff', 0.07),
                color: '#CBD5E1',
                border: `1px solid ${alpha('#fff', 0.12)}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { bgcolor: alpha('#6366F1', 0.3), borderColor: alpha('#6366F1', 0.5), color: '#A5B4FC' },
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ))}
        </Box>

        {/* AI Response Banner */}
        {aiState.status === 'complete' && aiState.responseText && (
          <Box
            mt={1.75}
            px={1.75}
            py={1.25}
            borderRadius={1.5}
            sx={{
              bgcolor: alpha('#6366F1', 0.15),
              border: `1px solid ${alpha('#6366F1', 0.3)}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
            }}
          >
            <AIIcon sx={{ fontSize: 16, color: '#A5B4FC', flexShrink: 0, mt: 0.1 }} />
            <Box flex={1}>
              <Typography variant="caption" sx={{ fontSize: '0.78rem', color: '#E2E8F0', lineHeight: 1.5, display: 'block' }}>
                {aiState.responseText}
              </Typography>
              {aiState.routeLabel && aiState.routePath && (
                <Button
                  size="small"
                  variant="contained"
                  endIcon={<ArrowIcon sx={{ fontSize: 12 }} />}
                  onClick={() => navigate(aiState.routePath!)}
                  sx={{
                    mt: 0.75,
                    height: 26,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    bgcolor: '#6366F1',
                    '&:hover': { bgcolor: '#4F46E5' },
                    borderRadius: 1.5,
                    px: 1.25,
                  }}
                >
                  {aiState.routeLabel}
                </Button>
              )}
            </Box>
            <IconButton
              size="small"
              onClick={() => setAIState({ status: 'idle' })}
              sx={{ p: 0.25, color: alpha('#94A3B8', 0.6), '&:hover': { color: '#94A3B8' } }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* ══ Main Content Grid ══ */}
      <Grid container spacing={2} alignItems="flex-start">
        {/* Left / Main: Insight Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={1.75}>
            {insights
              .filter((ins) => ins.span !== 2)
              .map((insight) => (
                <Grid item xs={12} sm={6} key={insight.id}>
                  <InsightCard
                    insight={insight}
                    highlighted={aiState.status === 'complete' && aiState.focusInsightType === insight.type}
                    onAction={handleNavigate}
                  />
                </Grid>
              ))}

            {/* Full-width launch card */}
            {insights
              .filter((ins) => ins.span === 2)
              .map((insight) => (
                <Grid item xs={12} key={insight.id}>
                  <InsightCard
                    insight={insight}
                    highlighted={aiState.status === 'complete' && aiState.focusInsightType === insight.type}
                    onAction={handleNavigate}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>

        {/* Right: Snapshot + Workspaces */}
        <Grid item xs={12} md={4}>
          <BusinessSnapshotPanel summary={summary} business={activeBusiness} />
          <WorkspaceLaunchers summary={summary} />
        </Grid>
      </Grid>

      {/* Pulse animation for thinking state */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </Box>
  );
};

export default CommandCenterPage;
