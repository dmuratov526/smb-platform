import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  Collapse,
  IconButton,
  LinearProgress,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckIcon,
  Add as AddIcon,
  Check as SaveIcon,
  Close as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewColumn as PhaseIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { LaunchPhase, PlannerTask, PlannerTaskStatus } from '../types';
import LaunchTaskCard from './LaunchTaskCard';

interface PhaseForm {
  name: string;
  description: string;
}

const EMPTY_PHASE_FORM: PhaseForm = { name: '', description: '' };

interface LaunchTaskListProps {
  phases: LaunchPhase[];
  activePhaseIndex: number;
  onTaskStatusChange: (phaseId: string, taskId: string, status: PlannerTaskStatus) => void;
  onTaskEdit: (phaseId: string, taskId: string, updates: Partial<Omit<PlannerTask, 'id' | 'phaseId'>>) => void;
  onTaskDelete: (phaseId: string, taskId: string) => void;
  onTaskAdd: (phaseId: string, task: Omit<PlannerTask, 'id' | 'phaseId'>) => void;
  onPhaseEdit: (phaseId: string, updates: Partial<Pick<LaunchPhase, 'name' | 'description'>>) => void;
  onPhaseDelete: (phaseId: string) => void;
  onPhaseAdd: (phase: Omit<LaunchPhase, 'id' | 'order' | 'tasks'>) => void;
}

