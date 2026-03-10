import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { CheckCircleOutline as CheckIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppSelector } from '../../../app/hooks';
import { getCategoryByKey } from '../config/categories';
import { getStepsForCategory } from '../config/steps';
import { BusinessCategoryKey } from '../../../types';

const formatFieldValue = (value: string | string[]): string => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '—';
  }
  return value || '—';
};

const formatFieldLabel = (fieldId: string): string => {
  return fieldId
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
};

interface ReviewSectionProps {
  title: string;
  stepIndex: number;
  fields: Record<string, string | string[]>;
  fieldLabels?: Record<string, string>;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, stepIndex, fields, fieldLabels }) => {
  const theme = useTheme();
  const entries = Object.entries(fields).filter(([, v]) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v)
  );

  if (entries.length === 0) return null;

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, overflow: 'hidden' }}
    >
      <Box
        px={2.5}
        py={1.5}
        bgcolor={alpha(theme.palette.primary.main, 0.04)}
        borderBottom={`1px solid ${theme.palette.divider}`}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={`Step ${stepIndex}`}
            size="small"
            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </Box>
      <Box px={2.5} py={1.5}>
        <Grid container spacing={1.5}>
          {entries.map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Typography variant="caption" color="text.secondary" display="block">
                {fieldLabels?.[key] ?? formatFieldLabel(key)}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {formatFieldValue(value)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

const StepReview: React.FC = () => {
  const theme = useTheme();
  const draft = useAppSelector((s) => s.onboarding.draft);

  const category = draft.category as BusinessCategoryKey | '';
  const categoryInfo = category ? getCategoryByKey(category) : undefined;
  const stepsConfig = category ? getStepsForCategory(category) : null;

  const buildFieldLabels = (fields: { id: string; label: string }[]): Record<string, string> => {
    return Object.fromEntries(fields.map((f) => [f.id, f.label]));
  };

  const stageLabels: Record<string, string> = {
    idea: 'Idea Stage',
    early: 'Early Stage',
    operating: 'Operating',
  };

  const teamSizeLabels: Record<string, string> = {
    solo: 'Solo founder',
    '2_3': '2–3 people',
    '4_10': '4–10 people',
    '11_25': '11–25 people',
    '25_plus': '25+ people',
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Completion Banner */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        p={2.5}
        borderRadius={2}
        bgcolor={alpha(theme.palette.success.main, 0.06)}
        border={`1px solid ${alpha(theme.palette.success.main, 0.2)}`}
      >
        <CheckIcon sx={{ color: 'success.main', fontSize: 28 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="success.dark">
            Almost there — review your business setup
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check the details below and click "Complete Setup" to create your business workspace.
          </Typography>
        </Box>
      </Box>

      {/* Business Basics */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box
          px={2.5}
          py={1.5}
          bgcolor={alpha(theme.palette.primary.main, 0.04)}
          borderBottom={`1px solid ${theme.palette.divider}`}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Chip
            label="Step 1"
            size="small"
            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
          />
          <Typography variant="subtitle2" fontWeight={600}>
            Business Basics
          </Typography>
        </Box>
        <Box px={2.5} py={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" display="block">
                Business Name
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {draft.name || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" display="block">
                Category
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {categoryInfo?.label ?? '—'}
              </Typography>
            </Grid>
            {draft.stage && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Stage
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {stageLabels[draft.stage] ?? draft.stage}
                </Typography>
              </Grid>
            )}
            {draft.teamSize && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Team Size
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {teamSizeLabels[draft.teamSize] ?? draft.teamSize}
                </Typography>
              </Grid>
            )}
            {draft.location && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Location
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {draft.location}
                </Typography>
              </Grid>
            )}
            {draft.description && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Description
                </Typography>
                <Typography variant="body2">
                  {draft.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>

      {/* Category-specific steps */}
      {stepsConfig && (
        <>
          <ReviewSection
            title={stepsConfig.categoryProfile.title}
            stepIndex={2}
            fields={draft.categoryData}
            fieldLabels={buildFieldLabels(stepsConfig.categoryProfile.fields)}
          />
          <ReviewSection
            title={stepsConfig.operatingModel.title}
            stepIndex={3}
            fields={draft.categoryData}
            fieldLabels={buildFieldLabels(stepsConfig.operatingModel.fields)}
          />
          <ReviewSection
            title={stepsConfig.revenueModel.title}
            stepIndex={4}
            fields={draft.categoryData}
            fieldLabels={buildFieldLabels(stepsConfig.revenueModel.fields)}
          />
          <ReviewSection
            title={stepsConfig.teamResources.title}
            stepIndex={5}
            fields={draft.categoryData}
            fieldLabels={buildFieldLabels(stepsConfig.teamResources.fields)}
          />
        </>
      )}

      <Divider />

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        p={2}
        borderRadius={2}
        bgcolor="background.default"
      >
        <Typography variant="body2" color="text.secondary">
          After completing setup, your business will be created and you'll be taken to the{' '}
          <strong>Business Builder</strong> workspace where you can further configure your
          financial model, revenue streams, and operational structure.
        </Typography>
      </Box>
    </Box>
  );
};

export default StepReview;
