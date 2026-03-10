import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BugReportOutlined as IssueIcon,
  ExpandMore as ChevronIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { addIssue, updateIssue, updateIssueStatus, deleteIssue } from '../slice';
import {
  OperationalIssue,
  IssueSeverity,
  IssueStatus,
  OperationalArea,
} from '../types';

interface IssuesSectionProps {
  businessId: string;
  issues: OperationalIssue[];
  areas: OperationalArea[];
}

type SeverityOption = { value: IssueSeverity; label: string; color: 'default' | 'primary' | 'warning' | 'error' };
type StatusOption = { value: IssueStatus; label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'error' };

const SEVERITY_OPTIONS: SeverityOption[] = [
  { value: 'low', label: 'Low', color: 'default' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'warning' },
  { value: 'critical', label: 'Critical', color: 'error' },
];

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'open', label: 'Open', color: 'error' },
  { value: 'in_progress', label: 'In Progress', color: 'warning' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  severity: 'medium' as IssueSeverity,
  status: 'open' as IssueStatus,
  areaId: '',
  owner: '',
};

const IssuesSection: React.FC<IssuesSectionProps> = ({ businessId, issues, areas }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<{ el: HTMLElement; issueId: string } | null>(null);

  const openIssues = issues.filter((i) => i.status !== 'resolved');
  const resolvedIssues = issues.filter((i) => i.status === 'resolved');

  const sortedIssues = [
    ...openIssues.sort((a, b) => {
      const order: IssueSeverity[] = ['critical', 'high', 'medium', 'low'];
      return order.indexOf(a.severity) - order.indexOf(b.severity);
    }),
    ...resolvedIssues,
  ];

  const handleAddOpen = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, areaId: areas[0]?.id ?? '' });
    setDialogOpen(true);
  };

  const handleEditOpen = (issue: OperationalIssue) => {
    setEditingId(issue.id);
    setForm({
      title: issue.title,
      description: issue.description ?? '',
      severity: issue.severity,
      status: issue.status,
      areaId: issue.areaId,
      owner: issue.owner ?? '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.areaId) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      severity: form.severity,
      status: form.status,
      areaId: form.areaId,
      owner: form.owner.trim() || undefined,
    };
    if (editingId) {
      dispatch(updateIssue({ businessId, issueId: editingId, updates: payload }));
    } else {
      dispatch(addIssue({ businessId, issue: payload }));
    }
    setDialogOpen(false);
  };

  const handleDelete = (issueId: string) => {
    dispatch(deleteIssue({ businessId, issueId }));
  };

  const handleStatusChange = (issueId: string, status: IssueStatus) => {
    dispatch(updateIssueStatus({ businessId, issueId, status }));
    setStatusMenuAnchor(null);
  };

  const getAreaName = (areaId: string) =>
    areas.find((a) => a.id === areaId)?.name ?? 'General';

  const getSeverityConfig = (severity: IssueSeverity) =>
    SEVERITY_OPTIONS.find((s) => s.value === severity)!;

  const getStatusConfig = (status: IssueStatus) =>
    STATUS_OPTIONS.find((s) => s.value === status)!;

  const severityBorderColor = (severity: IssueSeverity) => {
    if (severity === 'critical') return alpha(theme.palette.error.main, 0.4);
    if (severity === 'high') return alpha(theme.palette.warning.main, 0.5);
    return theme.palette.divider;
  };

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <IssueIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Issues & Bottlenecks
            </Typography>
            {openIssues.length > 0 && (
              <Chip
                label={`${openIssues.length} open`}
                size="small"
                color={openIssues.some((i) => i.severity === 'critical') ? 'error' : 'warning'}
                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600, '& .MuiChip-label': { px: 0.75 } }}
              />
            )}
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
            sx={{ borderRadius: 2, height: 30, fontSize: '0.75rem' }}
          >
            Log Issue
          </Button>
        </Box>

        {issues.length === 0 ? (
          <Box py={5} textAlign="center">
            <IssueIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" mb={1}>
              No issues logged. Good sign!
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddOpen}>
              Log an Issue
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            {sortedIssues.map((issue) => {
              const severityCfg = getSeverityConfig(issue.severity);
              const statusCfg = getStatusConfig(issue.status);
              const isHovered = hoveredId === issue.id;
              const isResolved = issue.status === 'resolved';

              return (
                <Box
                  key={issue.id}
                  px={1.5}
                  py={1.25}
                  borderRadius={2}
                  border={`1px solid ${severityBorderColor(issue.severity)}`}
                  bgcolor={
                    isResolved
                      ? 'transparent'
                      : issue.severity === 'critical'
                      ? alpha(theme.palette.error.main, 0.04)
                      : issue.severity === 'high'
                      ? alpha(theme.palette.warning.main, 0.04)
                      : 'transparent'
                  }
                  display="flex"
                  alignItems="flex-start"
                  gap={1.5}
                  onMouseEnter={() => setHoveredId(issue.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{
                    opacity: isResolved ? 0.6 : 1,
                    transition: 'opacity 0.12s ease',
                  }}
                >
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.25}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {issue.title}
                      </Typography>
                      <Chip
                        label={severityCfg.label}
                        size="small"
                        color={severityCfg.color}
                        sx={{
                          height: 18,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                      <Chip
                        label={statusCfg.label}
                        size="small"
                        color={statusCfg.color}
                        onClick={(e) =>
                          setStatusMenuAnchor({ el: e.currentTarget as HTMLElement, issueId: issue.id })
                        }
                        deleteIcon={<ChevronIcon />}
                        onDelete={(e) =>
                          setStatusMenuAnchor({ el: e.currentTarget as HTMLElement, issueId: issue.id })
                        }
                        sx={{
                          height: 18,
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          '& .MuiChip-label': { px: 0.75 },
                          '& .MuiChip-deleteIcon': { fontSize: 12 },
                        }}
                      />
                    </Box>
                    {issue.description && (
                      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                        {issue.description}
                      </Typography>
                    )}
                    <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                      <Typography variant="caption" color="text.secondary">
                        {getAreaName(issue.areaId)}
                      </Typography>
                      {issue.owner && (
                        <>
                          <Typography variant="caption" color="text.disabled">·</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {issue.owner}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.25}
                    flexShrink={0}
                    sx={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.12s ease' }}
                  >
                    <Tooltip title="Edit issue">
                      <IconButton
                        size="small"
                        onClick={() => handleEditOpen(issue)}
                        sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                      >
                        <EditIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete issue">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(issue.id)}
                        sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
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

      <Menu
        anchorEl={statusMenuAnchor?.el}
        open={Boolean(statusMenuAnchor)}
        onClose={() => setStatusMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 140 } }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() =>
              statusMenuAnchor && handleStatusChange(statusMenuAnchor.issueId, opt.value)
            }
            sx={{ fontSize: '0.8rem', py: 0.75 }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {editingId ? 'Edit Issue' : 'Log New Issue'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {editingId
              ? 'Update this operational issue.'
              : 'Document a bottleneck or operational problem.'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Issue Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              autoFocus
              fullWidth
              size="small"
              placeholder="e.g. Delayed supplier shipments, Weekend staffing gap"
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder="Describe the issue and its impact on operations"
            />
            <Box display="flex" gap={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Operational Area</InputLabel>
                <Select
                  value={form.areaId}
                  label="Operational Area"
                  onChange={(e) => setForm((f) => ({ ...f, areaId: e.target.value }))}
                >
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={form.severity}
                  label="Severity"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, severity: e.target.value as IssueSeverity }))
                  }
                >
                  {SEVERITY_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status}
                  label="Status"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as IssueStatus }))
                  }
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Owner"
                value={form.owner}
                onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                fullWidth
                size="small"
                placeholder="e.g. Jordan Lee"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
          <Button variant="outlined" onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.title.trim() || !form.areaId}
            sx={{ borderRadius: 2 }}
          >
            {editingId ? 'Save Changes' : 'Log Issue'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default IssuesSection;
