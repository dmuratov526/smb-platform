import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockDashboardSummaries, mockTransactions } from '../../mock/dashboard';

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  sub?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, change, sub }) => {
  const positive = change >= 0;
  return (
    <Card>
      <CardContent>
        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700} mt={0.5}>
          {value}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
          {positive ? (
            <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main' }} />
          )}
          <Typography variant="caption" color={positive ? 'success.main' : 'error.main'} fontWeight={600}>
            {positive ? '+' : ''}{change}% vs last month
          </Typography>
        </Box>
        {sub && (
          <Typography variant="caption" color="text.disabled" display="block" mt={0.25}>
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const FinancePage: React.FC = () => {
  const { activeBusinessId } = useAppSelector((s) => s.business);
  const summary = mockDashboardSummaries.find((s) => s.businessId === activeBusinessId);
  const transactions = mockTransactions.filter((t) => t.businessId === activeBusinessId);
  const [tab, setTab] = useState(0);

  const revenueChange = summary
    ? Math.round(((summary.revenue.current - summary.revenue.previous) / summary.revenue.previous) * 100)
    : 0;
  const expenseChange = summary
    ? Math.round(((summary.expenses.current - summary.expenses.previous) / summary.expenses.previous) * 100)
    : 0;

  return (
    <Box>
      <PageHeader
        title="Finance"
        description="Track revenue, expenses, and financial health."
        actions={
          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined" startIcon={<ExportIcon />}>
              Export
            </Button>
            <Button size="small" variant="contained" startIcon={<AddIcon />}>
              Add Transaction
            </Button>
          </Box>
        }
      />

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Revenue"
            value={`$${summary?.revenue.current.toLocaleString() ?? '—'}`}
            change={revenueChange}
            sub={`Target: $${summary?.revenue.target.toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Expenses"
            value={`$${summary?.expenses.current.toLocaleString() ?? '—'}`}
            change={expenseChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Net Profit"
            value={`$${summary?.profit.current.toLocaleString() ?? '—'}`}
            change={
              summary
                ? Math.round(((summary.profit.current - summary.profit.previous) / Math.abs(summary.profit.previous)) * 100)
                : 0
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Cash Balance"
            value={`$${summary?.cashBalance.toLocaleString() ?? '—'}`}
            change={0}
            sub={`~${summary?.cashRunway} months runway`}
          />
        </Grid>
      </Grid>

      <Card>
        <Box px={2} pt={1.5} borderBottom="1px solid" borderColor="divider">
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 40 }}>
            <Tab label="All Transactions" sx={{ minHeight: 40 }} />
            <Tab label="Income" sx={{ minHeight: 40 }} />
            <Tab label="Expenses" sx={{ minHeight: 40 }} />
          </Tabs>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions
                .filter(
                  (t) =>
                    tab === 0 ||
                    (tab === 1 && t.type === 'income') ||
                    (tab === 2 && t.type === 'expense')
                )
                .map((txn) => (
                  <TableRow key={txn.id} hover>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {txn.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{txn.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={txn.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={txn.type}
                        size="small"
                        color={txn.type === 'income' ? 'success' : 'default'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={txn.type === 'income' ? 'success.main' : 'text.primary'}
                      >
                        {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {transactions.length === 0 && (
          <Box py={6} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              No transactions recorded yet.
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default FinancePage;
