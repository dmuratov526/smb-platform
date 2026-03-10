import React, { useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Divider,
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  PersonSearch as AcquisitionIcon,
  AccountBalance as CostsIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  SimulatorAssumptions,
  RevenueAssumptions,
  AcquisitionAssumptions,
  CostAssumptions,
} from '../types';

interface AssumptionsPanelProps {
  assumptions: SimulatorAssumptions;
  onChange: (updated: SimulatorAssumptions) => void;
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  onChange: (value: number) => void;
}

const SliderRow: React.FC<SliderRowProps> = ({
  label,
  value,
  min,
  max,
  step,
  format,
  color = 'primary',
  onChange,
}) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={700} color={`${color}.main`}>
        {format(value)}
      </Typography>
    </Box>
    <Slider
      value={value}
      min={min}
      max={max}
      step={step}
      size="small"
      color={color}
      onChange={(_, v) => onChange(v as number)}
      sx={{ py: 0.75 }}
    />
    <Box display="flex" justifyContent="space-between">
      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
        {format(min)}
      </Typography>
      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
        {format(max)}
      </Typography>
    </Box>
  </Box>
);

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  color: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, color }) => {
  return (
    <Box display="flex" alignItems="center" gap={1} mb={2}>
      <Box
        width={28}
        height={28}
        borderRadius={1}
        bgcolor={alpha(color, 0.1)}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <Box sx={{ color, display: 'flex', fontSize: 16 }}>{icon}</Box>
      </Box>
      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
        {title}
      </Typography>
    </Box>
  );
};

const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({ assumptions, onChange }) => {
  const theme = useTheme();

  const updateRevenue = useCallback(
    <K extends keyof RevenueAssumptions>(key: K, value: RevenueAssumptions[K]) => {
      onChange({ ...assumptions, revenue: { ...assumptions.revenue, [key]: value } });
    },
    [assumptions, onChange]
  );

  const updateAcquisition = useCallback(
    <K extends keyof AcquisitionAssumptions>(key: K, value: AcquisitionAssumptions[K]) => {
      onChange({ ...assumptions, acquisition: { ...assumptions.acquisition, [key]: value } });
    },
    [assumptions, onChange]
  );

  const updateCosts = useCallback(
    <K extends keyof CostAssumptions>(key: K, value: CostAssumptions[K]) => {
      onChange({ ...assumptions, costs: { ...assumptions.costs, [key]: value } });
    },
    [assumptions, onChange]
  );

  const fmt = {
    currency: (v: number) =>
      v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toLocaleString()}`,
    units: (v: number) => v.toLocaleString(),
    percent: (v: number) => `${v}%`,
  };

  const revenueColor = theme.palette.primary.main;
  const acquisitionColor = theme.palette.info.main;
  const costsColor = theme.palette.error.main;

  return (
    <Card
      elevation={0}
      sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
          Assumptions
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2.5}>
          Adjust inputs to model different outcomes. Results update in real time.
        </Typography>

        {/* ── Revenue ─────────────────────────────────────────────── */}
        <SectionHeader
          icon={<RevenueIcon sx={{ fontSize: 16 }} />}
          title="Revenue"
          color={revenueColor}
        />

        <Box display="flex" flexDirection="column" gap={2.5}>
          <SliderRow
            label="Price Per Unit / Transaction"
            value={assumptions.revenue.pricePerUnit}
            min={1}
            max={15000}
            step={assumptions.revenue.pricePerUnit < 100 ? 1 : assumptions.revenue.pricePerUnit < 1000 ? 25 : 100}
            format={fmt.currency}
            color="primary"
            onChange={(v) => updateRevenue('pricePerUnit', v)}
          />
          <SliderRow
            label="Monthly Sales Volume (units)"
            value={assumptions.revenue.monthlySalesVolume}
            min={1}
            max={assumptions.revenue.monthlySalesVolume <= 100 ? 50 : 10000}
            step={assumptions.revenue.monthlySalesVolume <= 100 ? 1 : 50}
            format={fmt.units}
            color="primary"
            onChange={(v) => updateRevenue('monthlySalesVolume', v)}
          />
          <SliderRow
            label="Repeat Purchase Rate"
            value={assumptions.revenue.repeatPurchaseRate}
            min={0}
            max={100}
            step={1}
            format={fmt.percent}
            color="primary"
            onChange={(v) => updateRevenue('repeatPurchaseRate', v)}
          />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Acquisition ─────────────────────────────────────────── */}
        <SectionHeader
          icon={<AcquisitionIcon sx={{ fontSize: 16 }} />}
          title="Acquisition"
          color={acquisitionColor}
        />

        <Box display="flex" flexDirection="column" gap={2.5}>
          <SliderRow
            label="Monthly Leads / Visitors"
            value={assumptions.acquisition.monthlyLeads}
            min={1}
            max={assumptions.acquisition.monthlyLeads <= 100 ? 200 : 20000}
            step={assumptions.acquisition.monthlyLeads <= 100 ? 1 : 50}
            format={fmt.units}
            color="secondary"
            onChange={(v) => updateAcquisition('monthlyLeads', v)}
          />
          <SliderRow
            label="Conversion Rate"
            value={assumptions.acquisition.conversionRate}
            min={1}
            max={100}
            step={1}
            format={fmt.percent}
            color="secondary"
            onChange={(v) => updateAcquisition('conversionRate', v)}
          />
          <SliderRow
            label="Customer Acquisition Cost (CAC)"
            value={assumptions.acquisition.acquisitionCost}
            min={0}
            max={assumptions.acquisition.acquisitionCost <= 100 ? 500 : 10000}
            step={assumptions.acquisition.acquisitionCost <= 100 ? 1 : 50}
            format={fmt.currency}
            color="secondary"
            onChange={(v) => updateAcquisition('acquisitionCost', v)}
          />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* ── Costs ───────────────────────────────────────────────── */}
        <SectionHeader
          icon={<CostsIcon sx={{ fontSize: 16 }} />}
          title="Costs"
          color={costsColor}
        />

        <Box display="flex" flexDirection="column" gap={2.5}>
          <SliderRow
            label="Variable Cost (% of Revenue)"
            value={assumptions.costs.variableCostPercent}
            min={0}
            max={90}
            step={1}
            format={fmt.percent}
            color="error"
            onChange={(v) => updateCosts('variableCostPercent', v)}
          />
          <SliderRow
            label="Monthly Payroll"
            value={assumptions.costs.payroll}
            min={0}
            max={200000}
            step={500}
            format={fmt.currency}
            color="error"
            onChange={(v) => updateCosts('payroll', v)}
          />
          <SliderRow
            label="Fixed Costs (Rent, Utilities)"
            value={assumptions.costs.fixedCosts}
            min={0}
            max={50000}
            step={250}
            format={fmt.currency}
            color="error"
            onChange={(v) => updateCosts('fixedCosts', v)}
          />
          <SliderRow
            label="Marketing Spend"
            value={assumptions.costs.marketingSpend}
            min={0}
            max={50000}
            step={100}
            format={fmt.currency}
            color="error"
            onChange={(v) => updateCosts('marketingSpend', v)}
          />
          <SliderRow
            label="Other Operating Costs"
            value={assumptions.costs.otherOperatingCosts}
            min={0}
            max={30000}
            step={100}
            format={fmt.currency}
            color="error"
            onChange={(v) => updateCosts('otherOperatingCosts', v)}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssumptionsPanel;
