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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as ProcessIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';

interface ProcessItem {
  id: string;
  name: string;
  category: string;
  status: 'operational' | 'needs_attention' | 'paused';
  completionRate: number;
  owner: string;
}

const CATEGORIES = [
  'Daily Ops', 'Supply Chain', 'Maintenance', 'Finance', 'HR',
  'Customer Service', 'Marketing', 'Quality', 'Compliance', 'IT', 'Other',
];

const STATUS_OPTIONS: { value: ProcessItem['status']; label: string; color: 'success' | 'warning' | 'default' }[] = [
  { value: 'operational', label: 'Operational', color: 'success' },
  { value: 'needs_attention', label: 'Needs Attention', color: 'warning' },
  { value: 'paused', label: 'Paused', color: 'default' },
];

const initialProcesses: ProcessItem[] = [
  { id: 'p1', name: 'Daily Opening Checklist', category: 'Daily Ops', status: 'operational', completionRate: 94, owner: 'Jordan Lee' },
  { id: 'p2', name: 'Inventory Reorder Workflow', category: 'Supply Chain', status: 'operational', completionRate: 88, owner: 'Sam Rivera' },
  { id: 'p3', name: 'Equipment Maintenance Schedule', category: 'Maintenance', status: 'needs_attention', completionRate: 60, owner: 'Jordan Lee' },
  { id: 'p4', name: 'Supplier Invoice Processing', category: 'Finance', status: 'operational', completionRate: 100, owner: 'Taylor Brooks' },
  { id: 'p5', name: 'Staff Scheduling', category: 'HR', status: 'operational', completionRate: 100, owner: 'Jordan Lee' },
  { id: 'p6', name: 'End-of-Day Cash Reconciliation', category: 'Finance', status: 'needs_attention', completionRate: 72, owner: 'Taylor Brooks' },
];

const EMPTY_FORM = {
  name: '',
  category: 'Daily Ops',
  owner: '',
  status: 'operational' as ProcessItem['status'],
  completionRate: 0,
};

const OperationsPage: React.FC = () => {
  const theme = useTheme();
  const [processes, setProcesses] = useState<ProcessItem[]>(initialProcesses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const operational = processes.filter((p) => p.status === 'operational').length;
  const needsAttention = processes.filter((p) => p.status === 'needs_attention').length;
  const avgCompletion =
    processes.length > 0
      ? Math.round(processes.reduce((a, p) => a + p.completionRate, 0) / processes.length)
      : 0;

  const handleAddOpen = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const handleEditOpen = (process: ProcessItem) => {
    setEditingId(process.id);
    setForm({
      name: process.name,
      category: process.category,
      owner: process.owner,
      status: process.status,
      completionRate: process.completionRate,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setProcesses((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: form.name.trim(),
                category: form.category,
                owner: form.owner.trim() || 'Unassigned',
                status: form.status,
                completionRate: form.completionRate,
              }
            : p
        )
      );
    } else {
      setProcesses((prev) => [
        ...prev,
        {
          id: `p-${Date.now()}`,
          name: form.name.trim(),
          category: form.category,
          owner: form.owner.trim() || 'Unassigned',
          status: form.status,
          completionRate: form.completionRate,
        },
      ]);
    }
    setDialogOpen(false);
  };

  const sliderColor =
    form.completionRate === 100
      ? 'success'
      : form.status === 'needs_attention'
      ? 'warning'
      : 'primary';

  return (
    <Box>
      <PageHeader
        title="Operations"
        description="Monitor and manage internal business processes and workflows."
        actions={
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
            sx={{ borderRadius: 2 }}
          >
            Add Process
          </Button>
        }
      />

      {/* Stats */}
      <Grid container spacing={2.5} mb={3}>
        {[
          { label: 'Total Processes', value: processes.length, color: 'text.primary' },
          { label: 'Operational', value: operational, color: 'success.main' },
          { label: 'Needs Attention', value: needsAttention, color: 'warning.main' },
          { label: 'Avg Completion', value: `${avgCompletion}%`, color: 'primary.main' },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                >
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight={700} mt={0.5} color={stat.color}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Process list */}
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Active Processes ({processes.length})
          </Typography>

          {processes.length === 0 ? (
            <Box
              py={6}
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1.5}
            >
              <Box
                width={48}
                height={48}
                borderRadius={2.5}
                bgcolor={alpha(theme.palette.primary.main, 0.07)}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <ProcessIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                No processes yet. Add your first one to get started.
              </Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={handleAddOpen}>
                Add Process
              </Button>
            </Box>
          ) : (
            <Box>
              {processes.map((process, idx) => {
                const statusOpt = STATUS_OPTIONS.find((s) => s.value === process.status)!;
                const isHovered = hoveredId === process.id;

                return (
                  <Box
                    key={process.id}
                    py={1.75}
                    px={1}
                    borderTop={idx > 0 ? `1px solid ${theme.palette.divider}` : 'none'}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    borderRadius={1}
                    bgcolor={isHovered ? alpha(theme.palette.primary.main, 0.02) : 'transparent'}
                    onMouseEnter={() => setHoveredId(process.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    sx={{ transition: 'background-color 0.12s ease' }}
                  >
                    {/* Main info */}
                    <Box flex={1} minWidth={0}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {process.name}
                        </Typography>
                        <Chip
                          label={statusOpt.label}
                          size="small"
                          color={statusOpt.color}
                          sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={0.75}>
                        <Typography variant="caption" color="text.secondary">
                          {process.category} · {process.owner}
                        </Typography>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color={
                            process.completionRate === 100
                              ? 'success.main'
                              : process.status === 'needs_attention'
                              ? 'warning.main'
                              : 'text.secondary'
                          }
                        >
                          {process.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={process.completionRate}
                        color={
                          process.status === 'needs_attention'
                            ? 'warning'
                            : process.status === 'paused'
                            ? 'inherit'
                            : 'success'
                        }
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    </Box>

                    {/* Hover actions */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={0.25}
                      flexShrink={0}
                      sx={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.12s ease' }}
                    >
                      <Tooltip title="Edit process">
                        <IconButton
                          size="small"
                          onClick={() => handleEditOpen(process)}
                          sx={{
                            p: 0.5,
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete process">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(process.id)}
                          sx={{
                            p: 0.5,
                            color: 'text.secondary',
                            '&:hover': { color: 'error.main' },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {editingId ? 'Edit Process' : 'Add Process'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {editingId
              ? 'Update the details for this process.'
              : 'Define a new business process or workflow.'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: '20px !important' }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Process Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              autoFocus
              fullWidth
              size="small"
              placeholder="e.g. Daily Opening Checklist, Inventory Reorder"
            />

            <Box display="flex" gap={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  label="Category"
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status}
                  label="Status"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as ProcessItem['status'] }))
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Owner"
              value={form.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
              fullWidth
              size="small"
              placeholder="e.g. Jordan Lee"
            />

            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
                <Typography variant="body2" fontWeight={700} color={`${sliderColor}.main`}>
                  {form.completionRate}%
                </Typography>
              </Box>
              <Slider
                value={form.completionRate}
                onChange={(_, val) =>
                  setForm((f) => ({ ...f, completionRate: val as number }))
                }
                min={0}
                max={100}
                step={5}
                color={sliderColor}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                ]}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.name.trim()}
            sx={{ borderRadius: 2 }}
          >
            {editingId ? 'Save Changes' : 'Add Process'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperationsPage;
