import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as RevenueIcon,
  AccountBalance as CashIcon,
  ShowChart as ProfitIcon,
  Receipt as ExpenseIcon,
  CheckCircleOutline as CheckIcon,
  WarningAmber as WarningIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockDashboardSummaries, mockAlerts } from '../../mock/dashboard';
import { AlertSeverity } from '../../types';

const severityIconMap: Record<AlertSeverity, React.ReactNode> = {
  success: <CheckIcon fontSize="small" color="success" />,
  warning: <WarningIcon fontSize="small" color="warning" />,
  error: <ErrorIcon fontSize="small" color="error" />,
  info: <InfoIcon fontSize="small" color="info" />,
};

interface KpiCardProps {
  label: string;
  value: string;
  previous?: string;
  target?: string;
  change?: number;
  icon: React.ReactNode;
  progress?: number;
  progressColor?: 'primary' | 'success' | 'warning' | 'error';
  iconBg: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  previous,
  change,
  target,
  icon,
  progress,
  progressColor = 'primary',
  iconBg,
}) => {
  const positive = (change ?? 0) >= 0;
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box
            width={38}
            height={38}
            borderRadius={1.5}
            bgcolor={iconBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </Box>
          {change !== undefined && (
            <Box display="flex" alignItems="center" gap={0.25}>
              {positive ? (
                <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main' }} />
              )}
              <Typography variant="caption" fontWeight={600} color={positive ? 'success.main' : 'error.main'}>
                {positive ? '+' : ''}{change}%
              </Typography>
            </Box>
          )}
        </Box>
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
        <Typography variant="h5" fontWeight={700} mt={0.25}>
          {value}
        </Typography>
        {previous && (
          <Typography variant="caption" color="text.disabled" display="block" mt={0.25}>
            Prev: {previous}
          </Typography>
        )}
        {progress !== undefined && (
          <Box mt={1.5}>
            {target && (
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  vs target
                </Typography>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  {Math.round(progress)}%
                </Typography>
              </Box>
            )}
            <LinearProgress
              variant="determinate"
              value={Math.min(100, progress)}
              color={progressColor}
            />
            {target && (
              <Typography variant="caption" color="text.disabled" display="block" mt={0.25}>
                Target: {target}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);
  const summary = mockDashboardSummaries.find((s) => s.businessId === activeBusinessId);
  const alerts = mockAlerts.filter((a) => a.businessId === activeBusinessId);
  const unreadAlerts = alerts.filter((a) => !a.read);

  if (!summary) {
    return (
      <Box>
        <PageHeader title="Dashboard" description="Overview of your business performance." />
        <Alert severity="info">No dashboard data available for this business.</Alert>
      </Box>
    );
  }

  const revenueChange = Math.round(
    ((summary.revenue.current - summary.revenue.previous) / summary.revenue.previous) * 100
  );
  const profitChange = Math.round(
    ((summary.profit.current - summary.profit.previous) / Math.abs(summary.profit.previous)) * 100
  );
  const expenseChange = Math.round(
    ((summary.expenses.current - summary.expenses.previous) / summary.expenses.previous) * 100
  );

  return (
    <Box>
      <PageHeader
        title={`Dashboard — ${activeBusiness?.name ?? 'Business'}`}
        description="Current business performance overview and key indicators."
        actions={
          <Chip
            label={activeBusiness?.status}
            size="small"
            color={activeBusiness?.status === 'active' ? 'success' : 'warning'}
            sx={{ textTransform: 'capitalize' }}
          />
        }
      />

      {/* KPI Row */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Monthly Revenue"
            value={`$${summary.revenue.current.toLocaleString()}`}
            previous={`$${summary.revenue.previous.toLocaleString()}`}
            change={revenueChange}
            icon={<RevenueIcon sx={{ fontSize: 20, color: '#2563EB' }} />}
            iconBg="rgba(37,99,235,0.1)"
            progress={(summary.revenue.current / summary.revenue.target) * 100}
            target={`$${summary.revenue.target.toLocaleString()}`}
            progressColor={summary.revenue.current >= summary.revenue.target ? 'success' : 'primary'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Monthly Expenses"
            value={`$${summary.expenses.current.toLocaleString()}`}
            previous={`$${summary.expenses.previous.toLocaleString()}`}
            change={expenseChange}
            icon={<ExpenseIcon sx={{ fontSize: 20, color: '#D97706' }} />}
            iconBg="rgba(217,119,6,0.1)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Net Profit"
            value={`$${summary.profit.current.toLocaleString()}`}
            previous={`$${summary.profit.previous.toLocaleString()}`}
            change={profitChange}
            icon={<ProfitIcon sx={{ fontSize: 20, color: '#059669' }} />}
            iconBg="rgba(5,150,105,0.1)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Cash Balance"
            value={`$${summary.cashBalance.toLocaleString()}`}
            change={0}
            icon={<CashIcon sx={{ fontSize: 20, color: '#7C3AED' }} />}
            iconBg="rgba(124,58,237,0.1)"
            progress={(summary.cashRunway / 12) * 100}
            target={`${summary.cashRunway} mo runway`}
            progressColor={summary.cashRunway >= 6 ? 'success' : 'warning'}
          />
        </Grid>
      </Grid>

      {/* Alerts + Quick Stats */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <Box px={2} py={1.5} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" fontWeight={600}>
                Alerts
                {unreadAlerts.length > 0 && (
                  <Chip
                    label={unreadAlerts.length}
                    size="small"
                    color="error"
                    sx={{ ml: 1, height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                  />
                )}
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => {}}>
                View all
              </Button>
            </Box>
            <Divider />
            <List disablePadding>
              {alerts.slice(0, 4).map((alert, idx) => (
                <React.Fragment key={alert.id}>
                  {idx > 0 && <Divider />}
                  <ListItem
                    sx={{
                      px: 2,
                      py: 1.25,
                      bgcolor: alert.read ? 'transparent' : 'rgba(37,99,235,0.03)',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {severityIconMap[alert.severity]}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={alert.read ? 400 : 600}>
                          {alert.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {alert.message.length > 90 ? alert.message.slice(0, 90) + '…' : alert.message}
                        </Typography>
                      }
                    />
                    <Chip
                      label={alert.category}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1, height: 18, fontSize: '0.6rem', textTransform: 'capitalize', '& .MuiChip-label': { px: 0.75 } }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
              {alerts.length === 0 && (
                <ListItem sx={{ py: 3, justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No alerts at this time.
                  </Typography>
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Quick Stats
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {[
                  { label: 'Cash Runway', value: `${summary.cashRunway} months`, color: summary.cashRunway >= 6 ? 'success.main' : 'warning.main' },
                  { label: 'Team Size', value: `${summary.teamSize} members`, color: 'text.primary' },
                  { label: 'Marketing ROI', value: `${summary.marketingROI}×`, color: summary.marketingROI >= 3 ? 'success.main' : 'warning.main' },
                  { label: 'Pending Tasks', value: `${summary.pendingTasks} tasks`, color: summary.pendingTasks > 5 ? 'warning.main' : 'text.primary' },
                  { label: 'Active Alerts', value: `${summary.activeAlerts} alerts`, color: summary.activeAlerts > 2 ? 'error.main' : 'text.primary' },
                ].map((stat) => (
                  <Box key={stat.label} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color={stat.color}>
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CTA row for core modules */}
      <Grid container spacing={2.5}>
        {[
          {
            title: 'Business Builder',
            desc: 'Review and refine your business configuration.',
            path: '/builder',
            color: '#7C3AED',
            bg: 'rgba(124,58,237,0.08)',
          },
          {
            title: 'Business Simulator',
            desc: 'Run scenarios and stress-test your assumptions.',
            path: '/simulator',
            color: '#2563EB',
            bg: 'rgba(37,99,235,0.08)',
          },
          {
            title: 'Launch Planner',
            desc: 'Track launch tasks and milestone readiness.',
            path: '/planner',
            color: '#059669',
            bg: 'rgba(5,150,105,0.08)',
          },
        ].map((card) => (
          <Grid item xs={12} sm={4} key={card.title}>
            <Card
              sx={{
                cursor: 'pointer',
                bgcolor: card.bg,
                border: '1px solid',
                borderColor: card.color + '33',
                boxShadow: 'none',
                '&:hover': { borderColor: card.color + '88', bgcolor: card.bg },
                transition: 'all 0.15s',
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                <Typography variant="subtitle2" fontWeight={700} color={card.color} mb={0.5}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
