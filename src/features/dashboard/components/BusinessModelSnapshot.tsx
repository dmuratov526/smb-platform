import React from 'react';
import { Box, Card, CardContent, Typography, Chip, LinearProgress } from '@mui/material';
import { CheckCircle as CheckIcon, RadioButtonUnchecked as EmptyIcon } from '@mui/icons-material';
import { BusinessModel } from '../../businessModel/types';
import { BuilderHealth } from '../types';

interface ModelSectionRowProps {
  label: string;
  value: string;
  complete: boolean;
}

const ModelSectionRow: React.FC<ModelSectionRowProps> = ({ label, value, complete }) => (
  <Box display="flex" gap={1.5} py={1} borderBottom="1px solid" borderColor="divider">
    <Box mt={0.2} flexShrink={0}>
      {complete ? (
        <CheckIcon sx={{ fontSize: 14, color: 'success.main' }} />
      ) : (
        <EmptyIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
      )}
    </Box>
    <Box minWidth={0} flex={1}>
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
      <Typography
        variant="body2"
        color={complete ? 'text.primary' : 'text.disabled'}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.5,
          mt: 0.25,
        }}
      >
        {complete ? value : 'Not yet configured'}
      </Typography>
    </Box>
  </Box>
);

interface BusinessModelSnapshotProps {
  model: BusinessModel | null;
  health: BuilderHealth;
}

const BusinessModelSnapshot: React.FC<BusinessModelSnapshotProps> = ({ model, health }) => {
  if (!model) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography variant="body2" color="text.secondary">
            No business model configured yet. Complete the Business Builder to see your model snapshot.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const progressColor =
    health.completenessPercent >= 80
      ? 'success'
      : health.completenessPercent >= 50
      ? 'warning'
      : 'error';

  const rows: ModelSectionRowProps[] = [
    {
      label: 'Offer',
      value: model.offer.valueProposition || model.offer.productName,
      complete: health.sections.find((s) => s.key === 'offer')?.complete ?? false,
    },
    {
      label: 'Target Customer',
      value: model.customer.targetSegment,
      complete: health.sections.find((s) => s.key === 'customer')?.complete ?? false,
    },
    {
      label: 'Revenue Model',
      value: `${model.revenue.pricingModel}${model.revenue.averageTransactionValue ? ` · Avg. $${model.revenue.averageTransactionValue}` : ''}`,
      complete: health.sections.find((s) => s.key === 'revenue')?.complete ?? false,
    },
    {
      label: 'Acquisition',
      value: model.acquisition.marketingChannels,
      complete: health.sections.find((s) => s.key === 'acquisition')?.complete ?? false,
    },
    {
      label: 'Operations',
      value: model.operations.teamStructure,
      complete: health.sections.find((s) => s.key === 'operations')?.complete ?? false,
    },
    {
      label: 'Financial Snapshot',
      value:
        model.financials.expectedMonthlyRevenue && model.financials.expectedMonthlyCosts
          ? `$${model.financials.expectedMonthlyRevenue.toLocaleString()}/mo revenue · $${model.financials.expectedMonthlyCosts.toLocaleString()}/mo costs${model.financials.marginEstimate ? ` · ${model.financials.marginEstimate}% margin` : ''}`
          : model.financials.breakEvenEstimate,
      complete: health.sections.find((s) => s.key === 'financials')?.complete ?? false,
    },
  ];

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box flex={1} mr={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">
                Model completeness
              </Typography>
              <Typography variant="caption" fontWeight={700} color={`${progressColor}.main`}>
                {health.completenessPercent}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={health.completenessPercent}
              color={progressColor as 'success' | 'warning' | 'error'}
              sx={{ height: 5, borderRadius: 2 }}
            />
          </Box>
          <Chip
            label={`${health.filledFields}/${health.totalFields} fields`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.68rem', height: 20, flexShrink: 0 }}
          />
        </Box>

        <Box>
          {rows.map((row) => (
            <ModelSectionRow
              key={row.label}
              {...row}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BusinessModelSnapshot;
