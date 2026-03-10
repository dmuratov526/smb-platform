import React, { useState, useMemo } from 'react';
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
  RepeatOutlined as RecurringIcon,
  ExpandMore as ChevronIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import {
  addRecurringTask,
  updateRecurringTask,
  updateRecurringTaskStatus,
  deleteRecurringTask,
} from '../slice';
import {
  RecurringTask,
  RecurringTaskStatus,
  RecurringTaskFrequency,
  OperationalArea,
} from '../types';

interface RecurringTasksSectionProps {
  businessId: string;
  tasks: RecurringTask[];
  areas: OperationalArea[];
}

type TaskStatusOption = { value: RecurringTaskStatus; label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'error' };

const STATUS_OPTIONS: TaskStatusOption[] = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'in_progress', label: 'In Progress', color: 'primary' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'overdue', label: 'Overdue', color: 'error' },
];

const FREQUENCY_OPTIONS: { value: RecurringTaskFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
];

const DUE_OPTIONS = ['Today', 'Tomorrow', 'This Week', 'This Month', 'Overdue'];

const EMPTY_FORM = {
  title: '',
  description: '',
  frequency: 'weekly' as RecurringTaskFrequency,
  status: 'pending' as RecurringTaskStatus,
  nextDue: 'This Week',
  areaId: '',
  owner: '',
};

const RecurringTasksSection: React.FC<RecurringTasksSectionProps> = ({
  businessId,
  tasks,
  areas,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<{ el: HTMLElement; taskId: string } | null>(null);

  const sortedTasks = useMemo(() => {
    const order: RecurringTaskStatus[] = ['overdue', 'in_progress', 'pending', 'completed'];
    return [...tasks].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
  }, [tasks]);

  const handleAddOpen = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, areaId: areas[0]?.id ?? '' });
    setDialogOpen(true);
  };

  const handleEditOpen = (task: RecurringTask) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? '',
      frequency: task.frequency,
      status: task.status,
      nextDue: task.nextDue,
      areaId: task.areaId,
      owner: task.owner ?? '',
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.areaId) return;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      frequency: form.frequency,
      status: form.status,
      nextDue: form.nextDue,
      areaId: form.areaId,
      owner: form.owner.trim() || undefined,
    };
    if (editingId) {
      dispatch(updateRecurringTask({ businessId, taskId: editingId, updates: payload }));
    } else {
      dispatch(addRecurringTask({ businessId, task: payload }));
    }
    setDialogOpen(false);
  };

  const handleDelete = (taskId: string) => {
    dispatch(deleteRecurringTask({ businessId, taskId }));
  };

  const handleStatusChange = (taskId: string, status: RecurringTaskStatus) => {
    dispatch(updateRecurringTaskStatus({ businessId, taskId, status }));
    setStatusMenuAnchor(null);
  };

  const getAreaName = (areaId: string) =>
    areas.find((a) => a.id === areaId)?.name ?? 'General';

  const getStatusConfig = (status: RecurringTaskStatus) =>
    STATUS_OPTIONS.find((s) => s.value === status)!;

  const frequencyLabel = (freq: RecurringTaskFrequency) =>
    FREQUENCY_OPTIONS.find((f) => f.value === freq)?.label ?? freq;

  return (
    <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <RecurringIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Recurring Tasks
            </Typography>
            <Chip
              label={tasks.length}
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
            />
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
            sx={{ borderRadius: 2, height: 30, fontSize: '0.75rem' }}
          >
            Add Task
          </Button>
        </Box>

        {tasks.length === 0 ? (
          <Box py={5} textAlign="center">
            <RecurringIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary" mb={1}>
              No recurring tasks defined yet.
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddOpen}>
              Add First Task
            </Button>
          </Box>
        ) : (
          <Box>
            {sortedTasks.map((task, idx) => {
              const statusCfg = getStatusConfig(task.status);
              const isHovered = hoveredId === task.id;
              return (
                <Box
                  key={task.id}
                  py={1.5}
                  px={1}
                  borderTop={idx > 0 ? `1px solid ${theme.palette.divider}` : 'none'}
                  display="flex"
                  alignItems="flex-start"
                  gap={1.5}
                  borderRadius={1}
                  bgcolor={
                    task.status === 'overdue'
                      ? alpha(theme.palette.error.main, 0.03)
                      : isHovered
                      ? alpha(theme.palette.primary.main, 0.02)
                      : 'transparent'
                  }
                  onMouseEnter={() => setHoveredId(task.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{ transition: 'background-color 0.12s ease' }}
                >
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.25}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {task.title}
                      </Typography>
                      <Chip
                        label={statusCfg.label}
                        size="small"
                        color={statusCfg.color}
                        onClick={(e) =>
                          setStatusMenuAnchor({ el: e.currentTarget as HTMLElement, taskId: task.id })
                        }
                        deleteIcon={<ChevronIcon />}
                        onDelete={(e) =>
                          setStatusMenuAnchor({ el: e.currentTarget as HTMLElement, taskId: task.id })
                        }
                        sx={{
                          height: 20,
                          fontSize: '0.63rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          '& .MuiChip-label': { px: 0.75 },
                          '& .MuiChip-deleteIcon': { fontSize: 13 },
                        }}
                      />
                    </Box>
                    {task.description && (
                      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                        {task.description}
                      </Typography>
                    )}
                    <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                      <Typography variant="caption" color="text.secondary">
                        {getAreaName(task.areaId)}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">·</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {frequencyLabel(task.frequency)}
                      </Typography>
                      {task.nextDue && (
                        <>
                          <Typography variant="caption" color="text.disabled">·</Typography>
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color={
                              task.status === 'overdue'
                                ? 'error.main'
                                : task.nextDue === 'Today' || task.nextDue === 'Tomorrow'
                                ? 'warning.main'
                                : 'text.secondary'
                            }
                          >
                            {task.nextDue}
                          </Typography>
                        </>
                      )}
                      {task.owner && (
                        <>
                          <Typography variant="caption" color="text.disabled">·</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {task.owner}
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
                    <Tooltip title="Edit task">
                      <IconButton
                        size="small"
                        onClick={() => handleEditOpen(task)}
                        sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                      >
                        <EditIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete task">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(task.id)}
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
              statusMenuAnchor && handleStatusChange(statusMenuAnchor.taskId, opt.value)
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
            {editingId ? 'Edit Recurring Task' : 'Add Recurring Task'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {editingId
              ? 'Update this recurring operational task.'
              : 'Define a recurring task for your operations.'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Task Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              autoFocus
              fullWidth
              size="small"
              placeholder="e.g. Weekly Stock Check, Daily Opening Checklist"
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="Briefly describe what this task involves"
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
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={form.frequency}
                  label="Frequency"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, frequency: e.target.value as RecurringTaskFrequency }))
                  }
                >
                  {FREQUENCY_OPTIONS.map((opt) => (
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
                    setForm((f) => ({ ...f, status: e.target.value as RecurringTaskStatus }))
                  }
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel>Due</InputLabel>
                <Select
                  value={form.nextDue}
                  label="Due"
                  onChange={(e) => setForm((f) => ({ ...f, nextDue: e.target.value }))}
                >
                  {DUE_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
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
            {editingId ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RecurringTasksSection;
