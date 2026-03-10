import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Slider,
  Chip,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Save as SaveIcon,
  CompareArrows as CompareIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockSimulationScenarios } from '../../mock/simulation';
import { SimulationInputs, SimulationOutputs } from '../../types';

function computeOutputs(inputs: SimulationInputs): SimulationOutputs {
  const baseRevenue = inputs.pricePerUnit * inputs.expectedDemand;
  const projectedRevenue = baseRevenue * inputs.revenueMultiplier;
  const baseCosts = inputs.rentCost + inputs.staffingCost + inputs.marketingBudget;
  const variableCosts = projectedRevenue * 0.23;
  const projectedExpenses = (baseCosts + variableCosts) * inputs.costMultiplier;
  const projectedProfit = projectedRevenue - projectedExpenses;
  const profitMargin = projectedRevenue > 0 ? (projectedProfit / projectedRevenue) * 100 : 0;
  const fixedCosts = (inputs.rentCost + inputs.staffingCost) * inputs.costMultiplier;
  const contributionMarginRate = projectedRevenue > 0 ? (projectedRevenue - variableCosts * inputs.costMultiplier) / projectedRevenue : 1;
  const breakEvenPoint = contributionMarginRate > 0 ? fixedCosts / contributionMarginRate : 0;
  const monthlyBurn = projectedExpenses;
  const cashRunway = projectedProfit > 0 ? 24 : Math.max(1, Math.round(80000 / monthlyBurn));
  const capitalRequired = projectedProfit < 0 ? Math.abs(projectedProfit) * 6 : 0;

  return {
    projectedRevenue: Math.round(projectedRevenue),
    projectedExpenses: Math.round(projectedExpenses),
    projectedProfit: Math.round(projectedProfit),
    profitMargin: Math.round(profitMargin * 10) / 10,
    breakEvenPoint: Math.round(breakEvenPoint),
    cashRunway,
    capitalRequired: Math.round(capitalRequired),
  };
}

interface OutputCardProps {
  label: string;
  value: string;
  subValue?: string;
  positive?: boolean;
  neutral?: boolean;
  tooltip?: string;
}

const OutputCard: React.FC<OutputCardProps> = ({ label, value, subValue, positive, neutral, tooltip }) => {
  const color = neutral ? 'text.primary' : positive ? 'success.main' : 'error.main';
  return (
    <Box
      p={1.5}
      borderRadius={1.5}
      bgcolor="grey.50"
      border="1px solid"
      borderColor="divider"
      position="relative"
    >
      <Box display="flex" alignItems="center" gap={0.5} mb={0.25}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em" fontSize="0.65rem">
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} placement="top">
            <InfoIcon sx={{ fontSize: 12, color: 'text.disabled', cursor: 'help' }} />
          </Tooltip>
        )}
      </Box>
      <Typography variant="h6" fontWeight={700} color={color} lineHeight={1.2}>
        {value}
      </Typography>
      {subValue && (
        <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
          {subValue}
        </Typography>
      )}
    </Box>
  );
};

