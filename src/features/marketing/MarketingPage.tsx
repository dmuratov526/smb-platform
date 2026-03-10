import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockCampaigns } from '../../mock/dashboard';
import { mockBusinessConfigurations } from '../../mock/businesses';

const statusColor: Record<string, 'success' | 'warning' | 'default' | 'error'> = {
  active: 'success',
  draft: 'default',
  paused: 'warning',
  completed: 'default',
};

const MarketingPage: React.FC = () => {
  const { activeBusinessId } = useAppSelector((s) => s.business);
  const campaigns = mockCampaigns.filter((c) => c.businessId === activeBusinessId);
  const config = mockBusinessConfigurations.find((c) => c.businessId === activeBusinessId);
  const channels = config?.marketingChannels ?? [];

  const totalBudget = campaigns.reduce((a, c) => a + c.budget, 0);
  const totalSpent = campaigns.reduce((a, c) => a + c.spent, 0);
  const totalLeads = campaigns.reduce((a, c) => a + c.leads, 0);
  const totalConversions = campaigns.reduce((a, c) => a + c.conversions, 0);

  return (
    <Box>
      <PageHeader
        title="Marketing"
        description="Manage campaigns, track performance, and monitor customer acquisition."
        actions={
          <Button variant="contained" size="small" startIcon={<AddIcon />}>
            New Campaign
          </Button>
        }
      />

      <Grid container spacing={2.5} mb={3}>
        {[
          { label: 'Total Budget', value: `$${totalBudget.toLocaleString()}` },
          { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}` },
          { label: 'Leads Generated', value: totalLeads.toLocaleString() },
          {
            label: 'Conversion Rate',
            value: totalLeads > 0 ? `${Math.round((totalConversions / totalLeads) * 100)}%` : '—',
          },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} mt={0.5}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Active Campaigns
              </Typography>
              {campaigns.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Campaign</TableCell>
                        <TableCell>Channel</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Budget</TableCell>
                        <TableCell align="right">Leads</TableCell>
                        <TableCell align="right">Conv.</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaigns.map((c) => (
                        <TableRow key={c.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {c.name}
                            </Typography>
                            <Box mt={0.5}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(100, (c.spent / c.budget) * 100)}
                                sx={{ height: 3, borderRadius: 2 }}
                                color={c.spent / c.budget > 0.9 ? 'warning' : 'primary'}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {c.channel}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={c.status}
                              size="small"
                              color={statusColor[c.status]}
                              sx={{ textTransform: 'capitalize', height: 20, fontSize: '0.65rem' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              ${c.spent.toLocaleString()} / ${c.budget.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{c.leads}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              {c.conversions}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box py={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No campaigns for this business yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Marketing Channels
              </Typography>
              {channels.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {channels.map((ch) => (
                    <Box key={ch.id}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" fontWeight={500}>
                          {ch.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${ch.monthlyBudget}/mo
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(
                            100,
                            (ch.monthlyBudget /
                              channels.reduce((a, c) => a + c.monthlyBudget, 0)) *
                              100
                          )}
                          sx={{ flex: 1, height: 4 }}
                          color="secondary"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {ch.expectedReach.toLocaleString()} reach
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No channels configured.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketingPage;
