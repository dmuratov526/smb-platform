import React, { useState, useMemo } from 'react';
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
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Menu,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  AccountBalanceWalletOutlined as CashIcon,
  ShowChartOutlined as RevenueIcon,
  MoneyOffOutlined as ExpenseIcon,
  SavingsOutlined as ProfitIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  PictureAsPdfOutlined as PdfIcon,
  TableChartOutlined as CsvIcon,
  CalendarMonthOutlined as CalendarIcon,
  SpeedOutlined as ScenarioIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockDashboardSummaries, mockTransactions } from '../../mock/dashboard';
import {
  mockMonthlyFinancials,
  mockBudgetItems,
  mockAnnualPlan,
  AnnualPlanData,
  AnnualPlanMonth,
} from '../../mock/finance';
import { FinancialTransaction } from '../../types';

/* ─── Export helpers ─── */
function exportCSV(transactions: FinancialTransaction[], filename: string) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount.toString(),
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(transactions: FinancialTransaction[], businessName: string) {
  const rows = transactions
    .map(
      (t) =>
        `<tr>
          <td>${t.date}</td>
          <td>${t.description}</td>
          <td>${t.category}</td>
          <td style="color:${t.type === 'income' ? '#16a34a' : '#dc2626'}">${t.type}</td>
          <td style="text-align:right;font-weight:600">${t.type === 'income' ? '+' : '−'}$${t.amount.toLocaleString()}</td>
        </tr>`
    )
    .join('');
  const html = `<!DOCTYPE html><html><head><title>Finance Export</title>
    <style>body{font-family:sans-serif;padding:24px}h2{margin-bottom:4px}p{color:#666;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;border:1px solid #e5e7eb;font-size:13px}
    th{background:#f9fafb;font-weight:700;text-align:left}tr:hover{background:#f9fafb}
    @media print{body{padding:0}}</style></head>
    <body><h2>Finance — ${businessName}</h2><p>Exported on ${new Date().toLocaleDateString()}</p>
    <table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th></tr></thead>
    <tbody>${rows}</tbody></table></body></html>`;
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.print();
  }
}

/* ─── Transaction form state ─── */
interface TxnFormState {
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: string;
}

const EMPTY_TXN_FORM: TxnFormState = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  category: '',
  type: 'income',
  amount: '',
};

const TXN_CATEGORIES = [
  'Coffee Sales', 'Food Sales', 'Retail', 'Events & Catering',
  'Online Sales', 'In-Store Sales', 'Wholesale',
  'Retainer Clients', 'Project Work', 'Consulting',
  'Payroll', 'COGS', 'Rent & Utilities', 'Marketing', 'Software & Tools', 'Other',
];

/* ─── Compact KPI metric card ─── */
interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  sub?: string;
  icon: React.ReactNode;
  iconColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, sub, icon, iconColor }) => {
  const theme = useTheme();
  const positive = change === undefined || change >= 0;
  return (
    <Card
      elevation={0}
      sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Box flex={1} minWidth={0}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={700}
              sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.3, mt: 0.4, fontSize: '1.2rem' }}>
              {value}
            </Typography>
            {change !== undefined && (
              <Box display="flex" alignItems="center" gap={0.4} mt={0.4}>
                {positive ? (
                  <TrendingUpIcon sx={{ fontSize: 13, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 13, color: 'error.main' }} />
                )}
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={positive ? 'success.main' : 'error.main'}
                  sx={{ fontSize: '0.68rem' }}
                >
                  {positive ? '+' : ''}{change}% vs prev
                </Typography>
              </Box>
            )}
            {sub && (
              <Typography variant="caption" color="text.disabled" display="block" sx={{ fontSize: '0.66rem', mt: 0.3 }}>
                {sub}
              </Typography>
            )}
          </Box>
          <Box
            width={34}
            height={34}
            borderRadius={1.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            bgcolor={alpha(iconColor, 0.1)}
            sx={{ color: iconColor }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/* ─── Category breakdown row ─── */
interface CategoryRowProps {
  category: string;
  amount: number;
  percent: number;
  trend: 'up' | 'down' | 'flat';
  changePercent: number;
  barColor: string;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category, amount, percent, trend, changePercent, barColor,
}) => {
  const theme = useTheme();
  const trendColor =
    trend === 'up' ? theme.palette.success.main
    : trend === 'down' ? theme.palette.error.main
    : theme.palette.text.disabled;

  return (
    <Box py={1} sx={{ '&:not(:last-child)': { borderBottom: `1px solid ${theme.palette.divider}` } }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ fontSize: '0.77rem' }}>
          {category}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: trendColor, fontWeight: 600 }}>
            {trend === 'flat' ? '—' : `${trend === 'up' ? '+' : ''}${changePercent}%`}
          </Typography>
          <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.78rem', minWidth: 70, textAlign: 'right' }}>
            ${amount.toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            bgcolor: alpha(barColor, 0.12),
            '& .MuiLinearProgress-bar': { bgcolor: barColor, borderRadius: 2 },
          }}
        />
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.62rem', minWidth: 30, textAlign: 'right' }}>
          {percent.toFixed(0)}%
        </Typography>
      </Box>
    </Box>
  );
};

