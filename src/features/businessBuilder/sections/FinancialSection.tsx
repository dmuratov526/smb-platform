import React, { useState } from 'react';
import { AccountBalanceOutlined as FinancialIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppDispatch } from '../../../app/hooks';
import { updateSection } from '../../businessModel/slice';
import { FinancialSnapshot } from '../../businessModel/types';
import BuilderSection from '../components/BuilderSection';
import FieldRow from '../components/FieldRow';

interface FinancialSectionProps {
  businessId: string;
  data: FinancialSnapshot;
}

function computeCompleteness(d: FinancialSnapshot): number {
  const fields = [
    d.expectedMonthlyRevenue !== null ? String(d.expectedMonthlyRevenue) : '',
    d.expectedMonthlyCosts !== null ? String(d.expectedMonthlyCosts) : '',
    d.breakEvenEstimate,
    d.marginEstimate !== null ? String(d.marginEstimate) : '',
  ];
  const filled = fields.filter((f) => f.trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ businessId, data }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<FinancialSnapshot>(data);

  const handleEdit = () => {
    setDraft(data);
    setEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSection({ businessId, section: 'financials', data: draft }));
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const updateField = (field: keyof FinancialSnapshot) => (value: string) =>
    setDraft((prev) => ({
      ...prev,
      [field]:
        field === 'breakEvenEstimate'
          ? value
          : value === ''
          ? null
          : Number(value),
    }));

  const display = editing ? draft : data;

  const netProfit =
    data.expectedMonthlyRevenue !== null && data.expectedMonthlyCosts !== null
      ? data.expectedMonthlyRevenue - data.expectedMonthlyCosts
      : null;

  return (
    <BuilderSection
      title="Financial Snapshot"
      subtitle="High-level financial picture"
      icon={<FinancialIcon fontSize="small" />}
      iconColor="#DC2626"
      isEditing={editing}
      completeness={computeCompleteness(data)}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      {!editing && netProfit !== null && (
        <Box
          display="flex"
          gap={1.5}
          mb={2}
          p={1.5}
          borderRadius={1.5}
          bgcolor={
            netProfit >= 0
              ? alpha(theme.palette.success.main, 0.07)
              : alpha(theme.palette.error.main, 0.07)
          }
          border={`1px solid ${
            netProfit >= 0
              ? alpha(theme.palette.success.main, 0.2)
              : alpha(theme.palette.error.main, 0.2)
          }`}
        >
          <Box flex={1} textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block">
              Monthly Revenue
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="success.main">
              ${data.expectedMonthlyRevenue?.toLocaleString()}
            </Typography>
          </Box>
          <Box flex={1} textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block">
              Monthly Costs
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="error.main">
              ${data.expectedMonthlyCosts?.toLocaleString()}
            </Typography>
          </Box>
          <Box flex={1} textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block">
              Est. Net Profit
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={netProfit >= 0 ? 'success.main' : 'error.main'}
            >
              {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      )}

      <FieldRow
        label="Expected Monthly Revenue"
        value={display.expectedMonthlyRevenue}
        editing={editing}
        onChange={updateField('expectedMonthlyRevenue')}
        placeholder="0"
        type="number"
        prefix="$"
        hint={editing ? 'Estimated total monthly revenue across all streams' : undefined}
      />
      <FieldRow
        label="Expected Monthly Costs"
        value={display.expectedMonthlyCosts}
        editing={editing}
        onChange={updateField('expectedMonthlyCosts')}
        placeholder="0"
        type="number"
        prefix="$"
        hint={editing ? 'All operating costs including payroll, rent, COGS' : undefined}
      />
      <FieldRow
        label="Break-Even Estimate"
        value={display.breakEvenEstimate}
        editing={editing}
        onChange={updateField('breakEvenEstimate')}
        placeholder="e.g. 150 transactions/month, 8 clients"
      />
      <FieldRow
        label="Margin Estimate"
        value={display.marginEstimate}
        editing={editing}
        onChange={updateField('marginEstimate')}
        placeholder="0"
        type="number"
        suffix="%"
        hint={editing ? 'Net profit margin as a percentage of revenue' : undefined}
      />
    </BuilderSection>
  );
};

export default FinancialSection;
