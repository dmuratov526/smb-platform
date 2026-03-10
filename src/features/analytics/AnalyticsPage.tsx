import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as NeutralIcon,
} from '@mui/icons-material';
import PageHeader from '../../shared/components/PageHeader';
import { mockAnalyticsMetrics } from '../../mock/dashboard';
import { AnalyticsMetric } from '../../types';

const TrendIcon: React.FC<{ trend: AnalyticsMetric['trend']; change: number }> = ({ trend, change }) => {
  if (trend === 'up')
    return <TrendingUpIcon sx={{ fontSize: 14, color: change >= 0 ? 'success.main' : 'error.main' }} />;
  if (trend === 'down')
    return <TrendingDownIcon sx={{ fontSize: 14, color: change <= 0 ? 'error.main' : 'success.main' }} />;
  return <NeutralIcon sx={{ fontSize: 14, color: 'text.disabled' }} />;
};

const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => {
  const positiveChange = metric.change >= 0;
  return (
    <Card>
      <CardContent>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing="0.06em"
          display="block"
        >
          {metric.label}
        </Typography>
        <Typography variant="h5" fontWeight={700} mt={0.5}>
          {metric.unit === '$' ? `$${metric.value.toLocaleString()}` : `${metric.value}${metric.unit}`}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
          <TrendIcon trend={metric.trend} change={metric.change} />
          <Typography
            variant="caption"
            fontWeight={600}
            color={positiveChange ? 'success.main' : 'error.main'}
          >
            {positiveChange ? '+' : ''}{metric.change}% vs prior period
          </Typography>
        </Box>
        <Typography variant="caption" color="text.disabled" display="block" mt={0.25}>
          {metric.period}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AnalyticsPage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Analytics"
        description="Track business performance, trends, and key indicators."
        actions={
          <Chip label="Mar 2024" variant="outlined" size="small" />
        }
      />

      <Grid container spacing={2.5} mb={3}>
        {mockAnalyticsMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.id}>
            <MetricCard metric={metric} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
          <Card sx={{ minHeight: 260 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Revenue Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Monthly revenue performance over the last 6 months.
              </Typography>
              <Box
                height={180}
                display="flex"
                alignItems="flex-end"
                gap={1}
                px={1}
              >
                {[32000, 35500, 34200, 37800, 38500, 41200].map((v, i) => (
                  <Box key={i} flex={1} display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                    <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                      ${(v / 1000).toFixed(0)}k
                    </Typography>
                    <Box
                      width="100%"
                      borderRadius={1}
                      bgcolor={i === 5 ? 'primary.main' : 'primary.light'}
                      sx={{ height: (v / 41200) * 140, opacity: i === 5 ? 1 : 0.5, transition: 'height 0.3s' }}
                    />
                    <Typography variant="caption" color="text.secondary" fontSize="0.6rem">
                      {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Key Insights
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {[
                  { label: 'Revenue is growing', detail: '+7% month-over-month', color: 'success.main' },
                  { label: 'Profit margin improving', detail: '16.9% → target 20%', color: 'primary.main' },
                  { label: 'Customer visits up', detail: '+4.3% vs last month', color: 'success.main' },
                  { label: 'Marketing CAC down', detail: 'More efficient spend', color: 'success.main' },
                  { label: 'Expenses rising slightly', detail: '+1.3% — monitor closely', color: 'warning.main' },
                ].map((insight, idx) => (
                  <Box key={idx} display="flex" gap={1} alignItems="flex-start">
                    <Box
                      width={6}
                      height={6}
                      borderRadius="50%"
                      bgcolor={insight.color}
                      mt={0.6}
                      flexShrink={0}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {insight.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {insight.detail}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