const SimulatorPage: React.FC = () => {
  const theme = useTheme();
  const { activeBusinessId } = useAppSelector((s) => s.business);
  const scenarios = mockSimulationScenarios.filter((s) => s.businessId === activeBusinessId);
  const baseScenario = scenarios[0];

  const [selectedScenarioId, setSelectedScenarioId] = useState(baseScenario?.id ?? '');
  const [inputs, setInputs] = useState<SimulationInputs>(
    baseScenario?.inputs ?? {
      revenueMultiplier: 1.0,
      costMultiplier: 1.0,
      marketingBudget: 1200,
      staffingCost: 14000,
      pricePerUnit: 6.5,
      expectedDemand: 3800,
      rentCost: 8500,
    }
  );

  const outputs = computeOutputs(inputs);
  const baseOutputs = baseScenario?.outputs;

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const scenario = scenarios.find((s) => s.id === id);
    if (scenario) setInputs(scenario.inputs);
  };

  const handleInput = useCallback(
    <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const revenueVsBase = baseOutputs
    ? Math.round(((outputs.projectedRevenue - baseOutputs.projectedRevenue) / baseOutputs.projectedRevenue) * 100)
    : 0;
  const profitVsBase = baseOutputs
    ? Math.round(((outputs.projectedProfit - baseOutputs.projectedProfit) / Math.abs(baseOutputs.projectedProfit)) * 100)
    : 0;

  return (
    <Box>
      <PageHeader
        title="Business Simulator"
        description="Adjust assumptions and instantly see how changes affect your business outcomes."
        actions={
          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined" startIcon={<CompareIcon />}>
              Compare
            </Button>
            <Button size="small" variant="outlined" startIcon={<SaveIcon />}>
              Save Scenario
            </Button>
            <Button size="small" variant="contained" startIcon={<RunIcon />} color="primary">
              Run Scenario
            </Button>
          </Box>
        }
      />

      {/* Scenario selector */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          boxShadow: 'none',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Scenario</InputLabel>
              <Select
                value={selectedScenarioId}
                label="Scenario"
                onChange={(e) => handleScenarioChange(e.target.value)}
              >
                {scenarios.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {scenarios.find((s) => s.id === selectedScenarioId)?.description && (
              <Typography variant="body2" color="text.secondary" flex={1}>
                {scenarios.find((s) => s.id === selectedScenarioId)?.description}
              </Typography>
            )}
            <Box display="flex" gap={1}>
              {scenarios.map((s) => (
                <Chip
                  key={s.id}
                  label={s.name}
                  size="small"
                  variant={selectedScenarioId === s.id ? 'filled' : 'outlined'}
                  color={selectedScenarioId === s.id ? 'primary' : 'default'}
                  onClick={() => handleScenarioChange(s.id)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {/* Left: Inputs */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                Assumptions
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2.5}>
                Adjust the sliders to model different scenarios. Results update in real time.
              </Typography>

              <Box display="flex" flexDirection="column" gap={3}>
                {/* Revenue Multiplier */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>Revenue Multiplier</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {inputs.revenueMultiplier.toFixed(2)}×
                    </Typography>
                  </Box>
                  <Slider
                    value={inputs.revenueMultiplier}
                    onChange={(_, v) => handleInput('revenueMultiplier', v as number)}
                    min={0.5} max={2.0} step={0.05}
                    marks={[{ value: 1, label: 'Base' }]}
                    size="small"
                    color="primary"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Scale all revenue streams proportionally
                  </Typography>
                </Box>

                <Divider />

                {/* Price Per Unit */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>Avg Price Per Unit</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      ${inputs.pricePerUnit.toFixed(2)}
                    </Typography>
                  </Box>
                  <Slider
                    value={inputs.pricePerUnit}
                    onChange={(_, v) => handleInput('pricePerUnit', v as number)}
                    min={3} max={20} step={0.25}
                    marks={[{ value: 6.5, label: '$6.50' }]}
                    size="small"
                  />
                </Box>

                {/* Expected Demand */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>Monthly Demand (units)</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {inputs.expectedDemand.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={inputs.expectedDemand}
                    onChange={(_, v) => handleInput('expectedDemand', v as number)}
                    min={1000} max={8000} step={100}
                    marks={[{ value: 3800, label: '3,800' }]}
                    size="small"
                  />
                </Box>

                <Divider />

                {/* Rent */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>Monthly Rent</Typography>
                    <Typography variant="body2" fontWeight={700} color="error.main">
                      ${inputs.rentCost.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={inputs.rentCost}
                    onChange={(_, v) => handleInput('rentCost', v as number)}
                    min={2000} max={20000} step={250}
                    marks={[{ value: 8500, label: '$8.5k' }]}
                    size="small"
                    color="secondary"
                  />
                </Box>

                {/* Staffing Cost */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>Monthly Payroll</Typography>
                    <Typography variant="body2" fontWeight={700} color="error.main">
                      ${inputs.staffingCost.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={inputs.staffingCost}
                    onChange={(_, v) => handleInput('staffingCost', v as number)}
                    min={5000} max={40000} step={500}
                    marks={[{ value: 14000, label: '$14k' }]}
                    size="small"
                    color="secondary"
                  />
                </Box>

                {/* Marketing Budget */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>Monthly Marketing Budget</Typography>
                    <Typography variant="body2" fontWeight={700} color="error.main">
                      ${inputs.marketingBudget.toLocaleString()}
                    </Typography>
                  </Box>
                  <Slider
                    value={inputs.marketingBudget}
                    onChange={(_, v) => handleInput('marketingBudget', v as number)}
                    min={0} max={10000} step={100}
                    marks={[{ value: 1200, label: '$1.2k' }]}
                    size="small"
                    color="secondary"
                  />
                </Box>

                <Divider />

                {/* Cost Multiplier */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={500}>Cost Multiplier</Typography>
                    <Typography variant="body2" fontWeight={700} color="error.main">
                      {inputs.costMultiplier.toFixed(2)}×
                    </Typography>
                  </Box>
                  <Slider
                    value={inputs.costMultiplier}
                    onChange={(_, v) => handleInput('costMultiplier', v as number)}
                    min={0.5} max={2.0} step={0.05}
                    marks={[{ value: 1, label: 'Base' }]}
                    size="small"
                    color="secondary"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Scale variable costs proportionally
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Outputs */}
        <Grid item xs={12} lg={7}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            {/* vs Base comparison banner */}
            {baseOutputs && selectedScenarioId !== baseScenario?.id && (
              <Alert
                severity={revenueVsBase >= 0 ? 'success' : 'warning'}
                icon={revenueVsBase >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              >
                Compared to base case: Revenue {revenueVsBase >= 0 ? '+' : ''}{revenueVsBase}%, Profit {profitVsBase >= 0 ? '+' : ''}{profitVsBase}%
              </Alert>
            )}

            {/* Primary output cards */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  Simulation Results
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={4}>
                    <OutputCard
                      label="Projected Revenue"
                      value={`$${outputs.projectedRevenue.toLocaleString()}`}
                      subValue="per month"
                      neutral
                      tooltip="Total monthly revenue based on price × demand × multiplier"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <OutputCard
                      label="Total Expenses"
                      value={`$${outputs.projectedExpenses.toLocaleString()}`}
                      subValue="per month"
                      positive={false}
                      neutral
                      tooltip="Fixed costs + variable costs × cost multiplier"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <OutputCard
                      label="Net Profit"
                      value={`${outputs.projectedProfit >= 0 ? '+' : ''}$${outputs.projectedProfit.toLocaleString()}`}
                      subValue="per month"
                      positive={outputs.projectedProfit >= 0}
                      neutral={false}
                      tooltip="Revenue minus total expenses"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <OutputCard
                      label="Profit Margin"
                      value={`${outputs.profitMargin.toFixed(1)}%`}
                      positive={outputs.profitMargin >= 10}
                      neutral={outputs.profitMargin >= 0 && outputs.profitMargin < 10}
                      tooltip="Net profit as a percentage of revenue"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <OutputCard
                      label="Break-Even"
                      value={`$${outputs.breakEvenPoint.toLocaleString()}`}
                      subValue="monthly revenue needed"
                      neutral
                      tooltip="Minimum revenue required to cover all fixed costs"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <OutputCard
                      label="Cash Runway"
                      value={`${outputs.cashRunway} mo`}
                      subValue={outputs.cashRunway >= 12 ? 'Healthy' : outputs.cashRunway >= 6 ? 'Monitor' : 'Critical'}
                      positive={outputs.cashRunway >= 6}
                      tooltip="Estimated months of operations covered by current cash"
                    />
                  </Grid>
                </Grid>

                {outputs.capitalRequired > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    This scenario requires approximately{' '}
                    <strong>${outputs.capitalRequired.toLocaleString()}</strong> additional capital to sustain 6 months of operations.
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Profit margin health bar */}
            <Card>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Business Health Indicators
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {[
                    {
                      label: 'Profit Margin',
                      value: Math.max(0, outputs.profitMargin),
                      max: 35,
                      target: 20,
                      format: (v: number) => `${v.toFixed(1)}%`,
                      color: outputs.profitMargin >= 15 ? 'success' : outputs.profitMargin >= 5 ? 'warning' : 'error',
                    },
                    {
                      label: 'Revenue vs Break-Even',
                      value: outputs.breakEvenPoint > 0 ? Math.min(150, (outputs.projectedRevenue / outputs.breakEvenPoint) * 100) : 100,
                      max: 150,
                      target: 100,
                      format: (v: number) => `${v.toFixed(0)}%`,
                      color: outputs.projectedRevenue >= outputs.breakEvenPoint ? 'success' : 'error',
                    },
                    {
                      label: 'Cash Runway',
                      value: Math.min(24, outputs.cashRunway),
                      max: 24,
                      target: 12,
                      format: (v: number) => `${Math.round(v)} months`,
                      color: outputs.cashRunway >= 12 ? 'success' : outputs.cashRunway >= 6 ? 'warning' : 'error',
                    },
                  ].map((indicator) => (
                    <Box key={indicator.label}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          {indicator.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color={`${indicator.color}.main`}>
                          {indicator.format(indicator.value)}
                        </Typography>
                      </Box>
                      <Box position="relative">
                        <LinearProgress
                          variant="determinate"
                          value={(indicator.value / indicator.max) * 100}
                          color={indicator.color as 'success' | 'warning' | 'error'}
                          sx={{ height: 8 }}
                        />
                        <Box
                          position="absolute"
                          top={-2}
                          left={`${(indicator.target / indicator.max) * 100}%`}
                          width={2}
                          height={12}
                          bgcolor="text.secondary"
                          sx={{ transform: 'translateX(-50%)' }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.disabled">
                        Target: {indicator.format(indicator.target)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Scenario comparison */}
            {scenarios.length > 1 && (
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} mb={2}>
                    Scenario Comparison
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <Box display="flex" gap={1.5} minWidth={480}>
                      {scenarios.map((s) => {
                        const out = computeOutputs(s.inputs);
                        const isSelected = s.id === selectedScenarioId;
                        return (
                          <Box
                            key={s.id}
                            flex={1}
                            p={1.5}
                            borderRadius={1.5}
                            border="1px solid"
                            borderColor={isSelected ? 'primary.main' : 'divider'}
                            bgcolor={isSelected ? alpha(theme.palette.primary.main, 0.04) : 'grey.50'}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleScenarioChange(s.id)}
                          >
                            <Typography variant="caption" fontWeight={700} color={isSelected ? 'primary.main' : 'text.secondary'} display="block" mb={0.75}>
                              {s.name}
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color={out.projectedProfit >= 0 ? 'success.main' : 'error.main'}>
                              {out.projectedProfit >= 0 ? '+' : ''}${out.projectedProfit.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {out.profitMargin.toFixed(1)}% margin
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              ${out.projectedRevenue.toLocaleString()} rev
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulatorPage;