/* ─── Main page ─── */
const FinancePage: React.FC = () => {
  const theme = useTheme();
  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);
  const summary = mockDashboardSummaries.find((s) => s.businessId === activeBusinessId);
  const monthlyData = mockMonthlyFinancials[activeBusinessId ?? ''] ?? [];
  const budgetItems = mockBudgetItems[activeBusinessId ?? ''] ?? [];

  /* ── Page-level tabs: 0=Transactions, 1=Annual Plan ── */
  const [pageTab, setPageTab] = useState(0);

  /* ── Local CRUD state ── */
  const [txnList, setTxnList] = useState<FinancialTransaction[]>(() =>
    mockTransactions.filter((t) => t.businessId === activeBusinessId)
  );
  const [txnTab, setTxnTab] = useState(0);
  const [rightTab, setRightTab] = useState(0);

  /* ── Modal state ── */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TxnFormState>(EMPTY_TXN_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ── Export menu ── */
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  /* ── Annual plan state ── */
  const [planData, setPlanData] = useState<AnnualPlanData | null>(
    () => mockAnnualPlan[activeBusinessId ?? ''] ?? null
  );
  const [planScenario, setPlanScenario] = useState<'conservative' | 'base' | 'aggressive'>('base');
  const [planEditIdx, setPlanEditIdx] = useState<number | null>(null);
  const [planEditForm, setPlanEditForm] = useState({ revenueTgt: '', expenseTgt: '' });

  /* ── Live computed KPIs from txnList ── */
  const liveRevenue = useMemo(
    () => txnList.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0),
    [txnList]
  );
  const liveExpenses = useMemo(
    () => txnList.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0),
    [txnList]
  );
  const liveProfit = liveRevenue - liveExpenses;
  const liveMargin = liveRevenue > 0 ? ((liveProfit / liveRevenue) * 100).toFixed(1) : '—';

  const revenueChange = summary
    ? Math.round(((liveRevenue - summary.revenue.previous) / (summary.revenue.previous || 1)) * 100)
    : 0;
  const expenseChange = summary
    ? Math.round(((liveExpenses - summary.expenses.previous) / (summary.expenses.previous || 1)) * 100)
    : 0;
  const profitChange = summary
    ? Math.round(((liveProfit - summary.profit.previous) / Math.abs(summary.profit.previous || 1)) * 100)
    : 0;

  /* ── Computed categories from live txnList ── */
  const computedIncomeCategories = useMemo(() => {
    const byCat: Record<string, number> = {};
    txnList.filter((t) => t.type === 'income').forEach((t) => {
      byCat[t.category] = (byCat[t.category] ?? 0) + t.amount;
    });
    const total = Object.values(byCat).reduce((a, v) => a + v, 0);
    return Object.entries(byCat)
      .map(([category, amount]) => ({
        id: category, category, amount,
        percentOfTotal: total > 0 ? (amount / total) * 100 : 0,
        trend: 'flat' as const, changePercent: 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [txnList]);

  const computedExpenseCategories = useMemo(() => {
    const byCat: Record<string, number> = {};
    txnList.filter((t) => t.type === 'expense').forEach((t) => {
      byCat[t.category] = (byCat[t.category] ?? 0) + t.amount;
    });
    const total = Object.values(byCat).reduce((a, v) => a + v, 0);
    return Object.entries(byCat)
      .map(([category, amount]) => ({
        id: category, category, amount,
        percentOfTotal: total > 0 ? (amount / total) * 100 : 0,
        trend: 'flat' as const, changePercent: 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [txnList]);

  /* ── CRUD helpers ── */
  const openAdd = () => { setForm(EMPTY_TXN_FORM); setEditingId(null); setModalOpen(true); };
  const openEdit = (txn: FinancialTransaction) => {
    setForm({ date: txn.date, description: txn.description, category: txn.category, type: txn.type, amount: String(txn.amount) });
    setEditingId(txn.id);
    setModalOpen(true);
  };
  const handleSave = () => {
    if (!form.description || !form.amount || !form.category) return;
    if (editingId) {
      setTxnList((prev) => prev.map((t) => t.id === editingId
        ? { ...t, date: form.date, description: form.description, category: form.category, type: form.type, amount: Number(form.amount) }
        : t));
    } else {
      setTxnList((prev) => [{
        id: `txn-${Date.now()}`, businessId: activeBusinessId ?? '',
        date: form.date, description: form.description, category: form.category,
        type: form.type, amount: Number(form.amount),
      }, ...prev]);
    }
    setModalOpen(false);
  };
  const handleDelete = (id: string) => { setTxnList((prev) => prev.filter((t) => t.id !== id)); setDeleteId(null); };

  const filteredTransactions = txnList.filter(
    (t) => txnTab === 0 || (txnTab === 1 && t.type === 'income') || (txnTab === 2 && t.type === 'expense')
  );

  /* ── Annual plan computed values ── */
  const scMult = planScenario === 'conservative' ? 0.88 : planScenario === 'aggressive' ? 1.15 : 1.0;
  const expMult = planScenario === 'conservative' ? 0.95 : planScenario === 'aggressive' ? 1.06 : 1.0;
  const scaledMonths: AnnualPlanMonth[] = useMemo(() => {
    if (!planData) return [];
    return planData.months.map((m) => ({
      ...m,
      revenueTgt: m.revenueAct !== undefined ? m.revenueTgt : Math.round(m.revenueTgt * scMult),
      expenseTgt: m.expenseAct !== undefined ? m.expenseTgt : Math.round(m.expenseTgt * expMult),
    }));
  }, [planData, scMult, expMult]);

  const ytdRevenue = scaledMonths.filter((m) => m.revenueAct !== undefined).reduce((a, m) => a + (m.revenueAct ?? 0), 0);
  const ytdExpenses = scaledMonths.filter((m) => m.expenseAct !== undefined).reduce((a, m) => a + (m.expenseAct ?? 0), 0);
  const remainingRevTgt = scaledMonths.filter((m) => m.revenueAct === undefined).reduce((a, m) => a + m.revenueTgt, 0);
  const remainingExpTgt = scaledMonths.filter((m) => m.expenseAct === undefined).reduce((a, m) => a + m.expenseTgt, 0);
  const projectedRevenue = ytdRevenue + remainingRevTgt;
  const projectedExpenses = ytdExpenses + remainingExpTgt;
  const projectedProfit = projectedRevenue - projectedExpenses;
  const annualRevGoal = planData ? Math.round(planData.annualRevenueGoal * scMult) : 0;
  const annualExpBudget = planData ? Math.round(planData.annualExpenseBudget * expMult) : 0;
  const ytdMonthCount = scaledMonths.filter((m) => m.revenueAct !== undefined).length;

  return (
    <Box>
      <PageHeader
        title="Finance"
        description="Revenue, expenses, and financial health for this period."
        actions={
          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined" startIcon={<ExportIcon />} onClick={(e) => setExportAnchor(e.currentTarget)}>
              Export
            </Button>
            <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}>
              <MenuItem onClick={() => { exportCSV(txnList, `finance-${activeBusinessId}.csv`); setExportAnchor(null); }} sx={{ gap: 1, fontSize: '0.85rem' }}>
                <CsvIcon fontSize="small" /> Export to Excel / CSV
              </MenuItem>
              <MenuItem onClick={() => { exportPDF(txnList, activeBusiness?.name ?? 'Business'); setExportAnchor(null); }} sx={{ gap: 1, fontSize: '0.85rem' }}>
                <PdfIcon fontSize="small" /> Export to PDF
              </MenuItem>
            </Menu>
            {pageTab === 0 && (
              <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
                Add Transaction
              </Button>
            )}
          </Box>
        }
      />

      {/* ── KPI Row (always visible, driven by live txnList) ── */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={6} sm={3}>
          <MetricCard label="Revenue" value={`$${liveRevenue.toLocaleString()}`} change={revenueChange}
            sub={`Target $${summary?.revenue.target.toLocaleString() ?? '—'}`}
            icon={<RevenueIcon sx={{ fontSize: 17 }} />} iconColor={theme.palette.primary.main} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard label="Expenses" value={`$${liveExpenses.toLocaleString()}`} change={expenseChange}
            icon={<ExpenseIcon sx={{ fontSize: 17 }} />} iconColor={theme.palette.error.main} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard label="Net Profit" value={`$${liveProfit.toLocaleString()}`} change={profitChange}
            sub={`${liveMargin}% margin`} icon={<ProfitIcon sx={{ fontSize: 17 }} />}
            iconColor={liveProfit >= 0 ? theme.palette.success.main : theme.palette.error.main} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard label="Cash Balance" value={`$${summary?.cashBalance.toLocaleString() ?? '—'}`}
            sub={`~${summary?.cashRunway ?? '—'} months runway`}
            icon={<CashIcon sx={{ fontSize: 17 }} />} iconColor={theme.palette.warning.main} />
        </Grid>
      </Grid>

      {/* ── Page tabs ── */}
      <Box borderBottom={`1px solid ${theme.palette.divider}`} mb={2.5}>
        <Tabs value={pageTab} onChange={(_, v) => setPageTab(v)} sx={{ minHeight: 40 }}>
          <Tab label="Transactions & Breakdown" sx={{ minHeight: 40, fontSize: '0.82rem', textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Annual Financial Plan" sx={{ minHeight: 40, fontSize: '0.82rem', textTransform: 'none', fontWeight: 600 }}
            icon={<CalendarIcon sx={{ fontSize: 14 }} />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* ══════════════════════════════════ TAB 0: TRANSACTIONS ══════════════════════════════════ */}
      {pageTab === 0 && (
        <Box display="flex" gap={2.5} alignItems="flex-start" flexDirection={{ xs: 'column', md: 'row' }}>
          {/* ── Left: Transactions table ── */}
          <Box flex={1} minWidth={0}>
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box px={2} pt={1.5} borderBottom={`1px solid ${theme.palette.divider}`}>
                <Tabs value={txnTab} onChange={(_, v) => setTxnTab(v)} sx={{ minHeight: 38 }}>
                  <Tab label="All" sx={{ minHeight: 38, fontSize: '0.8rem', textTransform: 'none', fontWeight: 600, px: 1.5 }} />
                  <Tab label="Income" sx={{ minHeight: 38, fontSize: '0.8rem', textTransform: 'none', fontWeight: 600, px: 1.5 }} />
                  <Tab label="Expenses" sx={{ minHeight: 38, fontSize: '0.8rem', textTransform: 'none', fontWeight: 600, px: 1.5 }} />
                </Tabs>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Date</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Description</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Amount</TableCell>
                      <TableCell sx={{ width: 60 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <TableRow key={txn.id} hover sx={{ '& td': { py: 0.75 } }}>
                        <TableCell><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.73rem' }}>{txn.date}</Typography></TableCell>
                        <TableCell><Typography variant="body2" sx={{ fontSize: '0.82rem' }}>{txn.description}</Typography></TableCell>
                        <TableCell>
                          <Chip label={txn.category} size="small" variant="outlined"
                            sx={{ fontSize: '0.66rem', height: 20, '& .MuiChip-label': { px: 0.75 } }} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700}
                            sx={{ fontSize: '0.82rem', color: txn.type === 'income' ? 'success.main' : 'text.primary' }}>
                            {txn.type === 'income' ? '+' : '−'}${txn.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" gap={0.25} justifyContent="flex-end">
                            <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(txn)} sx={{ p: 0.5 }}><EditIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                            <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(txn.id)} sx={{ p: 0.5, color: 'error.main' }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {filteredTransactions.length === 0 && (
                <Box py={5} textAlign="center"><Typography variant="body2" color="text.secondary">No transactions found.</Typography></Box>
              )}
            </Card>
          </Box>

          {/* ── Right: breakdown + 6-month ── */}
          <Box width={{ xs: '100%', md: 300 }} flexShrink={0}>
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, mb: 2 }}>
              <Box px={1.5} pt={1} borderBottom={`1px solid ${theme.palette.divider}`}>
                <Tabs value={rightTab} onChange={(_, v) => setRightTab(v)} sx={{ minHeight: 36 }}>
                  <Tab label="Income" sx={{ minHeight: 36, fontSize: '0.76rem', textTransform: 'none', fontWeight: 600, px: 1.25 }} />
                  <Tab label="Expenses" sx={{ minHeight: 36, fontSize: '0.76rem', textTransform: 'none', fontWeight: 600, px: 1.25 }} />
                  <Tab label="Budget" sx={{ minHeight: 36, fontSize: '0.76rem', textTransform: 'none', fontWeight: 600, px: 1.25 }} />
                </Tabs>
              </Box>
              <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                {rightTab === 0 && (
                  <Box>
                    {computedIncomeCategories.length === 0
                      ? <Typography variant="caption" color="text.disabled">No income transactions yet</Typography>
                      : computedIncomeCategories.map((cat) => (
                        <CategoryRow key={cat.id} category={cat.category} amount={cat.amount}
                          percent={cat.percentOfTotal} trend={cat.trend} changePercent={cat.changePercent}
                          barColor={theme.palette.success.main} />
                      ))}
                  </Box>
                )}
                {rightTab === 1 && (
                  <Box>
                    {computedExpenseCategories.length === 0
                      ? <Typography variant="caption" color="text.disabled">No expense transactions yet</Typography>
                      : computedExpenseCategories.map((cat) => (
                        <CategoryRow key={cat.id} category={cat.category} amount={cat.amount}
                          percent={cat.percentOfTotal} trend={cat.trend} changePercent={cat.changePercent}
                          barColor={theme.palette.error.main} />
                      ))}
                  </Box>
                )}
                {rightTab === 2 && (
                  <Box>
                    {budgetItems.length === 0
                      ? <Typography variant="caption" color="text.disabled">No data</Typography>
                      : budgetItems.map((item, i) => {
                        const over = item.actual > item.budgeted;
                        const pct = Math.min(Math.round((item.actual / item.budgeted) * 100), 100);
                        return (
                          <Box key={i} py={1} sx={{ '&:not(:last-child)': { borderBottom: `1px solid ${theme.palette.divider}` } }}>
                            <Box display="flex" justifyContent="space-between" mb={0.4}>
                              <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.75rem' }}>{item.category}</Typography>
                              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem', color: over ? 'error.main' : 'success.main' }}>
                                ${item.actual.toLocaleString()}
                                <Typography component="span" variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}> / ${item.budgeted.toLocaleString()}</Typography>
                              </Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={pct} sx={{ height: 3, borderRadius: 2, bgcolor: alpha(over ? theme.palette.error.main : theme.palette.success.main, 0.1), '& .MuiLinearProgress-bar': { bgcolor: over ? theme.palette.error.main : theme.palette.success.main, borderRadius: 2 } }} />
                          </Box>
                        );
                      })}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* 6-month summary */}
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box px={2} py={1.25} borderBottom={`1px solid ${theme.palette.divider}`}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  6-Month Summary
                </Typography>
              </Box>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { py: 0.75, fontSize: '0.66rem', fontWeight: 700, color: 'text.secondary', bgcolor: alpha(theme.palette.text.primary, 0.02) } }}>
                      <TableCell>Mo.</TableCell><TableCell align="right">Rev.</TableCell><TableCell align="right">Exp.</TableCell><TableCell align="right">Net</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthlyData.map((row, i) => {
                      const isCurrent = i === monthlyData.length - 1;
                      return (
                        <TableRow key={row.month} sx={{ bgcolor: isCurrent ? alpha(theme.palette.primary.main, 0.04) : 'transparent', '& td': { py: 0.7, fontSize: '0.75rem', borderBottom: i < monthlyData.length - 1 ? undefined : 'none' } }}>
                          <TableCell>
                            <Typography variant="caption" fontWeight={isCurrent ? 700 : 500} color={isCurrent ? 'text.primary' : 'text.secondary'} sx={{ fontSize: '0.75rem' }}>
                              {row.month}{isCurrent && <Typography component="span" variant="caption" color="primary.main" sx={{ fontSize: '0.6rem', ml: 0.4 }}>●</Typography>}
                            </Typography>
                          </TableCell>
                          <TableCell align="right"><Typography variant="caption" color="text.primary" sx={{ fontSize: '0.74rem' }}>${(row.revenue / 1000).toFixed(0)}k</Typography></TableCell>
                          <TableCell align="right"><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.74rem' }}>${(row.expenses / 1000).toFixed(0)}k</Typography></TableCell>
                          <TableCell align="right">
                            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.74rem', color: row.net >= 0 ? 'success.main' : 'error.main' }}>
                              {row.net >= 0 ? '+' : ''}${(row.net / 1000).toFixed(1)}k
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Box mt={1.5} p={1.5} borderRadius={2} border={`1px solid ${theme.palette.divider}`} bgcolor="background.paper" display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.7rem' }}>Net Margin</Typography>
                <Typography variant="caption" display="block" color="text.disabled" sx={{ fontSize: '0.65rem' }}>Current period</Typography>
              </Box>
              <Chip label={`${liveMargin}%`} size="small"
                color={parseFloat(String(liveMargin)) >= 0 ? 'success' : 'error'}
                sx={{ fontWeight: 800, fontSize: '0.78rem' }} />
            </Box>
          </Box>
        </Box>
      )}

      {/* ══════════════════════════════════ TAB 1: ANNUAL PLAN ══════════════════════════════════ */}
      {pageTab === 1 && (
        <Box>
          {!planData ? (
            <Box py={6} textAlign="center"><Typography color="text.secondary">No annual plan available for this business.</Typography></Box>
          ) : (
            <>
              {/* Scenario selector */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5} flexWrap="wrap" gap={1.5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ScenarioIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Scenario
                  </Typography>
                  {(['conservative', 'base', 'aggressive'] as const).map((s) => (
                    <Chip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} size="small"
                      onClick={() => setPlanScenario(s)}
                      color={planScenario === s ? 'primary' : 'default'}
                      variant={planScenario === s ? 'filled' : 'outlined'}
                      sx={{ fontWeight: 700, fontSize: '0.72rem', height: 24, cursor: 'pointer', textTransform: 'capitalize' }} />
                  ))}
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                  {planData.year} · {ytdMonthCount} of 12 months with actuals
                </Typography>
              </Box>

              {/* Annual KPI summary row */}
              <Grid container spacing={2} mb={2.5}>
                {[
                  { label: 'Annual Rev. Goal', value: `$${(annualRevGoal / 1000).toFixed(0)}k`, sub: `YTD $${(ytdRevenue / 1000).toFixed(0)}k`, pct: annualRevGoal > 0 ? Math.round((ytdRevenue / annualRevGoal) * 100) : 0, color: theme.palette.primary.main },
                  { label: 'YTD Revenue', value: `$${(ytdRevenue / 1000).toFixed(0)}k`, sub: `${annualRevGoal > 0 ? Math.round((ytdRevenue / annualRevGoal) * 100) : 0}% of goal`, pct: annualRevGoal > 0 ? Math.round((ytdRevenue / annualRevGoal) * 100) : 0, color: theme.palette.success.main },
                  { label: 'Projected Year-End', value: `$${(projectedRevenue / 1000).toFixed(0)}k`, sub: `vs $${(annualRevGoal / 1000).toFixed(0)}k goal`, pct: annualRevGoal > 0 ? Math.round((projectedRevenue / annualRevGoal) * 100) : 0, color: theme.palette.info?.main ?? theme.palette.primary.main },
                  { label: 'Expected Profit', value: `$${(projectedProfit / 1000).toFixed(0)}k`, sub: projectedRevenue > 0 ? `${Math.round((projectedProfit / projectedRevenue) * 100)}% margin` : '—', pct: null, color: projectedProfit >= 0 ? theme.palette.success.main : theme.palette.error.main },
                ].map((kpi) => (
                  <Grid item xs={6} sm={3} key={kpi.label}>
                    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {kpi.label}
                        </Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.2rem', lineHeight: 1.3, mt: 0.4, color: kpi.color }}>
                          {kpi.value}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.67rem' }}>{kpi.sub}</Typography>
                        {kpi.pct !== null && (
                          <LinearProgress variant="determinate" value={Math.min(100, kpi.pct)} sx={{ mt: 0.75, height: 3, borderRadius: 2, bgcolor: alpha(kpi.color, 0.12), '& .MuiLinearProgress-bar': { bgcolor: kpi.color, borderRadius: 2 } }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* 12-month planning table */}
              <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <Box px={2} py={1.5} display="flex" alignItems="center" justifyContent="space-between" borderBottom={`1px solid ${theme.palette.divider}`}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    12-Month Plan — {planData.year}
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Box display="flex" alignItems="center" gap={0.5}><Box width={8} height={8} borderRadius="50%" bgcolor="success.main" /><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Actual</Typography></Box>
                    <Box display="flex" alignItems="center" gap={0.5}><Box width={8} height={8} borderRadius="50%" bgcolor="text.disabled" sx={{ opacity: 0.4 }} /><Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Planned</Typography></Box>
                  </Box>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { py: 1, fontSize: '0.7rem', fontWeight: 700, color: 'text.secondary', bgcolor: alpha(theme.palette.text.primary, 0.02) } }}>
                        <TableCell sx={{ width: 64 }}>Month</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>Revenue</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>Expenses</TableCell>
                        <TableCell align="right" sx={{ width: 90 }}>Net</TableCell>
                        <TableCell align="center" sx={{ width: 80 }}>Status</TableCell>
                        <TableCell sx={{ width: 40 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scaledMonths.map((m, idx) => {
                        const hasActual = m.revenueAct !== undefined;
                        const revPct = hasActual && m.revenueAct !== undefined ? Math.min(Math.round((m.revenueAct / m.revenueTgt) * 100), 130) : 0;
                        const expPct = hasActual && m.expenseAct !== undefined ? Math.min(Math.round((m.expenseAct / m.expenseTgt) * 100), 130) : 0;
                        const net = hasActual ? (m.revenueAct ?? 0) - (m.expenseAct ?? 0) : m.revenueTgt - m.expenseTgt;
                        const netPositive = net >= 0;
                        const revOver = revPct >= 100;
                        const expOver = expPct > 100;
                        const statusColor = !hasActual ? theme.palette.text.disabled : revOver && !expOver ? theme.palette.success.main : expOver ? theme.palette.error.main : revPct >= 85 ? theme.palette.primary.main : theme.palette.warning.main;
                        const statusLabel = !hasActual ? 'Planned' : revOver && !expOver ? 'On Track' : expOver ? 'Over Budget' : revPct >= 85 ? 'Close' : 'At Risk';

                        return (
                          <TableRow key={m.month} sx={{ '& td': { py: 1, borderBottom: idx < scaledMonths.length - 1 ? undefined : 'none' }, bgcolor: hasActual ? alpha(theme.palette.text.primary, 0.015) : 'transparent' }}>
                            <TableCell>
                              <Typography variant="caption" fontWeight={hasActual ? 700 : 500} color={hasActual ? 'text.primary' : 'text.disabled'} sx={{ fontSize: '0.78rem' }}>
                                {m.month}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box flex={1}>
                                  <LinearProgress variant="determinate" value={hasActual ? Math.min(revPct, 100) : 0}
                                    sx={{ height: 5, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.12), '& .MuiLinearProgress-bar': { bgcolor: revOver ? theme.palette.success.main : theme.palette.primary.main, borderRadius: 3 } }} />
                                </Box>
                                <Typography variant="caption" sx={{ fontSize: '0.72rem', minWidth: 100, color: hasActual ? 'text.primary' : 'text.disabled' }}>
                                  {hasActual ? `$${((m.revenueAct ?? 0) / 1000).toFixed(1)}k` : '—'}
                                  <Typography component="span" variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}> / ${(m.revenueTgt / 1000).toFixed(0)}k</Typography>
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box flex={1}>
                                  <LinearProgress variant="determinate" value={hasActual ? Math.min(expPct, 100) : 0}
                                    sx={{ height: 5, borderRadius: 3, bgcolor: alpha(theme.palette.error.main, 0.1), '& .MuiLinearProgress-bar': { bgcolor: expOver ? theme.palette.error.main : theme.palette.warning.main, borderRadius: 3 } }} />
                                </Box>
                                <Typography variant="caption" sx={{ fontSize: '0.72rem', minWidth: 100, color: hasActual ? 'text.primary' : 'text.disabled' }}>
                                  {hasActual ? `$${((m.expenseAct ?? 0) / 1000).toFixed(1)}k` : '—'}
                                  <Typography component="span" variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}> / ${(m.expenseTgt / 1000).toFixed(0)}k</Typography>
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.78rem', color: netPositive ? 'success.main' : 'error.main' }}>
                                {netPositive ? '+' : ''}${(net / 1000).toFixed(1)}k
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={statusLabel} size="small"
                                sx={{ height: 20, fontSize: '0.62rem', fontWeight: 700, bgcolor: alpha(statusColor, 0.12), color: statusColor, '& .MuiChip-label': { px: 0.75 } }} />
                            </TableCell>
                            <TableCell align="right">
                              {!hasActual && (
                                <Tooltip title="Edit targets">
                                  <IconButton size="small" sx={{ p: 0.4 }}
                                    onClick={() => { setPlanEditIdx(idx); setPlanEditForm({ revenueTgt: String(m.revenueTgt), expenseTgt: String(m.expenseTgt) }); }}>
                                    <EditIcon sx={{ fontSize: 13 }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Totals footer */}
                <Box px={2} py={1.5} borderTop={`1px solid ${theme.palette.divider}`} display="flex" gap={3} bgcolor={alpha(theme.palette.text.primary, 0.02)}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Annual Revenue Goal</Typography>
                    <Typography variant="body2" fontWeight={800} color="primary.main">${(annualRevGoal / 1000).toFixed(0)}k</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Expense Budget</Typography>
                    <Typography variant="body2" fontWeight={800} color="error.main">${(annualExpBudget / 1000).toFixed(0)}k</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Target Profit</Typography>
                    <Typography variant="body2" fontWeight={800} color={annualRevGoal - annualExpBudget >= 0 ? 'success.main' : 'error.main'}>
                      ${((annualRevGoal - annualExpBudget) / 1000).toFixed(0)}k
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>Projected Profit</Typography>
                    <Typography variant="body2" fontWeight={800} color={projectedProfit >= 0 ? 'success.main' : 'error.main'}>
                      ${(projectedProfit / 1000).toFixed(0)}k
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </>
          )}
        </Box>
      )}

      {/* ── Add / Edit Transaction dialog ── */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1rem' }}>{editingId ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField label="Date" type="date" size="small" fullWidth value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
          <TextField label="Description" size="small" fullWidth value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <TextField label="Category" size="small" fullWidth select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {TXN_CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Type" size="small" fullWidth select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'income' | 'expense' }))}>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
          <TextField label="Amount ($)" size="small" fullWidth type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button size="small" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleSave} disabled={!form.description || !form.amount || !form.category}>
            {editingId ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Transaction dialog ── */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem' }}>Delete Transaction</DialogTitle>
        <DialogContent><Typography variant="body2" color="text.secondary">Are you sure you want to delete this transaction? This action cannot be undone.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button size="small" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button size="small" variant="contained" color="error" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Annual Plan Month dialog ── */}
      <Dialog open={planEditIdx !== null} onClose={() => setPlanEditIdx(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1rem' }}>
          Edit Targets — {planEditIdx !== null ? scaledMonths[planEditIdx]?.month : ''}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField label="Revenue Target ($)" size="small" fullWidth type="number" value={planEditForm.revenueTgt}
            onChange={(e) => setPlanEditForm((f) => ({ ...f, revenueTgt: e.target.value }))} />
          <TextField label="Expense Budget ($)" size="small" fullWidth type="number" value={planEditForm.expenseTgt}
            onChange={(e) => setPlanEditForm((f) => ({ ...f, expenseTgt: e.target.value }))} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button size="small" onClick={() => setPlanEditIdx(null)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={() => {
            if (planEditIdx === null || !planData) return;
            const updatedMonths = planData.months.map((m, i) =>
              i === planEditIdx ? { ...m, revenueTgt: Number(planEditForm.revenueTgt), expenseTgt: Number(planEditForm.expenseTgt) } : m
            );
            setPlanData({ ...planData, months: updatedMonths });
            setPlanEditIdx(null);
          }}>
            Save Targets
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancePage;
