import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { OnboardingField } from '../../../types';

interface DynamicFieldRendererProps {
  field: OnboardingField;
  value: string | string[];
  onChange: (fieldId: string, value: string | string[]) => void;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
}) => {
  const stringValue = typeof value === 'string' ? value : '';
  const arrayValue = Array.isArray(value) ? value : [];

  switch (field.type) {
    case 'text':
      return (
        <TextField
          fullWidth
          label={field.label}
          value={stringValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          helperText={field.helperText}
          required={field.required}
          variant="outlined"
          size="small"
        />
      );

    case 'textarea':
      return (
        <TextField
          fullWidth
          multiline
          rows={3}
          label={field.label}
          value={stringValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          helperText={field.helperText}
          required={field.required}
          variant="outlined"
          size="small"
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          type="number"
          label={field.label}
          value={stringValue}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          helperText={field.helperText}
          required={field.required}
          variant="outlined"
          size="small"
        />
      );

    case 'select':
      return (
        <FormControl fullWidth size="small" required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={stringValue}
            label={field.label}
            onChange={(e) => onChange(field.id, e.target.value)}
          >
            {field.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {field.helperText && <FormHelperText>{field.helperText}</FormHelperText>}
        </FormControl>
      );

    case 'multiselect':
      return (
        <FormControl fullWidth size="small" required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            multiple
            value={arrayValue}
            label={field.label}
            onChange={(e) => {
              const val = e.target.value;
              onChange(field.id, typeof val === 'string' ? val.split(',') : val);
            }}
            input={<OutlinedInput label={field.label} />}
            renderValue={(selected) => {
              const labels = (selected as string[])
                .map((v) => field.options?.find((o) => o.value === v)?.label ?? v)
                .join(', ');
              return (
                <Typography variant="body2" noWrap>
                  {labels}
                </Typography>
              );
            }}
          >
            {field.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Checkbox size="small" checked={arrayValue.includes(opt.value)} />
                <ListItemText primary={opt.label} />
              </MenuItem>
            ))}
          </Select>
          {field.helperText && <FormHelperText>{field.helperText}</FormHelperText>}
        </FormControl>
      );

    default:
      return (
        <Box>
          <Typography variant="caption" color="text.secondary">
            Unsupported field type: {field.type}
          </Typography>
        </Box>
      );
  }
};

export default DynamicFieldRenderer;
