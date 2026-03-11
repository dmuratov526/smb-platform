import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as NeutralIcon,
  Insights as AnalyticsIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { mockAnalyticsMetrics } from '../../mock/dashboard';
import { AnalyticsMetric } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { makeSelectDashboardSummary } from '../dashboard/selectors';

const TrendIcon: React.FC<{ trend: AnalyticsMetric['trend']; change: number }> = ({ trend, change }) => {
  if (trend === 'up')
    return <TrendingUpIcon sx={{ fontSize: 14, color: change >= 0 ? 'success.main' : 'error.main' }} />;
  if (trend === 'down')
    return <TrendingDownIcon sx={{ fontSize: 14, color: change <= 0 ? 'error.main' : 'success.main' }} />;
  return <NeutralIcon sx={{ fontSize: 14, color: 'text.disabled' }} />;
};

const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => {
  const positiveChange = metric.change >= 0;
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          textTransform="uppercase"
          letterSpacing="0.06em"
          display="block"
          sx={{ fontSize: '0.68rem' }}
        >
          {metric.label}
        </Typography>
        <Typography variant="h5" fontWeight={800} mt={0.5} sx={{ fontSize: '1.35rem' }}>
          {metric.unit === '$' ? `$${metric.value.toLocaleString()}` : `${metric.value}${metric.unit}`}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
          <TrendIcon trend={metric.trend} change={metric.change} />
          <Typography
            variant="caption"
            fontWeight={600}
            color={positiveChange ? 'success.main' : 'error.main'}
            sx={{ fontSize: '0.7rem' }}
          >
            {positiveChange ? '+' : ''}{metric.change}% vs prior period
          </Typography>
        </Box>
        <Typography variant="caption" color="text.disabled" display="block" mt={0.25} sx={{ fontSize: '0.65rem' }}>
          {metric.period}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AnalyticsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  const selectSummary = useMemo(
    () => makeSelectDashboardSummary(activeBusinessId ?? ''),
    [activeBusinessId]
  );
  const summary = useAppSelector(selectSummary);

  /* ── No business selected ── */
  if (!activeBusiness) {
    return (
      <Box>
        <PageHeader title="Analytics" description="Track business performance, trends, and key indicators." />
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
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
          >
            <AnalyticsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            No business selected
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={380} mb={3}>
            Analytics will surface performance data once you have an active business with simulation and transaction data.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/home')} sx={{ borderRadius: 2 }}>
            Go to Command Center
          </Button>
        </Box>
      </Box>
    );
  }

  /* ── Build business-specific bar data from simulator if available ── */
  const hasSimData = summary.simulation.hasScenarios;
  const baseMonthlyRev = hasSimData ? summary.simulation.monthlyRevenue : 38500;
  const revTrend = [0.78, 0.86, 0.83, 0.92, 0.94, 1.0].map((f) =>
    Math.round(baseMonthlyRev * f)
  );
  const maxRev = Math.max(...revTrend);

  /* ── Build business-specific insights from summary ── */
  const keyInsights = (() => {
    const items: { label: string; detail: string; color: string }[] = [];
    if (hasSimData) {
      const margin = Math.round(summary.simulation.operatingMargin);
      items.push({
        label: summary.simulation.isViable ? 'Simulation shows profitability' : 'Simulation shows a loss',
        detail: `${margin}% operating margin — ${margin >= 20 ? 'strong' : margin >= 0 ? 'improving' : 'needs attention'}`,
        color: summary.simulation.isViable ? 'success.main' : 'error.main',
      });
    }
    if (summary.builder.completenessPercent >= 80) {
      items.push({ label: 'Business model fully defined', detail: `${summary.builder.filledFields}/${summary.builder.totalFields} fields complete`, color: 'success.main' });
    } else {
      items.push({ label: 'Business model incomplete', detail: `${summary.builder.completenessPercent}% — complete it for accurate analytics`, color: 'warning.main' });
    }
    if (summary.launch.hasPlan) {
      items.push({ label: `Launch readiness: ${summary.launch.overallPercent}%`, detail: `${summary.launch.completedTasks}/${summary.launch.totalTasks} tasks done`, color: summary.launch.overallPercent >= 70 ? 'success.main' : 'primary.main' });
    }
    if (summary.ops.hasData && summary.ops.criticalIssues > 0) {
      items.push({ label: `${summary.ops.criticalIssues} critical operational issues`, detail: 'Requires immediate attention', color: 'error.main' });
    }
    if (items.length < 4) {
      items.push({ label: 'Run simulator for projections', detail: 'Get revenue & cost forecasts', color: 'text.secondary' });
    }
    return items.slice(0, 5);
  })();

  return (
    <Box>
      <PageHeader
        title="Analytics"
        description={`Performance overview for ${activeBusiness.name}.`}
        actions={
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={activeBusiness.name}
              size="small"
              sx={{ bgcolor: activeBusiness.logoColor, color: '#fff', fontWeight: 700, fontSize: '0.72rem' }}
            />
            <Chip label="Last 6 months" variant="outlined" size="small" />
          </Box>
        }
      />

      {!hasSimData && (
        <Alert
          severity="info"
          icon={<AIIcon fontSize="small" />}
          sx={{ mb: 2 }}
          action={
            <Button size="small" onClick={() => navigate('/simulator')} color="inherit">
              Open Simulator
            </Button>
          }
        >
          Run the <strong>Business Simulator</strong> to populate this page with real financial projections for {activeBusiness.name}.
        </Alert>
      )}

      <Grid container spacing={2} mb={2.5}>
        {mockAnalyticsMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.id}>
            <MetricCard metric={metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, minHeight: 260 }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Revenue Trend
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                    {hasSimData ? 'Projected monthly revenue from simulation' : 'Estimated 6-month revenue trajectory'}
                  </Typography>
                </Box>
                {hasSimData && (
                  <Chip
                    icon={<AIIcon sx={{ fontSize: '11px !important' }} />}
                    label="Simulation data"
                    size="small"
                    sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, bgcolor: alpha('#6366F1', 0.08), color: '#6366F1', border: `1px solid ${alpha('#6366F1', 0.2)}`, '& .MuiChip-label': { px: 0.5 }, '& .MuiChip-icon': { ml: 0.5 } }}
                  />
                )}
              </Box>
              <Box height={180} display="flex" alignItems="flex-end" gap={1} px={1} mt={1.5}>
                {revTrend.map((v, i) => (
                  <Box key={i} flex={1} display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                    <Typography variant="caption" color="text.secondary" fontSize="0.63rem">
                      ${(v / 1000).toFixed(0)}k
                    </Typography>
                    <Box
                      width="100%"
                      borderRadius={1}
                      sx={{
                        height: (v / maxRev) * 140,
                        bgcolor: i === 5 ? activeBusiness.logoColor ?? 'primary.main' : alpha(activeBusiness.logoColor ?? theme.palette.primary.main, 0.35),
                        transition: 'height 0.3s',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" fontSize="0.6rem">
                      {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={0.75} mb={1.75}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Key Insights
                </Typography>
                <Chip
                  icon={<AIIcon sx={{ fontSize: '10px !important' }} />}
                  label="AI"
                  size="small"
                  sx={{ height: 16, fontSize: '0.58rem', fontWeight: 700, bgcolor: alpha('#6366F1', 0.08), color: '#6366F1', border: `1px solid ${alpha('#6366F1', 0.2)}`, '& .MuiChip-label': { px: 0.4 }, '& .MuiChip-icon': { ml: 0.4 } }}
                />
              </Box>
              <Box display="flex" flexDirection="column" gap={1.25}>
                {keyInsights.map((insight, idx) => (
                  <Box key={idx} display="flex" gap={1} alignItems="flex-start">
                    <Box
                      width={6}
                      height={6}
                      borderRadius="50%"
                      bgcolor={insight.color}
                      mt={0.55}
                      flexShrink={0}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.78rem' }}>
                        {insight.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                        {insight.detail}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
