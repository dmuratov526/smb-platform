import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Check as CompleteIcon,
  Close as CancelIcon,
  BusinessCenter as BuilderIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setOnboardingStep,
  completeOnboarding,
  cancelOnboarding,
} from '../../app/onboardingSlice';
import { addBusiness, setActiveBusiness } from '../../app/businessSlice';
import { addBusinessToUser } from '../../app/sessionSlice';
import { Business, BusinessCategoryKey } from '../../types';
import { getCategoryByKey } from './config/categories';
import { getCategoryStepConfig, ONBOARDING_STEP_LABELS } from './config/steps';
import StepBasics from './components/StepBasics';
import StepCategoryContent from './components/StepCategoryContent';
import StepReview from './components/StepReview';

const TOTAL_STEPS = 6;

const generateBusinessId = (): string =>
  `biz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const logoColors = [
  '#2563EB', '#7C3AED', '#059669', '#C8702A', '#DC2626',
  '#0284C7', '#9333EA', '#D97706', '#0891B2', '#16A34A',
];

const OnboardingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentStep, draft } = useAppSelector((s) => s.onboarding);
  const currentUserId = useAppSelector((s) => s.session.currentUserId);

  const category = draft.category as BusinessCategoryKey | '';
  const categoryInfo = category ? getCategoryByKey(category) : undefined;

  const currentStepConfig = useMemo(() => {
    if (currentStep === 0 || currentStep === 5 || !category) return null;
    return getCategoryStepConfig(category, currentStep);
  }, [currentStep, category]);

  const progressValue = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const canProceed = useMemo(() => {
    if (currentStep === 0) {
      return Boolean(draft.name.trim() && draft.category && draft.stage);
    }
    return true;
  }, [currentStep, draft.name, draft.category, draft.stage]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      dispatch(setOnboardingStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(setOnboardingStep(currentStep - 1));
    }
  };

  const handleComplete = () => {
    if (!currentUserId || !category) return;

    const colorIndex = Math.floor(Math.random() * logoColors.length);

    const newBusiness: Business = {
      id: generateBusinessId(),
      name: draft.name,
      industry: categoryInfo?.industryMapping ?? 'other',
      category,
      description: draft.description,
      stage: draft.stage || undefined,
      status: draft.stage === 'operating' ? 'active' : 'draft',
      location: draft.location,
      teamSize: draft.teamSize,
      logoColor: categoryInfo?.logoColor ?? logoColors[colorIndex],
      onboardingCompleted: true,
      categoryData: draft.categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addBusiness(newBusiness));
    dispatch(setActiveBusiness(newBusiness.id));
    dispatch(addBusinessToUser({ userId: currentUserId, businessId: newBusiness.id }));
    dispatch(completeOnboarding());
    navigate('/builder');
  };

  const handleCancel = () => {
    dispatch(cancelOnboarding());
    navigate(-1);
  };

  const renderStepContent = () => {
    if (currentStep === 0) return <StepBasics />;
    if (currentStep === 5) return <StepReview />;
    if (currentStepConfig) return <StepCategoryContent stepConfig={currentStepConfig} />;
    return (
      <Box py={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {!category
            ? 'Please select a business category in Step 1 to continue.'
            : 'Loading step configuration...'}
        </Typography>
      </Box>
    );
  };

  const stepTitle = useMemo(() => {
    if (currentStep === 0) return 'Business Basics';
    if (currentStep === 5) return 'Review & Complete';
    return currentStepConfig?.title ?? ONBOARDING_STEP_LABELS[currentStep];
  }, [currentStep, currentStepConfig]);

  const stepDescription = useMemo(() => {
    if (currentStep === 0)
      return 'Start by giving your business a name, selecting a category, and describing the concept.';
    if (currentStep === 5)
      return 'Review your setup before creating your business workspace.';
    return currentStepConfig?.description ?? 'Configure this section for your business.';
  }, [currentStep, currentStepConfig]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="background.default"
    >
      {/* Top Bar */}
      <Box
        px={3}
        py={1.5}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="background.paper"
        borderBottom={`1px solid ${theme.palette.divider}`}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            width={32}
            height={32}
            borderRadius={1.5}
            bgcolor={theme.palette.primary.main}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <BuilderIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
              Business Setup
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SMB Platform
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {categoryInfo && (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              px={1.5}
              py={0.5}
              borderRadius={1.5}
              bgcolor={alpha(categoryInfo.logoColor, 0.1)}
            >
              <Box
                width={8}
                height={8}
                borderRadius="50%"
                bgcolor={categoryInfo.logoColor}
              />
              <Typography variant="caption" fontWeight={600} color="text.primary">
                {categoryInfo.label}
              </Typography>
            </Box>
          )}
          <Tooltip title="Cancel setup">
            <IconButton size="small" onClick={handleCancel} sx={{ color: 'text.secondary' }}>
              <CancelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Progress */}
      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{ height: 3, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
      />

      {/* Main Content */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={4}
        px={2}
      >
        <Box width="100%" maxWidth={860}>
          {/* Stepper */}
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ borderRadius: 2, p: 2.5, mb: 3 }}
          >
            <Stepper activeStep={currentStep} alternativeLabel>
              {ONBOARDING_STEP_LABELS.map((label, index) => (
                <Step key={label} completed={index < currentStep}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.75rem',
                        fontWeight: index === currentStep ? 600 : 400,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Step Content Card */}
          <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Step Header */}
            <Box
              px={3}
              py={2.5}
              borderBottom={`1px solid ${theme.palette.divider}`}
              bgcolor={alpha(theme.palette.primary.main, 0.02)}
            >
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Box
                  width={24}
                  height={24}
                  borderRadius="50%"
                  bgcolor={theme.palette.primary.main}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Typography variant="caption" fontWeight={700} color="#fff" fontSize="0.7rem">
                    {currentStep + 1}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  {stepTitle}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stepDescription}
              </Typography>
            </Box>

            {/* Form Content */}
            <Box p={3}>{renderStepContent()}</Box>

            {/* Navigation */}
            <Box
              px={3}
              py={2}
              borderTop={`1px solid ${theme.palette.divider}`}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="background.default"
            >
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={handleBack}
                disabled={currentStep === 0}
                size="medium"
              >
                Back
              </Button>

              <Typography variant="caption" color="text.secondary">
                Step {currentStep + 1} of {TOTAL_STEPS}
              </Typography>

              {currentStep < TOTAL_STEPS - 1 ? (
                <Tooltip
                  title={!canProceed ? 'Please fill in the required fields to continue' : ''}
                >
                  <span>
                    <Button
                      variant="contained"
                      endIcon={<NextIcon />}
                      onClick={handleNext}
                      disabled={!canProceed}
                      size="medium"
                    >
                      Next
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<CompleteIcon />}
                  onClick={handleComplete}
                  size="medium"
                  sx={{ fontWeight: 700 }}
                >
                  Complete Setup
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default OnboardingPage;
