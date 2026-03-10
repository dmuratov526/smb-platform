import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Divider } from '@mui/material';
import {
  TrendingUp as ProfitableIcon,
  TrendingDown as LossIcon,
} from '@mui/icons-material';
import { SimulationHealth } from '../types';
import { formatCurrency } from '../../businessSimulator/calculations';

interface MetricRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, valueColor = 'text.primary' }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={0.75}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600} color={valueColor}>
      {value}
    </Typography>
  </Box>
);

interface SimulationSnapshotProps {
  simulation: SimulationHealth;
}

const SimulationSnapshot: React.FC<SimulationSnapshotProps> = ({ simulation }) => {
  if (!simulation.hasScenarios) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="body2" color="text.secondary">
            No simulation scenarios configured yet. Run the Business Simulator to project your financial outcomes.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const profitColor = simulation.operatingProfit > 0 ? 'success.main' : 'error.main';
  const marginColor =
    simulation.operatingMargin > 15
      ? 'success.main'
      : simulation.operatingMargin > 0
      ? 'warning.main'
      : 'error.main';

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing="0.06em"
              display="block"
            >
              Active Scenario
            </Typography>
            <Typography variant="subtitle2" fontWeight={700}>
              {simulation.activeScenarioName}
            </Typography>
          </Box>
          <Chip
            icon={
              simulation.isViable ? (
                <ProfitableIcon sx={{ fontSize: '14px !important' }} />
              ) : (
                <LossIcon sx={{ fontSize: '14px !important' }} />
              )
            }
            label={simulation.isViable ? 'Viable' : 'Not Profitable'}
            size="small"
            color={simulation.isViable ? 'success' : 'error'}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
        </Box>

        <Divider sx={{ mb: 1 }} />

        <MetricRow
          label="Projected Monthly Revenue"
          value={formatCurrency(simulation.monthlyRevenue)}
        />
        <MetricRow
          label="Projected Monthly Costs"
          value={formatCurrency(simulation.monthlyExpenses)}
        />
        <Divider sx={{ my: 0.5 }} />
        <MetricRow
          label="Operating Profit"
          value={formatCurrency(simulation.operatingProfit)}
          valueColor={profitColor}
        />
        <MetricRow
          label="Operating Margin"
          value={`${simulation.operatingMargin.toFixed(1)}%`}
          valueColor={marginColor}
        />
        <MetricRow
          label="Break-even Revenue"
          value={formatCurrency(simulation.breakEvenRevenue)}
        />
      </CardContent>
    </Card>
  );
};

export default SimulationSnapshot;
