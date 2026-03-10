import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateCategoryData } from '../../../app/onboardingSlice';
import { OnboardingStepConfig } from '../../../types';
import DynamicFieldRenderer from './DynamicFieldRenderer';

interface StepCategoryContentProps {
  stepConfig: OnboardingStepConfig;
}

const StepCategoryContent: React.FC<StepCategoryContentProps> = ({ stepConfig }) => {
  const dispatch = useAppDispatch();
  const categoryData = useAppSelector((s) => s.onboarding.draft.categoryData);

  const handleChange = (fieldId: string, value: string | string[]) => {
    dispatch(updateCategoryData({ [fieldId]: value }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Grid container spacing={2.5}>
        {stepConfig.fields.map((field) => (
          <Grid item xs={12} sm={field.type === 'textarea' ? 12 : 6} key={field.id}>
            <DynamicFieldRenderer
              field={field}
              value={categoryData[field.id] ?? (field.type === 'multiselect' ? [] : '')}
              onChange={handleChange}
            />
          </Grid>
        ))}
      </Grid>

      {stepConfig.fields.length === 0 && (
        <Box py={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            No specific questions for this step. Click Next to continue.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StepCategoryContent;
