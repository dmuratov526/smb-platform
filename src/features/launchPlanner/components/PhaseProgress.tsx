import React from 'react';
import { Box, Typography, LinearProgress, Chip, useMediaQuery } from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { PhaseReadiness } from '../types';

interface PhaseProgressProps {
  phaseReadiness: PhaseReadiness[];
  activePhaseIndex: number;
}

const PhaseProgress: React.FC<PhaseProgressProps> = ({ phaseReadiness, activePhaseIndex }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      mb={3}
      p={2.5}
      borderRadius={2}
      bgcolor="background.paper"
      border={`1px solid ${theme.palette.divider}`}
    >
      <Typography variant="subtitle2" fontWeight={700} color="text.primary" mb={2}>
        Phase Progress
      </Typography>

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={isMobile ? 1.5 : 0}
        position="relative"
      >
        {phaseReadiness.map((phase, index) => {
          const isComplete = phase.percent === 100;
          const isActive = index === activePhaseIndex;
          const isUpcoming = index > activePhaseIndex && !isComplete;

          const phaseColor = isComplete
            ? theme.palette.success.main
            : isActive
            ? theme.palette.primary.main
            : theme.palette.text.disabled;

          const phaseBgColor = isComplete
            ? alpha(theme.palette.success.main, 0.08)
            : isActive
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.text.secondary, 0.04);

          const phaseBorderColor = isComplete
            ? alpha(theme.palette.success.main, 0.3)
            : isActive
            ? alpha(theme.palette.primary.main, 0.3)
            : theme.palette.divider;

          return (
            <React.Fragment key={phase.phaseId}>
              {/* Phase card */}
              <Box
                flex={1}
                p={1.75}
                borderRadius={1.5}
                bgcolor={phaseBgColor}
                border={`1px solid ${phaseBorderColor}`}
                sx={{
                  outline: isActive
                    ? `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    : 'none',
                  outlineOffset: 1,
                  transition: 'all 0.15s ease',
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Box display="flex" alignItems="center" gap={0.75}>
                    <Box
                      width={20}
                      height={20}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      bgcolor={isComplete ? 'success.main' : isActive ? 'primary.main' : 'divider'}
                    >
                      {isComplete ? (
                        <CheckIcon sx={{ fontSize: 12, color: '#fff' }} />
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            color: isActive ? '#fff' : theme.palette.text.secondary,
                            lineHeight: 1,
                          }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      fontWeight={isActive || isComplete ? 700 : 500}
                      sx={{
                        color: isUpcoming ? 'text.disabled' : 'text.primary',
                        fontSize: '0.72rem',
                      }}
                    >
                      {phase.name}
                    </Typography>
                  </Box>

                  {isActive && !isComplete && (
                    <Chip
                      label="Active"
                      size="small"
                      color="primary"
                      sx={{
                        height: 16,
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                  {isComplete && (
                    <Chip
                      label="Done"
                      size="small"
                      color="success"
                      sx={{
                        height: 16,
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={phase.percent}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    mb: 0.75,
                    bgcolor: alpha(phaseColor, 0.12),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: phaseColor,
                      borderRadius: 2,
                    },
                  }}
                />

                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  {phase.completedTasks}/{phase.totalTasks} tasks
                  {phase.inProgressTasks > 0 && ` · ${phase.inProgressTasks} active`}
                </Typography>
              </Box>

              {/* Connector arrow between phases (desktop only) */}
              {!isMobile && index < phaseReadiness.length - 1 && (
                <Box
                  display="flex"
                  alignItems="center"
                  px={0.5}
                  sx={{ color: theme.palette.divider }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 6h10M7 2l4 4-4 4"
                      stroke={
                        index < activePhaseIndex
                          ? theme.palette.success.main
                          : theme.palette.divider
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default PhaseProgress;
