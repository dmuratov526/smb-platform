import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  PlayCircleOutline as InProgressIcon,
  RadioButtonUnchecked as NotStartedIcon,
  Block as BlockedIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as SaveIcon,
  Close as CancelIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { PlannerTask, PlannerTaskStatus } from '../types';

interface LaunchTaskCardProps {
  task: PlannerTask;
  onStatusChange: (taskId: string, status: PlannerTaskStatus) => void;
  onEdit: (taskId: string, updates: Partial<Omit<PlannerTask, 'id' | 'phaseId'>>) => void;
  onDelete: (taskId: string) => void;
}

const STATUS_CONFIG: Record<
  PlannerTaskStatus,
  {
    label: string;
    chipColor: 'success' | 'primary' | 'default' | 'error';
    icon: React.ReactNode;
  }
> = {
  completed: {
    label: 'Completed',
    chipColor: 'success',
    icon: <CompletedIcon sx={{ fontSize: 16 }} />,
  },
  in_progress: {
    label: 'In Progress',
    chipColor: 'primary',
    icon: <InProgressIcon sx={{ fontSize: 16 }} />,
  },
  not_started: {
    label: 'Not Started',
    chipColor: 'default',
    icon: <NotStartedIcon sx={{ fontSize: 16 }} />,
  },
  blocked: {
    label: 'Blocked',
    chipColor: 'error',
    icon: <BlockedIcon sx={{ fontSize: 16 }} />,
  },
};

const LaunchTaskCard: React.FC<LaunchTaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editDueTiming, setEditDueTiming] = useState('');

  const config = STATUS_CONFIG[task.status];
  const isCompleted = task.status === 'completed';
  const isBlocked = task.status === 'blocked';

  const cardBg = isCompleted
    ? alpha(theme.palette.success.main, 0.03)
    : isBlocked
    ? alpha(theme.palette.error.main, 0.03)
    : 'transparent';

  const cardBgHover = isCompleted
    ? alpha(theme.palette.success.main, 0.06)
    : alpha(theme.palette.primary.main, 0.03);

  const borderColor = isCompleted
    ? alpha(theme.palette.success.main, 0.15)
    : isBlocked
    ? alpha(theme.palette.error.main, 0.15)
    : theme.palette.divider;

  const handleStatusChange = (event: SelectChangeEvent<PlannerTaskStatus>) => {
    onStatusChange(task.id, event.target.value as PlannerTaskStatus);
  };

  const handleEditStart = () => {
    setEditTitle(task.title);
    setEditDescription(task.description ?? '');
    setEditOwner(task.owner ?? '');
    setEditDueTiming(task.dueTiming ?? '');
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (!editTitle.trim()) return;
    onEdit(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      owner: editOwner.trim() || undefined,
      dueTiming: editDueTiming.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  if (isEditing) {
    return (
      <Box
        px={2}
        py={1.5}
        bgcolor={alpha(theme.palette.primary.main, 0.03)}
        borderBottom={`1px solid ${alpha(theme.palette.primary.main, 0.15)}`}
        sx={{ '&:last-child': { borderBottom: 'none' } }}
      >
        <TextField
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task title"
          size="small"
          fullWidth
          autoFocus
          variant="outlined"
          sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.875rem', fontWeight: 500 } }}
        />
        <TextField
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Description (optional)"
          size="small"
          fullWidth
          variant="outlined"
          sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
        />
        <Box display="flex" gap={1} mb={1}>
          <TextField
            value={editOwner}
            onChange={(e) => setEditOwner(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Owner (optional)"
            size="small"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <PersonIcon sx={{ fontSize: 14, color: 'text.disabled', mr: 0.5 }} />
              ),
            }}
            sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
          />
          <TextField
            value={editDueTiming}
            onChange={(e) => setEditDueTiming(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Timing (e.g. Week 2)"
            size="small"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <TimeIcon sx={{ fontSize: 14, color: 'text.disabled', mr: 0.5 }} />
              ),
            }}
            sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={0.75}>
          <Tooltip title="Cancel (Esc)">
            <IconButton size="small" onClick={handleEditCancel} sx={{ color: 'text.secondary' }}>
              <CancelIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save (Enter)">
            <IconButton
              size="small"
              onClick={handleEditSave}
              disabled={!editTitle.trim()}
              sx={{ color: 'primary.main' }}
            >
              <SaveIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      px={2}
      py={1.5}
      bgcolor={isHovered ? cardBgHover : cardBg}
      borderBottom={`1px solid ${borderColor}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        transition: 'background-color 0.12s ease',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={1.5}>
        {/* Status icon */}
        <Box
          display="flex"
          alignItems="center"
          pt={0.25}
          flexShrink={0}
          sx={{
            color: isCompleted
              ? 'success.main'
              : isBlocked
              ? 'error.main'
              : task.status === 'in_progress'
              ? 'primary.main'
              : 'text.disabled',
          }}
        >
          {config.icon}
        </Box>

        {/* Content */}
        <Box flex={1} minWidth={0}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
            <Typography
              variant="body2"
              fontWeight={isCompleted ? 400 : 500}
              sx={{
                color: isCompleted ? 'text.secondary' : 'text.primary',
                textDecoration: isCompleted ? 'line-through' : 'none',
                flex: 1,
                minWidth: 0,
                pt: 0.1,
              }}
            >
              {task.title}
            </Typography>

            <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
              {/* Edit / Delete — visible on hover */}
              {isHovered && (
                <>
                  <Tooltip title="Edit task">
                    <IconButton
                      size="small"
                      onClick={handleEditStart}
                      sx={{ p: 0.4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    >
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete task">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(task.id)}
                      sx={{ p: 0.4, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {/* Status selector */}
              <FormControl size="small" sx={{ flexShrink: 0 }}>
                <Select
                  value={task.status}
                  onChange={handleStatusChange}
                  renderValue={(value) => (
                    <Chip
                      label={STATUS_CONFIG[value as PlannerTaskStatus].label}
                      size="small"
                      color={STATUS_CONFIG[value as PlannerTaskStatus].chipColor}
                      variant={value === 'completed' ? 'filled' : 'outlined'}
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { p: 0 },
                    '& .MuiSelect-icon': { display: 'none' },
                    bgcolor: 'transparent',
                  }}
                >
                  <MenuItem value="not_started">
                    <Box display="flex" alignItems="center" gap={1}>
                      <NotStartedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      <Typography variant="caption">Not Started</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="in_progress">
                    <Box display="flex" alignItems="center" gap={1}>
                      <InProgressIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                      <Typography variant="caption">In Progress</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CompletedIcon sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography variant="caption">Completed</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="blocked">
                    <Box display="flex" alignItems="center" gap={1}>
                      <BlockedIcon sx={{ fontSize: 14, color: 'error.main' }} />
                      <Typography variant="caption">Blocked</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {task.description && (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block', mt: 0.25 }}>
              {task.description}
            </Typography>
          )}

          {(task.dueTiming || task.owner) && (
            <Box display="flex" alignItems="center" gap={1.5} mt={0.5} flexWrap="wrap">
              {task.dueTiming && (
                <Box display="flex" alignItems="center" gap={0.4}>
                  <TimeIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
                    {task.dueTiming}
                  </Typography>
                </Box>
              )}
              {task.owner && (
                <Box display="flex" alignItems="center" gap={0.4}>
                  <PersonIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
                    {task.owner}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LaunchTaskCard;
