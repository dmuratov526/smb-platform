import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { PhaseReadiness } from '../types';

interface PhaseProgressProps {
  phaseReadiness: PhaseReadiness[];
  activePhaseIndex: number;
}

const PhaseProgress: React.FC<PhaseProgressProps> = ({ phaseReadiness, activePhaseIndex }) => {
  const theme = useTheme();

  return (
    <Box
      p={1.75}
      borderRadius={2}
      bgcolor="background.paper"
      border={`1px solid ${theme.palette.divider}`}
    >
      <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1.5}
        sx={{ fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Phases
      </Typography>

      <Box display="flex" flexDirection="column" gap={0}>
        {phaseReadiness.map((phase, index) => {
          const isComplete = phase.percent === 100;
          const isActive = index === activePhaseIndex;
          const isUpcoming = index > activePhaseIndex && !isComplete;

          const phaseColor = isComplete
            ? theme.palette.success.main
            : isActive
            ? theme.palette.primary.main
            : theme.palette.text.disabled;

          return (
            <Box key={phase.phaseId} display="flex" gap={1.25} position="relative">
              {/* Timeline stem */}
              <Box display="flex" flexDirection="column" alignItems="center" flexShrink={0}>
                <Box
                  width={22}
                  height={22}
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  bgcolor={
                    isComplete
                      ? 'success.main'
                      : isActive
                      ? 'primary.main'
                      : alpha(theme.palette.text.secondary, 0.15)
                  }
                >
                  {isComplete ? (
                    <CheckIcon sx={{ fontSize: 12, color: '#fff' }} />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '0.58rem',
                        fontWeight: 800,
                        color: isActive ? '#fff' : theme.palette.text.secondary,
                        lineHeight: 1,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  )}
                </Box>
                {index < phaseReadiness.length - 1 && (
                  <Box
                    width={2}
                    flex={1}
                    minHeight={14}
                    bgcolor={
                      isComplete
                        ? alpha(theme.palette.success.main, 0.3)
                        : alpha(theme.palette.divider, 1)
                    }
                    my={0.4}
                    borderRadius={1}
                  />
                )}
              </Box>

              {/* Phase info */}
              <Box flex={1} minWidth={0} pb={index < phaseReadiness.length - 1 ? 1 : 0}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.4}>
                  <Typography
                    variant="caption"
                    fontWeight={isActive || isComplete ? 700 : 500}
                    noWrap
                    sx={{
                      fontSize: '0.74rem',
                      color: isUpcoming ? 'text.disabled' : 'text.primary',
                      maxWidth: 140,
                    }}
                  >
                    {phase.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{ fontSize: '0.68rem', color: phaseColor, flexShrink: 0, ml: 0.5 }}
                  >
                    {phase.percent}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={phase.percent}
                  sx={{
                    height: 3,
                    borderRadius: 2,
                    mb: 0.4,
                    bgcolor: alpha(phaseColor, 0.12),
                    '& .MuiLinearProgress-bar': { bgcolor: phaseColor, borderRadius: 2 },
                  }}
                />

                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.62rem' }}>
                  {phase.completedTasks}/{phase.totalTasks} tasks
                  {phase.inProgressTasks > 0 && ` · ${phase.inProgressTasks} active`}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PhaseProgress;
