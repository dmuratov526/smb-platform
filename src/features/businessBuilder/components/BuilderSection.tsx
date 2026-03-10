import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  CheckOutlined as SaveIcon,
  CloseOutlined as CancelIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

interface BuilderSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor: string;
  isEditing: boolean;
  completeness: number;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const BuilderSection: React.FC<BuilderSectionProps> = ({
  title,
  subtitle,
  icon,
  iconColor,
  isEditing,
  completeness,
  onEdit,
  onSave,
  onCancel,
  children,
}) => {
  const theme = useTheme();

  const completenessColor =
    completeness === 100 ? 'success' : completeness >= 50 ? 'primary' : 'warning';

  return (
    <Card
      elevation={0}
      sx={{
        border: `1.5px solid ${isEditing ? iconColor + '55' : theme.palette.divider}`,
        borderRadius: 2,
        transition: 'border-color 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Section Header */}
      <Box
        px={2.5}
        pt={2.5}
        pb={1.5}
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1.5} minWidth={0}>
          <Box
            width={36}
            height={36}
            borderRadius={1.5}
            bgcolor={alpha(iconColor, 0.1)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Box sx={{ color: iconColor, display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          </Box>
          <Box minWidth={0}>
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.3}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
          <Chip
            label={`${completeness}%`}
            size="small"
            color={completenessColor}
            variant={completeness === 100 ? 'filled' : 'outlined'}
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
          {isEditing ? (
            <Box display="flex" gap={0.5}>
              <Button
                size="small"
                variant="contained"
                startIcon={<SaveIcon sx={{ fontSize: '0.9rem !important' }} />}
                onClick={onSave}
                sx={{
                  minWidth: 0,
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  bgcolor: iconColor,
                  '&:hover': { bgcolor: iconColor, filter: 'brightness(0.9)' },
                }}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CancelIcon sx={{ fontSize: '0.9rem !important' }} />}
                onClick={onCancel}
                sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: '0.75rem' }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: '0.9rem !important' }} />}
              onClick={onEdit}
              sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: '0.75rem' }}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>

      {completeness < 100 && (
        <LinearProgress
          variant="determinate"
          value={completeness}
          color={completenessColor}
          sx={{ height: 2, mx: 2.5, borderRadius: 1, mb: 0.5 }}
        />
      )}

      <Divider />

      <CardContent sx={{ p: 2.5, pt: 2, flex: 1 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default BuilderSection;
