import React, { useState } from 'react';
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
  Add as AddIcon,
  FileDownload as ExportIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  PictureAsPdfOutlined as PdfIcon,
  TableChartOutlined as CsvIcon,
  CampaignOutlined as CampaignIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockCampaigns } from '../../mock/dashboard';
import { mockBusinessConfigurations } from '../../mock/businesses';

/* ─── Types ─── */
interface Campaign {
  id: string;
  businessId: string;
  name: string;
  channel: string;
  status: 'active' | 'draft' | 'paused' | 'completed';
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  startDate?: string;
  endDate?: string;
}

interface CampaignForm {
  name: string;
  channel: string;
  status: Campaign['status'];
  budget: string;
  spent: string;
  leads: string;
  conversions: string;
}

const EMPTY_FORM: CampaignForm = {
  name: '', channel: '', status: 'draft',
  budget: '', spent: '0', leads: '0', conversions: '0',
};

const CHANNELS = ['Social Media', 'Email', 'Google Ads', 'Content / SEO', 'Events', 'Referral', 'Influencer', 'Other'];
const STATUSES: Campaign['status'][] = ['active', 'draft', 'paused', 'completed'];

const statusColor: Record<string, 'success' | 'warning' | 'default' | 'error'> = {
  active: 'success', draft: 'default', paused: 'warning', completed: 'default',
};

