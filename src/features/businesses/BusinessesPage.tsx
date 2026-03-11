import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOnOutlined as LocationIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceOutlined as FinanceIcon,
  RocketLaunchOutlined as RocketIcon,
  CheckCircleOutlined as ActiveIcon,
  EditNoteOutlined as DraftIcon,
  StorefrontOutlined as StoreIcon,
  ArrowForward as ArrowIcon,
  Groups2Outlined as TeamIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setActiveBusiness } from '../../app/businessSlice';
import { startOnboarding } from '../../app/onboardingSlice';
import { mockDashboardSummaries } from '../../mock/dashboard';

const industryLabel: Record<string, string> = {
  food_service: 'Food & Beverage',
  retail: 'Retail',
  services: 'Services',
  digital: 'Digital / Agency',
  manufacturing: 'Manufacturing',
  workshop: 'Workshop',
  other: 'Other',
};

const industryIcon: Record<string, React.ReactNode> = {
  food_service: <StoreIcon sx={{ fontSize: 13 }} />,
  retail: <StoreIcon sx={{ fontSize: 13 }} />,
  digital: <RocketIcon sx={{ fontSize: 13 }} />,
};

const BusinessesPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { businesses, activeBusinessId } = useAppSelector((s) => s.business);
  const { currentUserId, users } = useAppSelector((s) => s.session);

  const currentUser = users.find((u) => u.id === currentUserId);
  const userBusinesses = businesses.filter((b) =>
    currentUser?.businessIds.includes(b.id) ?? false
  );

  const handleNewBusiness = () => {
    dispatch(startOnboarding());
    navigate('/onboarding');
  };

  const activeBizCount = userBusinesses.filter((b) => b.status === 'active').length;
  const draftBizCount = userBusinesses.filter((b) => b.status === 'draft').length;

  return (
    <Box>
      <PageHeader
        title="Businesses"
        description="Manage and switch between your business profiles."
        actions={
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleNewBusiness}
            sx={{ borderRadius: 2, fontWeight: 700 }}>
            New Business
          </Button>
        }
      />

      {/* Summary banner */}
      <Box
        mb={3}
        p={2}
        borderRadius={2.5}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.dark ?? theme.palette.primary.main, 0.04)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} flex={1} minWidth={160}>
          <Box width={40} height={40} borderRadius={2} bgcolor={alpha(theme.palette.primary.main, 0.14)}
            display="flex" alignItems="center" justifyContent="center"
            sx={{ border: `1.5px solid ${alpha(theme.palette.primary.main, 0.3)}` }}>
            <StoreIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={800} color="text.primary">
              {userBusinesses.length} {userBusinesses.length === 1 ? 'Business' : 'Businesses'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
              in your workspace
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip icon={<ActiveIcon sx={{ fontSize: 14 }} />} label={`${activeBizCount} active`} size="small"
            color="success" sx={{ fontWeight: 700, fontSize: '0.73rem', height: 26 }} />
          {draftBizCount > 0 && (
            <Chip icon={<DraftIcon sx={{ fontSize: 14 }} />} label={`${draftBizCount} draft`} size="small"
              color="warning" sx={{ fontWeight: 700, fontSize: '0.73rem', height: 26 }} />
          )}
          <Chip icon={<TeamIcon sx={{ fontSize: 14 }} />} label={`${currentUser?.name ?? 'You'}`} size="small"
            variant="outlined" sx={{ fontWeight: 600, fontSize: '0.73rem', height: 26 }} />
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {userBusinesses.map((biz) => {
          const summary = mockDashboardSummaries.find((s) => s.businessId === biz.id);
          const isActive = biz.id === activeBusinessId;
          const revenueVsTarget = summary
            ? Math.round((summary.revenue.current / summary.revenue.target) * 100)
            : 0;
          const revenueUp = summary ? summary.revenue.current >= summary.revenue.previous : true;
          const barColor = revenueVsTarget >= 100
            ? theme.palette.success.main
            : revenueVsTarget >= 70
            ? biz.logoColor
            : theme.palette.warning.main;

          return (
            <Grid item xs={12} md={6} lg={4} key={biz.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: isActive
                    ? `2px solid ${biz.logoColor}`
                    : `1.5px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  boxShadow: isActive
                    ? `0 0 0 4px ${alpha(biz.logoColor, 0.15)}, 0 4px 24px ${alpha(biz.logoColor, 0.2)}`
                    : 'none',
                  '&:hover': {
                    borderColor: biz.logoColor,
                    boxShadow: isActive
                      ? `0 0 0 5px ${alpha(biz.logoColor, 0.18)}, 0 6px 28px ${alpha(biz.logoColor, 0.22)}`
                      : `0 0 0 2px ${alpha(biz.logoColor, 0.25)}, 0 4px 20px ${alpha(biz.logoColor, 0.12)}`,
                  },
                }}
              >
                {/* ── Vibrant header band ── */}
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${biz.logoColor} 0%, ${alpha(biz.logoColor, 0.78)} 60%, ${alpha(biz.logoColor, 0.55)} 100%)`,
                    px: 2.5,
                    pt: 2.25,
                    pb: 2.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: 96,
                  }}
                >
                  {/* Decorative background circles */}
                  <Box sx={{
                    position: 'absolute', right: -28, top: -28,
                    width: 110, height: 110, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)', pointerEvents: 'none',
                  }} />
                  <Box sx={{
                    position: 'absolute', right: 32, bottom: -40,
                    width: 80, height: 80, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
                  }} />
                  <Box sx={{
                    position: 'absolute', left: 90, top: -18,
                    width: 55, height: 55, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
                  }} />

                  {/* Logo badge */}
                  <Box
                    width={52}
                    height={52}
                    borderRadius={2.5}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      border: '2.5px solid rgba(255,255,255,0.55)',
                      boxShadow: `0 4px 16px ${alpha(biz.logoColor, 0.35)}`,
                      zIndex: 1,
                    }}
                  >
                    <Typography fontWeight={900} sx={{ color: '#fff', fontSize: '1.1rem', lineHeight: 1, letterSpacing: '-0.03em', textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                      {biz.name.slice(0, 2).toUpperCase()}
                    </Typography>
                  </Box>

                  {/* Badges (top-right) */}
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.75} zIndex={1}>
                    {isActive && (
                      <Chip label="◉  Active workspace" size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.95)',
                          color: biz.logoColor,
                          fontWeight: 800,
                          fontSize: '0.62rem',
                          height: 22,
                          '& .MuiChip-label': { px: 1 },
                          boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                        }} />
                    )}
                    <Chip
                      label={biz.status === 'active' ? '✓  Active' : '✎  Draft'}
                      size="small"
                      sx={{
                        bgcolor: biz.status === 'active' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.18)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.62rem',
                        height: 20,
                        '& .MuiChip-label': { px: 0.85 },
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.25)',
                      }} />
                  </Box>
                </Box>

                {/* ── Card body ── */}
                <Box p={2.25} flex={1} display="flex" flexDirection="column">
                  {/* Name + industry row */}
                  <Box mb={1.25}>
                    <Typography variant="h6" fontWeight={800} color="text.primary"
                      sx={{ fontSize: '1rem', lineHeight: 1.3, mb: 0.5 }}>
                      {biz.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
                      <Chip
                        icon={industryIcon[biz.industry] as React.ReactElement ?? undefined}
                        label={industryLabel[biz.industry] ?? biz.industry}
                        size="small"
                        sx={{
                          fontSize: '0.66rem', height: 22,
                          bgcolor: alpha(biz.logoColor, 0.1),
                          color: biz.logoColor,
                          fontWeight: 700,
                          border: `1px solid ${alpha(biz.logoColor, 0.25)}`,
                          '& .MuiChip-label': { px: 0.9 },
                          '& .MuiChip-icon': { fontSize: 12, color: biz.logoColor },
                        }}
                      />
                      {biz.location && (
                        <Box display="flex" alignItems="center" gap={0.3}>
                          <LocationIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
                            {biz.location}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary"
                    sx={{ fontSize: '0.82rem', lineHeight: 1.55, mb: 2, flex: 1,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {biz.description}
                  </Typography>

                  {/* Financial stats panel */}
                  {summary && (
                    <Box
                      p={1.75}
                      borderRadius={2}
                      mb={2}
                      sx={{
                        background: `linear-gradient(135deg, ${alpha(biz.logoColor, 0.07)} 0%, ${alpha(biz.logoColor, 0.03)} 100%)`,
                        border: `1px solid ${alpha(biz.logoColor, 0.2)}`,
                      }}
                    >
                      {/* Revenue + Runway row */}
                      <Box display="flex" mb={1.5}>
                        <Box flex={1} sx={{ borderRight: `1px solid ${alpha(biz.logoColor, 0.2)}`, pr: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.64rem', display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.3 }}>
                            <FinanceIcon sx={{ fontSize: 10 }} /> Revenue
                          </Typography>
                          <Box display="flex" alignItems="baseline" gap={0.5}>
                            <Typography fontWeight={900} sx={{ fontSize: '1.05rem', color: biz.logoColor, lineHeight: 1 }}>
                              ${(summary.revenue.current / 1000).toFixed(0)}k
                            </Typography>
                            {revenueUp
                              ? <TrendingUpIcon sx={{ fontSize: 13, color: 'success.main' }} />
                              : <TrendingDownIcon sx={{ fontSize: 13, color: 'error.main' }} />}
                          </Box>
                        </Box>
                        <Box flex={1} pl={1.5}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.64rem', display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.3 }}>
                            <RocketIcon sx={{ fontSize: 10 }} /> Runway
                          </Typography>
                          <Typography fontWeight={900} sx={{ fontSize: '1.05rem', color: 'text.primary', lineHeight: 1 }}>
                            {summary.cashRunway}
                            <Typography component="span" variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem', ml: 0.3 }}>mo</Typography>
                          </Typography>
                        </Box>
                      </Box>

                      {/* Progress bar */}
                      <Tooltip title={`$${summary.revenue.current.toLocaleString()} of $${summary.revenue.target.toLocaleString()} target`}>
                        <Box>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.62rem' }}>
                              Revenue vs target
                            </Typography>
                            <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem', color: barColor }}>
                              {revenueVsTarget}%
                            </Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(100, revenueVsTarget)}
                            sx={{
                              height: 6, borderRadius: 3,
                              bgcolor: alpha(barColor, 0.12),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: `linear-gradient(90deg, ${alpha(barColor, 0.8)}, ${barColor})`,
                              },
                            }} />
                        </Box>
                      </Tooltip>
                    </Box>
                  )}

                  {/* Action buttons */}
                  <Box display="flex" gap={1}>
                    {!isActive ? (
                      <>
                        <Button size="small" variant="contained" fullWidth
                          onClick={() => dispatch(setActiveBusiness(biz.id))}
                          sx={{
                            borderRadius: 2, fontWeight: 700, fontSize: '0.76rem', height: 34,
                            background: `linear-gradient(135deg, ${biz.logoColor}, ${alpha(biz.logoColor, 0.8)})`,
                            '&:hover': { background: `linear-gradient(135deg, ${biz.logoColor}, ${biz.logoColor})` },
                            boxShadow: `0 2px 8px ${alpha(biz.logoColor, 0.35)}`,
                          }}>
                          Set Active
                        </Button>
                        <Button size="small" variant="outlined"
                          onClick={() => navigate('/builder')}
                          sx={{ borderRadius: 2, fontWeight: 600, fontSize: '0.76rem', height: 34, px: 2, flexShrink: 0, borderColor: alpha(biz.logoColor, 0.4), color: biz.logoColor, '&:hover': { borderColor: biz.logoColor, bgcolor: alpha(biz.logoColor, 0.05) } }}>
                          Open
                        </Button>
                      </>
                    ) : (
                      <Button size="small" variant="outlined" fullWidth
                        onClick={() => navigate('/dashboard')}
                        sx={{
                          borderRadius: 2, fontWeight: 700, fontSize: '0.76rem', height: 34,
                          borderColor: biz.logoColor, color: biz.logoColor,
                          '&:hover': { bgcolor: alpha(biz.logoColor, 0.06), borderColor: biz.logoColor },
                        }}
                        endIcon={<ArrowIcon sx={{ fontSize: 15 }} />}>
                        Go to Dashboard
                      </Button>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}

        {/* Add new business card */}
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={0} onClick={handleNewBusiness}
            sx={{
              height: '100%', minHeight: 260,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.25)}`,
              borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, transparent)`,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)}, ${alpha(theme.palette.primary.main, 0.02)})`,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                '& .add-icon-box': {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  boxShadow: `0 0 0 6px ${alpha(theme.palette.primary.main, 0.08)}`,
                  '& svg': { color: theme.palette.primary.main },
                },
                '& .add-label': { color: theme.palette.primary.main },
              },
            }}>
            <Box textAlign="center" px={2}>
              <Box className="add-icon-box" width={56} height={56} borderRadius={3}
                bgcolor={alpha(theme.palette.text.primary, 0.05)}
                display="flex" alignItems="center" justifyContent="center"
                mx="auto" mb={2} sx={{ transition: 'all 0.2s' }}>
                <AddIcon sx={{ fontSize: 28, color: 'text.disabled', transition: 'color 0.2s' }} />
              </Box>
              <Typography className="add-label" variant="body2" fontWeight={800} color="text.secondary" mb={0.75}
                sx={{ transition: 'color 0.2s', fontSize: '0.9rem' }}>
                Add New Business
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.73rem', lineHeight: 1.5 }}>
                Launch another venture or<br />import an existing profile
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessesPage;
