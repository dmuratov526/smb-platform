import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import {
  CheckCircleOutline as HealthyIcon,
  WarningAmberOutlined as AtRiskIcon,
  ErrorOutline as CriticalIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { OperationalArea, AreaStatus } from '../types';

interface OperationalAreaCardProps {
  area: OperationalArea;
  taskCount: number;
  issueCount: number;
}

const statusConfig: Record<
  AreaStatus,
  { label: string; color: 'success' | 'warning' | 'error'; Icon: React.ElementType }
> = {
  healthy: { label: 'Healthy', color: 'success', Icon: HealthyIcon },
  at_risk: { label: 'At Risk', color: 'warning', Icon: AtRiskIcon },
  critical: { label: 'Critical', color: 'error', Icon: CriticalIcon },
};

const OperationalAreaCard: React.FC<OperationalAreaCardProps> = ({
  area,
  taskCount,
  issueCount,
}) => {
  const theme = useTheme();
  const config = statusConfig[area.status];
  const { Icon } = config;

  const borderColor =
    area.status === 'critical'
      ? theme.palette.error.main
      : area.status === 'at_risk'
      ? theme.palette.warning.main
      : theme.palette.divider;

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${borderColor}`,
        height: '100%',
        transition: 'border-color 0.15s ease',
      }}
    >
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1} mb={1}>
          <Box
            width={32}
            height={32}
            borderRadius={1.5}
            bgcolor={alpha(
              area.status === 'critical'
                ? theme.palette.error.main
                : area.status === 'at_risk'
                ? theme.palette.warning.main
                : theme.palette.success.main,
              0.1
            )}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Icon
              sx={{
                fontSize: 18,
                color:
                  area.status === 'critical'
                    ? 'error.main'
                    : area.status === 'at_risk'
                    ? 'warning.main'
                    : 'success.main',
              }}
            />
          </Box>
          <Chip
            label={config.label}
            color={config.color}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 600,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        </Box>

        <Typography variant="body2" fontWeight={700} color="text.primary" mb={0.5}>
          {area.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
          {area.description}
        </Typography>

        <Box display="flex" alignItems="center" gap={1.5}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="caption" fontWeight={700} color="text.primary">
              {taskCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              tasks
            </Typography>
          </Box>
          {issueCount > 0 && (
            <>
              <Typography variant="caption" color="text.disabled">·</Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color={issueCount > 0 ? 'warning.main' : 'text.primary'}
                >
                  {issueCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {issueCount === 1 ? 'issue' : 'issues'}
                </Typography>
              </Box>
            </>
          )}
          {area.owner && (
            <>
              <Typography variant="caption" color="text.disabled">·</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {area.owner}
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OperationalAreaCard;