/* ─── Export helpers ─── */
function exportCampaignCSV(campaigns: Campaign[], filename: string) {
  const headers = ['Name', 'Channel', 'Status', 'Budget', 'Spent', 'Leads', 'Conversions'];
  const rows = campaigns.map((c) => [
    `"${c.name}"`, c.channel, c.status,
    c.budget, c.spent, c.leads, c.conversions,
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportCampaignPDF(campaigns: Campaign[], businessName: string) {
  const rows = campaigns.map((c) =>
    `<tr>
      <td>${c.name}</td>
      <td>${c.channel}</td>
      <td style="text-transform:capitalize">${c.status}</td>
      <td>$${c.budget.toLocaleString()}</td>
      <td>$${c.spent.toLocaleString()}</td>
      <td>${c.leads}</td>
      <td style="font-weight:600;color:#16a34a">${c.conversions}</td>
    </tr>`
  ).join('');
  const html = `<!DOCTYPE html><html><head><title>Marketing Export</title>
    <style>body{font-family:sans-serif;padding:24px}h2{margin-bottom:4px}p{color:#666;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;border:1px solid #e5e7eb;font-size:13px}
    th{background:#f9fafb;font-weight:700;text-align:left}@media print{body{padding:0}}</style></head>
    <body><h2>Marketing — ${businessName}</h2><p>Exported on ${new Date().toLocaleDateString()}</p>
    <table><thead><tr><th>Campaign</th><th>Channel</th><th>Status</th><th>Budget</th><th>Spent</th><th>Leads</th><th>Conv.</th></tr></thead>
    <tbody>${rows}</tbody></table></body></html>`;
  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); win.print(); }
}

/* ─── Compact KPI stat box ─── */
const StatCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => {
  const theme = useTheme();
  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}
          sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.3, mt: 0.4, fontSize: '1.2rem', color: color ?? 'text.primary' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

/* ─── Main page ─── */
const MarketingPage: React.FC = () => {
  const theme = useTheme();
  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);
  const config = mockBusinessConfigurations.find((c) => c.businessId === activeBusinessId);
  const channels = config?.marketingChannels ?? [];

  const [campaigns, setCampaigns] = useState<Campaign[]>(() =>
    (mockCampaigns.filter((c) => c.businessId === activeBusinessId) as Campaign[])
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CampaignForm>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setModalOpen(true); };
  const openEdit = (c: Campaign) => {
    setForm({ name: c.name, channel: c.channel, status: c.status, budget: String(c.budget), spent: String(c.spent), leads: String(c.leads), conversions: String(c.conversions) });
    setEditingId(c.id);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.channel) return;
    if (editingId) {
      setCampaigns((prev) => prev.map((c) => c.id === editingId
        ? { ...c, name: form.name, channel: form.channel, status: form.status, budget: Number(form.budget), spent: Number(form.spent), leads: Number(form.leads), conversions: Number(form.conversions) }
        : c));
    } else {
      setCampaigns((prev) => [{
        id: `camp-${Date.now()}`, businessId: activeBusinessId ?? '',
        name: form.name, channel: form.channel, status: form.status,
        budget: Number(form.budget), spent: Number(form.spent),
        leads: Number(form.leads), conversions: Number(form.conversions),
      }, ...prev]);
    }
    setModalOpen(false);
  };

  const totalBudget = campaigns.reduce((a, c) => a + c.budget, 0);
  const totalSpent = campaigns.reduce((a, c) => a + c.spent, 0);
  const totalLeads = campaigns.reduce((a, c) => a + c.leads, 0);
  const totalConversions = campaigns.reduce((a, c) => a + c.conversions, 0);
  const convRate = totalLeads > 0 ? `${Math.round((totalConversions / totalLeads) * 100)}%` : '—';
  const totalChannelBudget = channels.reduce((a, c) => a + c.monthlyBudget, 0);

  return (
    <Box>
      <PageHeader
        title="Marketing"
        description="Manage campaigns, track performance, and monitor customer acquisition."
        actions={
          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined" startIcon={<ExportIcon />} onClick={(e) => setExportAnchor(e.currentTarget)}>
              Export
            </Button>
            <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}>
              <MenuItem onClick={() => { exportCampaignCSV(campaigns, `marketing-${activeBusinessId}.csv`); setExportAnchor(null); }} sx={{ gap: 1, fontSize: '0.85rem' }}>
                <CsvIcon fontSize="small" /> Export to Excel / CSV
              </MenuItem>
              <MenuItem onClick={() => { exportCampaignPDF(campaigns, activeBusiness?.name ?? 'Business'); setExportAnchor(null); }} sx={{ gap: 1, fontSize: '0.85rem' }}>
                <PdfIcon fontSize="small" /> Export to PDF
              </MenuItem>
            </Menu>
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openAdd}>
              New Campaign
            </Button>
          </Box>
        }
      />

      {/* ── KPI Row ── */}
      <Grid container spacing={2} mb={2.5}>
        <Grid item xs={6} sm={3}><StatCard label="Total Budget" value={`$${totalBudget.toLocaleString()}`} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Total Spent" value={`$${totalSpent.toLocaleString()}`} color={theme.palette.error.main} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Leads Generated" value={totalLeads.toLocaleString()} color={theme.palette.primary.main} /></Grid>
        <Grid item xs={6} sm={3}><StatCard label="Conversion Rate" value={convRate} color={theme.palette.success.main} /></Grid>
      </Grid>

      {/* ── Two-column layout ── */}
      <Box display="flex" gap={2.5} alignItems="flex-start" flexDirection={{ xs: 'column', lg: 'row' }}>

        {/* ── Left: Campaigns table ── */}
        <Box flex={1} minWidth={0}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Box px={2} py={1.5} display="flex" alignItems="center" justifyContent="space-between" borderBottom={`1px solid ${theme.palette.divider}`}>
              <Typography variant="caption" fontWeight={700} color="text.secondary"
                sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Campaigns
              </Typography>
              <Chip label={`${campaigns.length} total`} size="small" variant="outlined" sx={{ fontSize: '0.68rem', height: 20 }} />
            </Box>
            {campaigns.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Campaign</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Channel</TableCell>
                      <TableCell sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Budget / Spent</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Leads</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', py: 1 }}>Conv.</TableCell>
                      <TableCell sx={{ width: 60 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaigns.map((c) => (
                      <TableRow key={c.id} hover sx={{ '& td': { py: 0.9 } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.82rem' }}>{c.name}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, c.budget > 0 ? (c.spent / c.budget) * 100 : 0)}
                            sx={{ height: 2, borderRadius: 1, mt: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                            color={c.budget > 0 && c.spent / c.budget > 0.9 ? 'warning' : 'primary'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>{c.channel}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={c.status} size="small" color={statusColor[c.status]}
                            sx={{ textTransform: 'capitalize', height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.78rem' }}>
                            ${c.spent.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                            {' '}/ ${c.budget.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.78rem' }}>{c.leads}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" fontWeight={700} color="success.main" sx={{ fontSize: '0.78rem' }}>{c.conversions}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" gap={0.25} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => openEdit(c)} sx={{ p: 0.5 }}>
                                <EditIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => setDeleteId(c.id)} sx={{ p: 0.5, color: 'error.main' }}>
                                <DeleteIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box py={6} textAlign="center">
                <CampaignIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">No campaigns yet.</Typography>
                <Button size="small" variant="outlined" startIcon={<AddIcon />} sx={{ mt: 1.5 }} onClick={openAdd}>
                  Create First Campaign
                </Button>
              </Box>
            )}
          </Card>
        </Box>

        {/* ── Right: Channels panel ── */}
        <Box width={{ xs: '100%', lg: 280 }} flexShrink={0}>
          <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Box px={2} py={1.5} borderBottom={`1px solid ${theme.palette.divider}`}>
              <Typography variant="caption" fontWeight={700} color="text.secondary"
                sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Marketing Channels
              </Typography>
            </Box>
            <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
              {channels.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={0}>
                  {channels.map((ch) => {
                    const pct = totalChannelBudget > 0 ? (ch.monthlyBudget / totalChannelBudget) * 100 : 0;
                    return (
                      <Box key={ch.id} py={1.1}
                        sx={{ '&:not(:last-child)': { borderBottom: `1px solid ${theme.palette.divider}` } }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ fontSize: '0.78rem' }}>
                            {ch.name}
                          </Typography>
                          <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.75rem' }}>
                            ${ch.monthlyBudget.toLocaleString()}<Typography component="span" variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>/mo</Typography>
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              flex: 1, height: 3, borderRadius: 2,
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              '& .MuiLinearProgress-bar': { bgcolor: theme.palette.secondary.main, borderRadius: 2 },
                            }}
                          />
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.62rem', minWidth: 50, textAlign: 'right' }}>
                            {ch.expectedReach.toLocaleString()} reach
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No channels configured.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Budget utilisation summary */}
          {campaigns.length > 0 && (
            <Box mt={1.5} p={1.75} borderRadius={2} border={`1px solid ${theme.palette.divider}`} bgcolor="background.paper">
              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}
                sx={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Budget Utilisation
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <LinearProgress
                  variant="determinate"
                  value={totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0}
                  sx={{
                    flex: 1, height: 6, borderRadius: 3,
                    bgcolor: alpha(theme.palette.warning.main, 0.12),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: totalBudget > 0 && totalSpent / totalBudget > 0.85 ? theme.palette.error.main : theme.palette.warning.main,
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.78rem', flexShrink: 0 }}>
                  {totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}%` : '—'}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.67rem' }}>
                ${totalSpent.toLocaleString()} spent of ${totalBudget.toLocaleString()} budget
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Add / Edit Campaign dialog ── */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1rem' }}>
          {editingId ? 'Edit Campaign' : 'New Campaign'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField label="Campaign Name" size="small" fullWidth value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <TextField label="Channel" size="small" fullWidth select value={form.channel}
            onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}>
            {CHANNELS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Status" size="small" fullWidth select value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Campaign['status'] }))}>
            {STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Budget ($)" size="small" fullWidth type="number" value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} />
          <TextField label="Spent ($)" size="small" fullWidth type="number" value={form.spent}
            onChange={(e) => setForm((f) => ({ ...f, spent: e.target.value }))} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Leads" size="small" fullWidth type="number" value={form.leads}
                onChange={(e) => setForm((f) => ({ ...f, leads: e.target.value }))} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Conversions" size="small" fullWidth type="number" value={form.conversions}
                onChange={(e) => setForm((f) => ({ ...f, conversions: e.target.value }))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button size="small" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleSave} disabled={!form.name || !form.channel}>
            {editingId ? 'Save Changes' : 'Add Campaign'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem' }}>Delete Campaign</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Delete <strong>{campaigns.find((c) => c.id === deleteId)?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button size="small" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button size="small" variant="contained" color="error"
            onClick={() => { setCampaigns((prev) => prev.filter((c) => c.id !== deleteId)); setDeleteId(null); }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketingPage;