const LaunchTaskList: React.FC<LaunchTaskListProps> = ({
  phases,
  activePhaseIndex,
  onTaskStatusChange,
  onTaskEdit,
  onTaskDelete,
  onTaskAdd,
  onPhaseEdit,
  onPhaseDelete,
  onPhaseAdd,
}) => {
  const theme = useTheme();
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    phases.forEach((phase, index) => {
      initial[phase.id] = index <= activePhaseIndex + 1;
    });
    return initial;
  });

  const [addingPhaseId, setAddingPhaseId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [hoveredPhaseId, setHoveredPhaseId] = useState<string | null>(null);
  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [phaseForm, setPhaseForm] = useState<PhaseForm>(EMPTY_PHASE_FORM);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handlePhaseEditOpen = (phase: LaunchPhase, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPhaseId(phase.id);
    setPhaseForm({ name: phase.name, description: phase.description });
    setPhaseDialogOpen(true);
  };

  const handlePhaseAddOpen = () => {
    setEditingPhaseId(null);
    setPhaseForm(EMPTY_PHASE_FORM);
    setPhaseDialogOpen(true);
  };

  const handlePhaseDialogSave = () => {
    if (!phaseForm.name.trim()) return;
    if (editingPhaseId) {
      onPhaseEdit(editingPhaseId, {
        name: phaseForm.name.trim(),
        description: phaseForm.description.trim(),
      });
    } else {
      onPhaseAdd({
        name: phaseForm.name.trim(),
        description: phaseForm.description.trim(),
      });
    }
    setPhaseDialogOpen(false);
  };

  const handlePhaseDeleteClick = (phaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPhaseDelete(phaseId);
  };

  const handleAddStart = (phaseId: string) => {
    setNewTitle('');
    setNewDescription('');
    setAddingPhaseId(phaseId);
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: true }));
  };

  const handleAddSave = (phaseId: string) => {
    if (!newTitle.trim()) return;
    onTaskAdd(phaseId, {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      status: 'not_started',
    });
    setAddingPhaseId(null);
  };

  const handleAddCancel = () => {
    setAddingPhaseId(null);
  };

  const handleAddKeyDown = (e: React.KeyboardEvent, phaseId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddSave(phaseId);
    }
    if (e.key === 'Escape') {
      handleAddCancel();
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {phases.map((phase, index) => {
        const isPhaseHovered = hoveredPhaseId === phase.id;
        const completedCount = phase.tasks.filter((t) => t.status === 'completed').length;
        const inProgressCount = phase.tasks.filter((t) => t.status === 'in_progress').length;
        const totalCount = phase.tasks.length;
        const phasePercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        const isComplete = phasePercent === 100;
        const isActive = index === activePhaseIndex;
        const isExpanded = expandedPhases[phase.id] ?? false;

        const headerColor = isComplete
          ? theme.palette.success.main
          : isActive
          ? theme.palette.primary.main
          : theme.palette.text.disabled;

        const headerBg = isComplete
          ? alpha(theme.palette.success.main, 0.05)
          : isActive
          ? alpha(theme.palette.primary.main, 0.05)
          : 'transparent';

        const borderColor = isComplete
          ? alpha(theme.palette.success.main, 0.25)
          : isActive
          ? alpha(theme.palette.primary.main, 0.25)
          : theme.palette.divider;

        return (
          <Card
            key={phase.id}
            elevation={0}
            sx={{
              border: `1px solid ${borderColor}`,
              borderRadius: 2,
              overflow: 'hidden',
              outline: isActive
                ? `2px solid ${alpha(theme.palette.primary.main, 0.15)}`
                : 'none',
              outlineOffset: 1,
            }}
          >
            {/* Phase header */}
            <Box
              display="flex"
              alignItems="center"
              px={2.5}
              py={1.75}
              bgcolor={headerBg}
              onMouseEnter={() => setHoveredPhaseId(phase.id)}
              onMouseLeave={() => setHoveredPhaseId(null)}
              sx={{
                cursor: 'pointer',
                borderBottom: isExpanded ? `1px solid ${borderColor}` : 'none',
                bgcolor: isPhaseHovered ? alpha(headerColor, 0.06) : headerBg,
                transition: 'background-color 0.15s ease',
              }}
              onClick={() => togglePhase(phase.id)}
            >
              {/* Phase number badge */}
              <Box
                width={26}
                height={26}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                mr={1.5}
                bgcolor={
                  isComplete
                    ? 'success.main'
                    : isActive
                    ? 'primary.main'
                    : alpha(theme.palette.text.secondary, 0.15)
                }
              >
                {isComplete ? (
                  <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: isActive ? '#fff' : 'text.secondary',
                      lineHeight: 1,
                    }}
                  >
                    {index + 1}
                  </Typography>
                )}
              </Box>

              {/* Phase info */}
              <Box flex={1} minWidth={0}>
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ color: isActive || isComplete ? 'text.primary' : 'text.secondary' }}
                  >
                    {phase.name}
                  </Typography>
                  {isActive && !isComplete && (
                    <Chip
                      label="Current Phase"
                      size="small"
                      color="primary"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                  {isComplete && (
                    <Chip
                      label="Complete"
                      size="small"
                      color="success"
                      sx={{
                        height: 18,
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {phase.description}
                </Typography>
              </Box>

              {/* Progress stats and toggle */}
              <Box display="flex" alignItems="center" gap={1.5} ml={2} flexShrink={0}>
                <Box textAlign="right">
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{ color: headerColor, fontSize: '0.75rem' }}
                  >
                    {phasePercent}%
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" sx={{ fontSize: '0.65rem' }}>
                    {completedCount}/{totalCount}
                    {inProgressCount > 0 && ` · ${inProgressCount} active`}
                  </Typography>
                </Box>

                <Box sx={{ width: 60 }}>
                  <LinearProgress
                    variant="determinate"
                    value={phasePercent}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: alpha(headerColor, 0.12),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: headerColor,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                {/* Phase edit / delete — visible on hover */}
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ opacity: isPhaseHovered ? 1 : 0, transition: 'opacity 0.12s ease' }}
                >
                  <Tooltip title="Edit phase">
                    <IconButton
                      size="small"
                      onClick={(e) => handlePhaseEditOpen(phase, e)}
                      sx={{ p: 0.4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    >
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete phase">
                    <IconButton
                      size="small"
                      onClick={(e) => handlePhaseDeleteClick(phase.id, e)}
                      sx={{ p: 0.4, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                <IconButton size="small" sx={{ p: 0.25 }}>
                  {isExpanded ? (
                    <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  )}
                </IconButton>
              </Box>
            </Box>

            {/* Task list */}
            <Collapse in={isExpanded} timeout="auto">
              <Box>
                {phase.tasks.map((task) => (
                  <LaunchTaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(taskId, status) =>
                      onTaskStatusChange(phase.id, taskId, status)
                    }
                    onEdit={(taskId, updates) => onTaskEdit(phase.id, taskId, updates)}
                    onDelete={(taskId) => onTaskDelete(phase.id, taskId)}
                  />
                ))}

                {/* Inline add task form */}
                {addingPhaseId === phase.id ? (
                  <Box
                    px={2}
                    py={1.5}
                    bgcolor={alpha(theme.palette.primary.main, 0.03)}
                    borderTop={`1px solid ${alpha(theme.palette.primary.main, 0.12)}`}
                  >
                    <TextField
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => handleAddKeyDown(e, phase.id)}
                      placeholder="New task title"
                      size="small"
                      fullWidth
                      autoFocus
                      variant="outlined"
                      sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.875rem', fontWeight: 500 } }}
                    />
                    <TextField
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      onKeyDown={(e) => handleAddKeyDown(e, phase.id)}
                      placeholder="Description (optional)"
                      size="small"
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
                    />
                    <Box display="flex" justifyContent="flex-end" gap={0.75}>
                      <Tooltip title="Cancel (Esc)">
                        <IconButton size="small" onClick={handleAddCancel} sx={{ color: 'text.secondary' }}>
                          <CancelIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save (Enter)">
                        <IconButton
                          size="small"
                          onClick={() => handleAddSave(phase.id)}
                          disabled={!newTitle.trim()}
                          sx={{ color: 'primary.main' }}
                        >
                          <SaveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    px={2}
                    py={1.25}
                    display="flex"
                    alignItems="center"
                    gap={0.75}
                    borderTop={`1px solid ${theme.palette.divider}`}
                    sx={{
                      cursor: 'pointer',
                      color: 'text.disabled',
                      transition: 'color 0.12s ease, background-color 0.12s ease',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                      },
                    }}
                    onClick={() => handleAddStart(phase.id)}
                  >
                    <AddIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                      Add task
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Card>
        );
      })}

      {/* Add Phase button */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        px={2}
        py={1.5}
        borderRadius={2}
        border={`1.5px dashed ${alpha(theme.palette.primary.main, 0.25)}`}
        sx={{
          cursor: 'pointer',
          color: 'text.disabled',
          transition: 'all 0.15s ease',
          '&:hover': {
            color: 'primary.main',
            borderColor: alpha(theme.palette.primary.main, 0.5),
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          },
        }}
        onClick={handlePhaseAddOpen}
      >
        <AddIcon sx={{ fontSize: 16 }} />
        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
          Add phase
        </Typography>
      </Box>

      {/* Phase add / edit dialog */}
      <Dialog
        open={phaseDialogOpen}
        onClose={() => setPhaseDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              width={36}
              height={36}
              borderRadius={2}
              bgcolor={alpha(theme.palette.primary.main, 0.1)}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <PhaseIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {editingPhaseId ? 'Edit Phase' : 'Add Phase'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {editingPhaseId
                  ? 'Update the name and description for this phase.'
                  : 'Define a new milestone phase for this launch plan.'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: '20px !important' }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Phase Name"
              value={phaseForm.name}
              onChange={(e) => setPhaseForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePhaseDialogSave();
              }}
              required
              autoFocus
              fullWidth
              size="small"
              placeholder="e.g. Pre-Launch, Marketing Readiness"
            />
            <TextField
              label="Description"
              value={phaseForm.description}
              onChange={(e) => setPhaseForm((f) => ({ ...f, description: e.target.value }))}
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="Briefly describe what this phase covers"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setPhaseDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePhaseDialogSave}
            disabled={!phaseForm.name.trim()}
            sx={{ borderRadius: 2 }}
          >
            {editingPhaseId ? 'Save Changes' : 'Add Phase'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LaunchTaskList;
