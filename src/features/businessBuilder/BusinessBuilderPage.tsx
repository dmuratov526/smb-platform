import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  RocketLaunchOutlined as RocketIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveBusinessModel } from '../businessModel/selectors';
import { initBusinessModel } from '../businessModel/slice';
import { startOnboarding } from '../../app/onboardingSlice';
import OfferSection from './sections/OfferSection';
import CustomerSection from './sections/CustomerSection';
import RevenueSection from './sections/RevenueSection';
import AcquisitionSection from './sections/AcquisitionSection';
import OperationsSection from './sections/OperationsSection';
import FinancialSection from './sections/FinancialSection';

const BusinessBuilderPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const model = useAppSelector(selectActiveBusinessModel);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  useEffect(() => {
    if (activeBusinessId && !model) {
      dispatch(initBusinessModel({ businessId: activeBusinessId }));
    }
  }, [activeBusinessId, model, dispatch]);

  const handleCreateBusiness = () => {
    dispatch(startOnboarding());
    navigate('/onboarding');
  };

  if (!activeBusinessId || !activeBusiness) {
    return (
      <Box>
        <PageHeader
          title="Business Builder"
          description="Design and structure your business model."
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={10}
          textAlign="center"
        >
          <Box
            width={64}
            height={64}
            borderRadius={3}
            bgcolor={alpha(theme.palette.primary.main, 0.08)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
          >
            <RocketIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            No business selected
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={380} mb={3}>
            Create your first business to start building your business model. The builder
            helps you define your offer, customers, revenue model, and more.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleCreateBusiness}
            sx={{ borderRadius: 2 }}
          >
            Create a Business
          </Button>
        </Box>
      </Box>
    );
  }

  if (!model) {
    return (
      <Box>
        <PageHeader title="Business Builder" description="Loading business model..." />
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  const sectionCompletenessValues = [
    model.offer,
    model.customer,
    model.revenue,
    model.acquisition,
    model.operations,
    model.financials,
  ].map((section) => {
    const vals = Object.values(section).filter((v) => v !== null && v !== '');
    const total = Object.keys(section).length;
    return Math.round((vals.length / total) * 100);
  });

  const overallCompleteness = Math.round(
    sectionCompletenessValues.reduce((a, b) => a + b, 0) / sectionCompletenessValues.length
  );

  const completenessColor =
    overallCompleteness === 100
      ? 'success'
      : overallCompleteness >= 60
      ? 'primary'
      : 'warning';

  return (
    <Box>
      <PageHeader
        title="Business Builder"
        description="Define and refine your complete business model."
        actions={
          <Box display="flex" alignItems="center" gap={1.5}>
            <Chip
              label={activeBusiness.name}
              size="small"
              sx={{
                bgcolor: activeBusiness.logoColor,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
            {activeBusiness.category && (
              <Chip
                label={activeBusiness.category}
                size="small"
                variant="outlined"
                sx={{ textTransform: 'capitalize', fontSize: '0.72rem' }}
              />
            )}
          </Box>
        }
      />

      {/* Overall completeness bar */}
      <Box
        mb={3}
        p={2}
        borderRadius={2}
        bgcolor="background.paper"
        border={`1px solid ${theme.palette.divider}`}
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" mb={0.75}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Model Completeness
            </Typography>
            <Typography variant="caption" fontWeight={700} color={`${completenessColor}.main`}>
              {overallCompleteness}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallCompleteness}
            color={completenessColor}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
        <Chip
          label={
            overallCompleteness === 100
              ? 'Complete'
              : overallCompleteness >= 60
              ? 'In Progress'
              : 'Getting Started'
          }
          size="small"
          color={completenessColor}
          sx={{ fontWeight: 700, flexShrink: 0 }}
        />
      </Box>

      {overallCompleteness >= 80 && (
        <Alert
          severity="success"
          icon={<RocketIcon fontSize="small" />}
          sx={{ mb: 3 }}
          action={
            <Button
              size="small"
              color="success"
              variant="outlined"
              onClick={() => navigate('/simulator')}
            >
              Run Simulation
            </Button>
          }
        >
          Your business model is well-defined. You can now run simulations to test your assumptions.
        </Alert>
      )}

      {/* Section grid */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <OfferSection businessId={activeBusinessId} data={model.offer} />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomerSection businessId={activeBusinessId} data={model.customer} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RevenueSection businessId={activeBusinessId} data={model.revenue} />
        </Grid>

        <Grid item xs={12} md={6}>
          <AcquisitionSection businessId={activeBusinessId} data={model.acquisition} />
        </Grid>

        <Grid item xs={12} md={6}>
          <OperationsSection businessId={activeBusinessId} data={model.operations} />
        </Grid>

        <Grid item xs={12} md={6}>
          <FinancialSection businessId={activeBusinessId} data={model.financials} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BusinessBuilderPage;
