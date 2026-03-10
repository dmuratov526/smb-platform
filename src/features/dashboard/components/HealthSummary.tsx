import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid } from '@mui/material';
import {
  Build as BuilderIcon,
  TrendingUp as SimIcon,
  RocketLaunch as LaunchIcon,
  Settings as OpsIcon,
} from '@mui/icons-material';
import { BuilderHealth, SimulationHealth, LaunchHealth, OpsHealth, HealthStatus } from '../types';

function builderStatus(pct: number): HealthStatus {
  if (pct >= 80) return 'good';
  if (pct >= 50) return 'fair';
  if (pct > 0) return 'poor';
  return 'unknown';
}

function simulationStatus(sim: SimulationHealth): HealthStatus {
  if (!sim.hasScenarios) return 'unknown';
  if (sim.isViable && sim.operatingMargin > 10) return 'good';
  if (sim.isViable) return 'fair';
  return 'poor';
}

function launchStatus(launch: LaunchHealth): HealthStatus {
  if (!launch.hasPlan) return 'unknown';
  if (launch.overallPercent >= 80) return 'good';
  if (launch.overallPercent >= 40) return 'fair';
  return 'poor';
}

function opsStatus(ops: OpsHealth): HealthStatus {
  if (!ops.hasData) return 'unknown';
  if (ops.overallHealth === 'good') return 'good';
  if (ops.overallHealth === 'fair') return 'fair';
  return 'poor';
}

const STATUS_COLORS: Record<HealthStatus, { bar: 'success' | 'warning' | 'error' | 'primary'; chip: string; text: string }> = {
  good: { bar: 'success', chip: 'rgba(5,150,105,0.12)', text: '#059669' },
  fair: { bar: 'warning', chip: 'rgba(217,119,6,0.12)', text: '#D97706' },
  poor: { bar: 'error', chip: 'rgba(220,38,38,0.12)', text: '#DC2626' },
  unknown: { bar: 'primary', chip: 'rgba(107,114,128,0.1)', text: '#6B7280' },
};

const STATUS_LABELS: Record<HealthStatus, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Needs Attention',
  unknown: 'Not Set Up',
};

interface HealthCardProps {
  icon: React.ReactNode;
  label: string;
  status: HealthStatus;
  value: string;
  subtext: string;
  progress?: number;
  iconColor: string;
  iconBg: string;
}

const HealthCard: React.FC<HealthCardProps> = ({
  icon,
  label,
  status,
  value,
  subtext,
  progress,
  iconColor,
  iconBg,
}) => {
  const colors = STATUS_COLORS[status];

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box
            width={34}
            height={34}
            borderRadius={1.5}
            bgcolor={iconBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box sx={{ color: iconColor, display: 'flex', fontSize: 18 }}>{icon}</Box>
          </Box>
          <Box
            px={1}
            py={0.25}
            borderRadius={1}
            bgcolor={colors.chip}
            display="flex"
            alignItems="center"
          >
            <Typography variant="caption" fontWeight={700} color={colors.text} lineHeight={1.4}>
              {STATUS_LABELS[status]}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing="0.06em"
          display="block"
        >
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={700} mt={0.25} lineHeight={1.2}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
          {subtext}
        </Typography>

        {progress !== undefined && (
          <Box mt={1.25}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, progress)}
              color={colors.bar}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

interface HealthSummaryProps {
  builder: BuilderHealth;
  simulation: SimulationHealth;
  launch: LaunchHealth;
  ops: OpsHealth;
}

const HealthSummary: React.FC<HealthSummaryProps> = ({ builder, simulation, launch, ops }) => {
  const bStatus = builderStatus(builder.completenessPercent);
  const sStatus = simulationStatus(simulation);
  const lStatus = launchStatus(launch);
  const oStatus = opsStatus(ops);

  const simValue = simulation.hasScenarios
    ? simulation.isViable
      ? `${simulation.operatingMargin.toFixed(1)}% margin`
      : 'Not profitable'
    : 'Not configured';

  const simSubtext = simulation.hasScenarios
    ? `${simulation.activeScenarioName} — $${simulation.monthlyRevenue.toLocaleString()}/mo revenue`
    : 'Run the Simulator to validate your model';

  const launchValue = launch.hasPlan
    ? `${launch.overallPercent}% ready`
    : 'No plan yet';

  const launchSubtext = launch.hasPlan
    ? `${launch.completedTasks}/${launch.totalTasks} tasks · Phase: ${launch.currentPhaseName}`
    : 'Set up your Launch Planner to track readiness';

  const opsValue = ops.hasData
    ? ops.overallHealth === 'good'
      ? 'Healthy'
      : ops.overallHealth === 'fair'
      ? 'Fair'
      : 'Needs Attention'
    : 'No data';

  const opsSubtext = ops.hasData
    ? `${ops.openIssues} open issue${ops.openIssues !== 1 ? 's' : ''} · ${ops.tasksOverdue} overdue task${ops.tasksOverdue !== 1 ? 's' : ''}`
    : 'Set up Operations to monitor health';

  return (
    <Grid container spacing={2} mb={0}>
      <Grid item xs={12} sm={6} md={3}>
        <HealthCard
          icon={<BuilderIcon fontSize="small" />}
          label="Builder"
          status={bStatus}
          value={`${builder.completenessPercent}% complete`}
          subtext={`${builder.filledFields}/${builder.totalFields} fields filled`}
          progress={builder.completenessPercent}
          iconColor="#7C3AED"
          iconBg="rgba(124,58,237,0.1)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HealthCard
          icon={<SimIcon fontSize="small" />}
          label="Simulation"
          status={sStatus}
          value={simValue}
          subtext={simSubtext}
          progress={simulation.hasScenarios ? (simulation.isViable ? Math.min(100, simulation.operatingMargin * 3) : 10) : 0}
          iconColor="#2563EB"
          iconBg="rgba(37,99,235,0.1)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HealthCard
          icon={<LaunchIcon fontSize="small" />}
          label="Launch Readiness"
          status={lStatus}
          value={launchValue}
          subtext={launchSubtext}
          progress={launch.overallPercent}
          iconColor="#059669"
          iconBg="rgba(5,150,105,0.1)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HealthCard
          icon={<OpsIcon fontSize="small" />}
          label="Operations"
          status={oStatus}
          value={opsValue}
          subtext={opsSubtext}
          iconColor="#D97706"
          iconBg="rgba(217,119,6,0.1)"
        />
      </Grid>
    </Grid>
  );
};

export default HealthSummary;
