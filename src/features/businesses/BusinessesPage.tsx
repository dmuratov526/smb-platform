import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setActiveBusiness } from '../../app/businessSlice';
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

const BusinessesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { businesses, activeBusinessId } = useAppSelector((s) => s.business);

  return (
    <Box>
      <PageHeader
        title="Businesses"
        description="Manage and switch between your business profiles."
        actions={
          <Button variant="contained" size="small" startIcon={<AddIcon />}>
            New Business
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        {businesses.map((biz) => {
          const summary = mockDashboardSummaries.find((s) => s.businessId === biz.id);
          const isActive = biz.id === activeBusinessId;

          return (
            <Grid item xs={12} md={6} lg={4} key={biz.id}>
              <Card
                sx={{
                  height: '100%',
                  outline: isActive ? '2px solid' : 'none',
                  outlineColor: 'primary.main',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                    }}
                  />
                )}
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      width={40}
                      height={40}
                      borderRadius={1.5}
                      bgcolor={biz.logoColor}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Typography variant="caption" fontWeight={700} color="#fff" fontSize="0.7rem">
                        {biz.name.slice(0, 2).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {biz.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <CircleIcon
                          sx={{
                            fontSize: 7,
                            color:
                              biz.status === 'active'
                                ? 'success.main'
                                : biz.status === 'draft'
                                ? 'warning.main'
                                : 'text.disabled',
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" textTransform="capitalize">
                          {biz.status}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          ·
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {industryLabel[biz.industry] ?? biz.industry}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                    {biz.description}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {biz.location}
                  </Typography>

                  {summary && (
                    <Box mt={2} pt={2} borderTop="1px solid" borderColor="divider">
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Monthly Revenue
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            ${summary.revenue.current.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Cash Runway
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {summary.cashRunway} months
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box mt={1.5}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            Revenue vs Target
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {Math.round((summary.revenue.current / summary.revenue.target) * 100)}%
                          </Typography>
                        </Box>
                        <Tooltip
                          title={`$${summary.revenue.current.toLocaleString()} of $${summary.revenue.target.toLocaleString()} target`}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(
                              100,
                              (summary.revenue.current / summary.revenue.target) * 100
                            )}
                            color={
                              summary.revenue.current >= summary.revenue.target ? 'success' : 'primary'
                            }
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  <Box mt={2} display="flex" gap={1}>
                    {!isActive && (
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        onClick={() => dispatch(setActiveBusiness(biz.id))}
                      >
                        Set Active
                      </Button>
                    )}
                    <Button size="small" variant={isActive ? 'outlined' : 'text'} fullWidth>
                      Open
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              height: '100%',
              border: '2px dashed',
              borderColor: 'divider',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              minHeight: 200,
              '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
              transition: 'all 0.15s',
            }}
          >
            <Box textAlign="center" py={4}>
              <AddIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Add New Business
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Chip label={`${businesses.length} businesses total`} size="small" variant="outlined" />
        <Chip
          label={`${businesses.filter((b) => b.status === 'active').length} active`}
          size="small"
          color="success"
          variant="outlined"
          sx={{ ml: 1 }}
        />
        <Chip
          label={`${businesses.filter((b) => b.status === 'draft').length} in draft`}
          size="small"
          color="warning"
          variant="outlined"
          sx={{ ml: 1 }}
        />
      </Box>
    </Box>
  );
};

export default BusinessesPage;
