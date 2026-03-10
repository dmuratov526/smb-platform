import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import {
  CheckCircleOutline as BaseIcon,
  TrendingUp as BestIcon,
  TrendingDown as WorstIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { SimulatorScenario, ScenarioType, SimulatorResults } from '../types';
import { formatCurrency, formatPercent } from '../calculations';

interface ScenarioSelectorProps {
  scenarios: SimulatorScenario[];
  activeScenarioId: string;
  results: Record<string, SimulatorResults>;
  onSelect: (scenarioId: string) => void;
}

const scenarioMeta: Record<ScenarioType, { icon: React.ReactNode; color: string }> = {
  base: { icon: <BaseIcon sx={{ fontSize: 16 }} />, color: '#1976d2' },
  best: { icon: <BestIcon sx={{ fontSize: 16 }} />, color: '#2e7d32' },
  worst: { icon: <WorstIcon sx={{ fontSize: 16 }} />, color: '#c62828' },
};

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  activeScenarioId,
  results,
  onSelect,
}) => {
  const theme = useTheme();

  return (
    <Box display="flex" gap={1.5} flexWrap="wrap">
      {scenarios.map((scenario) => {
        const isActive = scenario.id === activeScenarioId;
        const meta = scenarioMeta[scenario.type];
        const result = results[scenario.id];
        const isProfitable = result ? result.operatingProfit >= 0 : true;

        return (
          <Box
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            sx={{
              flex: '1 1 180px',
              minWidth: 160,
              p: 2,
              borderRadius: 2,
              border: `1.5px solid`,
              borderColor: isActive ? meta.color : theme.palette.divider,
              bgcolor: isActive ? alpha(meta.color, 0.06) : theme.palette.background.paper,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                borderColor: meta.color,
                bgcolor: alpha(meta.color, 0.04),
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Box display="flex" alignItems="center" gap={0.75}>
                <Box sx={{ color: meta.color, display: 'flex' }}>{meta.icon}</Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: isActive ? meta.color : 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}
                >
                  {scenario.name}
                </Typography>
              </Box>
              {isActive && (
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    bgcolor: alpha(meta.color, 0.12),
                    color: meta.color,
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}
            </Box>

            {result && (
              <>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{
                    color: isProfitable ? 'success.main' : 'error.main',
                    lineHeight: 1.2,
                  }}
                >
                  {isProfitable ? '+' : ''}
                  {formatCurrency(result.operatingProfit)}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
                  {formatPercent(result.operatingMargin)} margin · {formatCurrency(result.monthlyRevenue)} rev
                </Typography>
              </>
            )}

            <Typography
              variant="caption"
              color="text.disabled"
              display="block"
              mt={0.75}
              sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}
            >
              {scenario.description}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ScenarioSelector;
