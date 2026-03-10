import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

export type MetricCardVariant = 'positive' | 'negative' | 'neutral' | 'warning';

interface MetricCardProps {
  label: string;
  value: string;
  subLabel?: string;
  delta?: number;
  variant?: MetricCardVariant;
  tooltip?: string;
  compact?: boolean;
}

function resolveVariant(delta?: number): MetricCardVariant {
  if (delta === undefined) return 'neutral';
  if (delta > 0) return 'positive';
  if (delta < 0) return 'negative';
  return 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subLabel,
  delta,
  variant,
  tooltip,
  compact = false,
}) => {
  const theme = useTheme();
  const resolvedVariant = variant ?? resolveVariant(delta);

  const colorMap: Record<MetricCardVariant, string> = {
    positive: theme.palette.success.main,
    negative: theme.palette.error.main,
    neutral: theme.palette.text.primary,
    warning: theme.palette.warning.main,
  };

  const bgMap: Record<MetricCardVariant, string> = {
    positive: alpha(theme.palette.success.main, 0.06),
    negative: alpha(theme.palette.error.main, 0.06),
    neutral: theme.palette.grey[50],
    warning: alpha(theme.palette.warning.main, 0.06),
  };

  const valueColor = colorMap[resolvedVariant];
  const bgColor = bgMap[resolvedVariant];

  const DeltaIcon =
    delta === undefined || delta === 0
      ? TrendingFlatIcon
      : delta > 0
      ? TrendingUpIcon
      : TrendingDownIcon;

  const deltaColor =
    delta === undefined || delta === 0
      ? theme.palette.text.secondary
      : delta > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  return (
    <Box
      sx={{
        p: compact ? 1.5 : 2,
        borderRadius: 2,
        bgcolor: bgColor,
        border: `1px solid ${alpha(valueColor, 0.15)}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={0.5}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing="0.06em"
          sx={{ fontSize: '0.63rem' }}
          noWrap
        >
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} placement="top" arrow>
            <InfoIcon sx={{ fontSize: 12, color: 'text.disabled', cursor: 'help', flexShrink: 0 }} />
          </Tooltip>
        )}
      </Box>

      <Typography
        variant={compact ? 'subtitle1' : 'h6'}
        fontWeight={700}
        color={valueColor}
        lineHeight={1.2}
      >
        {value}
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
        {subLabel && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {subLabel}
          </Typography>
        )}
        {delta !== undefined && (
          <Box
            display="flex"
            alignItems="center"
            gap={0.25}
            sx={{ ml: 'auto', flexShrink: 0 }}
          >
            <DeltaIcon sx={{ fontSize: 12, color: deltaColor }} />
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ fontSize: '0.68rem', color: deltaColor }}
            >
              {delta > 0 ? '+' : ''}
              {delta}%
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MetricCard;
