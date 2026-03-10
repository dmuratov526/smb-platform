import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

interface FieldRowProps {
  label: string;
  value: string | number | null;
  editing: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'number';
  prefix?: string;
  suffix?: string;
  hint?: string;
}

const FieldRow: React.FC<FieldRowProps> = ({
  label,
  value,
  editing,
  onChange,
  placeholder,
  multiline = false,
  rows = 2,
  type = 'text',
  prefix,
  suffix,
  hint,
}) => {
  const theme = useTheme();

  const displayValue =
    value !== null && value !== undefined && value !== ''
      ? `${prefix ?? ''}${value}${suffix ?? ''}`
      : null;

  if (!editing) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        py={1}
        sx={{
          '&:not(:last-child)': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Typography
          variant="caption"
          color="text.disabled"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing="0.05em"
          mb={0.4}
        >
          {label}
        </Typography>
        {displayValue ? (
          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {displayValue}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ fontStyle: 'italic' }}
          >
            {placeholder ?? 'Not specified'}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box mb={1.5}>
      <TextField
        label={label}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        type={type}
        fullWidth
        size="small"
        variant="outlined"
        helperText={hint}
        InputProps={{
          startAdornment: prefix ? (
            <InputAdornment position="start">
              <Typography variant="body2" color="text.secondary">
                {prefix}
              </Typography>
            </InputAdornment>
          ) : undefined,
          endAdornment: suffix ? (
            <InputAdornment position="end">
              <Typography variant="body2" color="text.secondary">
                {suffix}
              </Typography>
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          },
        }}
      />
    </Box>
  );
};

export default FieldRow;
