import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  WarningAmberOutlined as WarningIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { SimulatorResults } from '../types';
import { formatCurrency, formatPercent, getDelta } from '../calculations';
import MetricCard from './MetricCard';

interface ResultsPanelProps {
  results: SimulatorResults;
  baseResults: SimulatorResults | null;
  isBaseScenario: boolean;
}

interface HealthIndicator {
  label: string;
  value: number;
  max: number;
  target: number;
  format: (v: number) => string;
  color: 'success' | 'warning' | 'error';
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, baseResults, isBaseScenario }) => {
  const theme = useTheme();

  const revDelta = baseResults && !isBaseScenario
    ? getDelta(results.monthlyRevenue, baseResults.monthlyRevenue)
    : undefined;
  const profitDelta = baseResults && !isBaseScenario
    ? getDelta(results.operatingProfit, baseResults.operatingProfit)
    : undefined;
  const grossMarginDelta = baseResults && !isBaseScenario
    ? getDelta(results.grossMargin, baseResults.grossMargin)
    : undefined;
  const opMarginDelta = baseResults && !isBaseScenario
    ? getDelta(results.operatingMargin, baseResults.operatingMargin)
    : undefined;

  const profitVariant =
    results.operatingProfit > 0
      ? 'positive'
      : results.operatingProfit === 0
      ? 'neutral'
      : 'negative';

  const grossMarginVariant =
    results.grossMargin >= 40
      ? 'positive'
      : results.grossMargin >= 20
      ? 'neutral'
      : 'negative';

  const opMarginVariant =
    results.operatingMargin >= 15
      ? 'positive'
      : results.operatingMargin >= 0
      ? 'warning'
      : 'negative';

  const healthIndicators: HealthIndicator[] = [
    {
      label: 'Gross Margin',
      value: Math.max(0, results.grossMargin),
      max: 80,
      target: 40,
      format: (v) => formatPercent(v),
      color:
        results.grossMargin >= 40
          ? 'success'
          : results.grossMargin >= 20
          ? 'warning'
          : 'error',
    },
    {
      label: 'Operating Margin',
      value: Math.max(0, results.operatingMargin),
      max: 50,
      target: 15,
      format: (v) => formatPercent(v),
      color:
        results.operatingMargin >= 15
          ? 'success'
          : results.operatingMargin >= 5
          ? 'warning'
          : 'error',
    },
    {
      label: 'Revenue vs Break-Even',
      value: results.breakEvenRevenue > 0
        ? Math.min(200, (results.monthlyRevenue / results.breakEvenRevenue) * 100)
        : 100,
      max: 200,
      target: 100,
      format: (v) => formatPercent(v, 0),
      color: results.monthlyRevenue >= results.breakEvenRevenue ? 'success' : 'error',
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={2.5}>
      {/* vs base comparison banner */}
      {!isBaseScenario && baseResults && (
        <Alert
          severity={
            results.operatingProfit >= baseResults.operatingProfit ? 'success' : 'warning'
          }
          icon={
            results.operatingProfit < baseResults.operatingProfit ? (
              <WarningIcon fontSize="small" />
            ) : undefined
          }
          sx={{ py: 0.75 }}
        >
          vs Base Case — Revenue{' '}
          <strong>
            {revDelta !== undefined && revDelta >= 0 ? '+' : ''}
            {revDelta}%
          </strong>
          , Operating Profit{' '}
          <strong>
            {profitDelta !== undefined && profitDelta >= 0 ? '+' : ''}
            {profitDelta}%
          </strong>
        </Alert>
      )}

      {/* Primary metrics */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Simulation Results
          </Typography>

          <Grid container spacing={1.5}>
            <Grid item xs={6} sm={4}>
              <MetricCard
                label="Monthly Revenue"
                value={formatCurrency(results.monthlyRevenue)}
                subLabel="per month"
                delta={revDelta}
                variant="neutral"
                tooltip="Price × Sales Volume"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                label="Variable Costs"
                value={formatCurrency(results.variableCosts)}
                subLabel={`${results.variableCosts > 0 && results.monthlyRevenue > 0 ? formatPercent((results.variableCosts / results.monthlyRevenue) * 100, 0) : '0%'} of revenue`}
                variant="neutral"
                tooltip="Revenue × Variable Cost %"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                label="Gross Profit"
                value={formatCurrency(results.grossProfit)}
                subLabel={formatPercent(results.grossMargin) + ' margin'}
                delta={grossMarginDelta}
                variant={grossMarginVariant}
                tooltip="Revenue minus variable costs"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                label="Fixed Costs"
                value={formatCurrency(results.totalFixedCosts)}
                subLabel="payroll + rent + other"
                variant="neutral"
                tooltip="Payroll + Fixed + Marketing + Other"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                label="Operating Profit"
                value={`${results.operatingProfit >= 0 ? '+' : ''}${formatCurrency(results.operatingProfit)}`}
                subLabel={formatPercent(results.operatingMargin) + ' margin'}
                delta={profitDelta}
                variant={profitVariant}
                tooltip="Gross profit minus all fixed costs"
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <MetricCard
                label="Break-Even Revenue"
                value={formatCurrency(results.breakEvenRevenue)}
                subLabel={`≈ ${results.breakEvenUnits.toLocaleString()} units`}
                variant={results.monthlyRevenue >= results.breakEvenRevenue ? 'positive' : 'negative'}
                tooltip="Minimum monthly revenue to cover all costs"
              />
            </Grid>
          </Grid>

          {results.operatingProfit < 0 && (
            <Alert
              severity="error"
              icon={<WarningIcon fontSize="small" />}
              sx={{ mt: 2, py: 0.75 }}
            >
              This scenario is unprofitable by{' '}
              <strong>{formatCurrency(Math.abs(results.operatingProfit))}/month</strong>. Revenue
              needs to reach <strong>{formatCurrency(results.breakEvenRevenue)}</strong> to break
              even.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Margin & health indicators */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle2" fontWeight={700}>
              Business Health Indicators
            </Typography>
            <Box display="flex" gap={1.5}>
              <MetricCard
                label="Gross Margin"
                value={formatPercent(results.grossMargin)}
                delta={grossMarginDelta}
                variant={grossMarginVariant}
                compact
              />
              <MetricCard
                label="Op. Margin"
                value={formatPercent(results.operatingMargin)}
                delta={opMarginDelta}
                variant={opMarginVariant}
                compact
              />
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={2.5}>
            {healthIndicators.map((indicator) => (
              <Box key={indicator.label}>
                <Box display="flex" justifyContent="space-between" mb={0.75}>
                  <Typography variant="body2" fontWeight={500}>
                    {indicator.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color={`${indicator.color}.main`}
                  >
                    {indicator.format(indicator.value)}
                  </Typography>
                </Box>
                <Box position="relative">
                  <LinearProgress
                    variant="determinate"
                    value={(indicator.value / indicator.max) * 100}
                    color={indicator.color}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                  <Box
                    position="absolute"
                    top={-3}
                    left={`${(indicator.target / indicator.max) * 100}%`}
                    width={2}
                    height={14}
                    bgcolor="text.secondary"
                    sx={{ transform: 'translateX(-50%)', borderRadius: 0.5 }}
                  />
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                  Target: {indicator.format(indicator.target)}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Acquisition metrics */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={2}>
            Customer Economics
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item xs={6}>
              <MetricCard
                label="New Customers / Month"
                value={results.monthlyNewCustomers.toLocaleString()}
                subLabel="leads × conversion rate"
                variant="neutral"
                tooltip="Monthly Leads × Conversion Rate"
              />
            </Grid>
            <Grid item xs={6}>
              <MetricCard
                label="Customer Acquisition Cost"
                value={formatCurrency(results.monthlyRevenue > 0 && results.monthlyNewCustomers > 0
                  ? Math.round(results.monthlyRevenue / results.monthlyNewCustomers)
                  : 0)}
                subLabel="revenue per new customer"
                variant="neutral"
                tooltip="Monthly Revenue ÷ Monthly New Customers"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResultsPanel;
