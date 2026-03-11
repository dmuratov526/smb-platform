import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  LocalOfferOutlined as OfferIcon,
  PeopleOutlined as CustomerIcon,
  AttachMoneyOutlined as RevenueIcon,
  CampaignOutlined as AcquisitionIcon,
  SettingsOutlined as OperationsIcon,
  AccountBalanceOutlined as FinancialsIcon,
  AddCircleOutline as AddIcon,
  RocketLaunchOutlined as RocketIcon,
  CheckCircle as CheckIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveBusinessModel } from '../businessModel/selectors';
import { initBusinessModel } from '../businessModel/slice';
import { startOnboarding } from '../../app/onboardingSlice';
import { BusinessModelSection } from '../businessModel/types';
import OfferSection from './sections/OfferSection';
import CustomerSection from './sections/CustomerSection';
import RevenueSection from './sections/RevenueSection';
import AcquisitionSection from './sections/AcquisitionSection';
import OperationsSection from './sections/OperationsSection';
import FinancialSection from './sections/FinancialSection';

interface SectionNavItem {
  key: BusinessModelSection;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const SECTION_DEFS: SectionNavItem[] = [
  { key: 'offer', label: 'Offer', subtitle: 'What you sell', icon: <OfferIcon sx={{ fontSize: 15 }} />, color: '#7C3AED' },
  { key: 'customer', label: 'Customer', subtitle: 'Who you serve', icon: <CustomerIcon sx={{ fontSize: 15 }} />, color: '#0891B2' },
  { key: 'revenue', label: 'Revenue Model', subtitle: 'How you earn', icon: <RevenueIcon sx={{ fontSize: 15 }} />, color: '#059669' },
  { key: 'acquisition', label: 'Acquisition', subtitle: 'How you grow', icon: <AcquisitionIcon sx={{ fontSize: 15 }} />, color: '#D97706' },
  { key: 'operations', label: 'Operations', subtitle: 'How you deliver', icon: <OperationsIcon sx={{ fontSize: 15 }} />, color: '#6366F1' },
  { key: 'financials', label: 'Financials', subtitle: 'Your economics', icon: <FinancialsIcon sx={{ fontSize: 15 }} />, color: '#DC2626' },
];

function computeSectionCompleteness(section: Record<string, string | number | null>): number {
  const vals = Object.values(section).filter((v) => v !== null && v !== '');
  const total = Object.keys(section).length;
  return total === 0 ? 0 : Math.round((vals.length / total) * 100);
}

const BusinessBuilderPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const model = useAppSelector(selectActiveBusinessModel);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  const [activeSection, setActiveSection] = useState<BusinessModelSection>('offer');

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

  const sectionCompleteness: Record<BusinessModelSection, number> = {
    offer: computeSectionCompleteness(model.offer as Record<string, string | number | null>),
    customer: computeSectionCompleteness(model.customer as Record<string, string | number | null>),
    revenue: computeSectionCompleteness(model.revenue as Record<string, string | number | null>),
    acquisition: computeSectionCompleteness(model.acquisition as Record<string, string | number | null>),
    operations: computeSectionCompleteness(model.operations as Record<string, string | number | null>),
    financials: computeSectionCompleteness(model.financials as Record<string, string | number | null>),
  };

  const overallCompleteness = Math.round(
    Object.values(sectionCompleteness).reduce((a, b) => a + b, 0) / SECTION_DEFS.length
  );

  const completedSections = Object.values(sectionCompleteness).filter((v) => v === 100).length;

  const completenessColor =
    overallCompleteness === 100 ? 'success' : overallCompleteness >= 60 ? 'primary' : 'warning';

  const activeSectionIndex = SECTION_DEFS.findIndex((s) => s.key === activeSection);
  const activeSectionDef = SECTION_DEFS[activeSectionIndex];
  const canGoPrev = activeSectionIndex > 0;
  const canGoNext = activeSectionIndex < SECTION_DEFS.length - 1;

  const renderActiveSection = () => {
    const props = { businessId: activeBusinessId };
    switch (activeSection) {
      case 'offer': return <OfferSection {...props} data={model.offer} />;
      case 'customer': return <CustomerSection {...props} data={model.customer} />;
      case 'revenue': return <RevenueSection {...props} data={model.revenue} />;
      case 'acquisition': return <AcquisitionSection {...props} data={model.acquisition} />;
      case 'operations': return <OperationsSection {...props} data={model.operations} />;
      case 'financials': return <FinancialSection {...props} data={model.financials} />;
      default: return null;
    }
  };

  return (
    <Box>
      <PageHeader
        title="Business Builder"
        description="Define your complete business model section by section."
        actions={
          <Box display="flex" alignItems="center" gap={1.5}>
            <Chip
              label={activeBusiness.name}
              size="small"
              sx={{ bgcolor: activeBusiness.logoColor, color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}
            />
            <Chip
              label={`${overallCompleteness}% complete`}
              size="small"
              color={completenessColor}
              variant={overallCompleteness === 100 ? 'filled' : 'outlined'}
              sx={{ fontWeight: 700, fontSize: '0.72rem' }}
            />
          </Box>
        }
      />

      {overallCompleteness >= 80 && (
        <Alert
          severity="success"
          icon={<RocketIcon fontSize="small" />}
          sx={{ mb: 2.5 }}
          action={
            <Button size="small" color="success" variant="outlined" onClick={() => navigate('/simulator')}>
              Run Simulation
            </Button>
          }
        >
          Your business model is well-defined. You can now run simulations to test your assumptions.
        </Alert>
      )}

      {isMobile ? (
        /* ── Mobile: scrollable tab strip + stacked section ── */
        <Box>
          <Box sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}`, mb: 2 }}>
            <Tabs
              value={activeSectionIndex}
              onChange={(_, i) => setActiveSection(SECTION_DEFS[i].key)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 42 }}
            >
              {SECTION_DEFS.map((s) => (
                <Tab
                  key={s.key}
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <span>{s.label}</span>
                      {sectionCompleteness[s.key] === 100 && (
                        <CheckIcon sx={{ fontSize: 11, color: 'success.main' }} />
                      )}
                    </Box>
                  }
                  sx={{ minHeight: 42, fontSize: '0.78rem', textTransform: 'none', fontWeight: 600, px: 1.5 }}
                />
              ))}
            </Tabs>
          </Box>
          {renderActiveSection()}
        </Box>
      ) : (
        /* ── Desktop: left nav + main workspace ── */
        <Box display="flex" gap={2.5} alignItems="flex-start">

          {/* Left navigation panel */}
          <Box width={220} flexShrink={0} sx={{ position: 'sticky', top: 20 }}>

            {/* Model progress card */}
            <Box
              p={1.75}
              mb={1.5}
              borderRadius={2}
              bgcolor="background.paper"
              border={`1px solid ${theme.palette.divider}`}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Model Progress
                </Typography>
                <Typography variant="caption" fontWeight={800} color={`${completenessColor}.main`} sx={{ fontSize: '0.8rem' }}>
                  {overallCompleteness}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={overallCompleteness}
                color={completenessColor}
                sx={{ height: 5, borderRadius: 3, mb: 0.75 }}
              />
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
                {completedSections} of {SECTION_DEFS.length} sections complete
              </Typography>
            </Box>

            {/* Section navigation list */}
            <Box
              borderRadius={2}
              bgcolor="background.paper"
              border={`1px solid ${theme.palette.divider}`}
              overflow="hidden"
            >
              {SECTION_DEFS.map((section, index) => {
                const isActive = activeSection === section.key;
                const pct = sectionCompleteness[section.key];
                const isDone = pct === 100;

                return (
                  <Box
                    key={section.key}
                    display="flex"
                    alignItems="center"
                    gap={1.25}
                    px={1.5}
                    py={1.25}
                    sx={{
                      cursor: 'pointer',
                      borderLeft: `3px solid ${isActive ? section.color : 'transparent'}`,
                      bgcolor: isActive ? alpha(section.color, 0.06) : 'transparent',
                      borderBottom: index < SECTION_DEFS.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease',
                      '&:hover': {
                        bgcolor: isActive ? alpha(section.color, 0.09) : alpha(theme.palette.text.primary, 0.03),
                      },
                    }}
                    onClick={() => setActiveSection(section.key)}
                  >
                    <Box
                      width={28}
                      height={28}
                      borderRadius={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      bgcolor={alpha(section.color, isActive ? 0.14 : 0.07)}
                      sx={{ color: section.color }}
                    >
                      {section.icon}
                    </Box>

                    <Box flex={1} minWidth={0}>
                      <Typography
                        variant="caption"
                        display="block"
                        noWrap
                        fontWeight={isActive ? 700 : 600}
                        color={isActive ? 'text.primary' : 'text.secondary'}
                        sx={{ fontSize: '0.78rem', lineHeight: 1.4 }}
                      >
                        {section.label}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.75} mt={0.35}>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 2,
                            flex: 1,
                            borderRadius: 1,
                            bgcolor: alpha(section.color, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: isDone ? theme.palette.success.main : section.color,
                              borderRadius: 1,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            color: isDone ? 'success.main' : 'text.disabled',
                            flexShrink: 0,
                            minWidth: 24,
                            textAlign: 'right',
                          }}
                        >
                          {pct}%
                        </Typography>
                      </Box>
                    </Box>

                    {isDone && (
                      <CheckIcon sx={{ fontSize: 13, color: 'success.main', flexShrink: 0 }} />
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Simulate CTA */}
            {overallCompleteness >= 60 && (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<RocketIcon sx={{ fontSize: 13 }} />}
                onClick={() => navigate('/simulator')}
                sx={{ mt: 1.5, borderRadius: 2, fontSize: '0.74rem', fontWeight: 600, height: 32 }}
              >
                Run Simulation
              </Button>
            )}
          </Box>

          {/* Main workspace */}
          <Box flex={1} minWidth={0}>

            {/* Workspace breadcrumb + prev/next nav */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1.5}
              px={0.25}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  width={4}
                  height={20}
                  borderRadius={1}
                  bgcolor={activeSectionDef.color}
                  flexShrink={0}
                />
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.73rem' }}>
                  {activeSectionIndex + 1} / {SECTION_DEFS.length}
                </Typography>
                <Typography variant="caption" color="text.disabled">·</Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ fontSize: '0.73rem', color: activeSectionDef.color }}
                >
                  {activeSectionDef.subtitle}
                </Typography>
              </Box>

              <Box display="flex" gap={0.75}>
                <Tooltip title={canGoPrev ? `← ${SECTION_DEFS[activeSectionIndex - 1]?.label}` : ''} placement="top">
                  <span>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={!canGoPrev}
                      startIcon={<PrevIcon sx={{ fontSize: '0.7rem !important' }} />}
                      onClick={() => canGoPrev && setActiveSection(SECTION_DEFS[activeSectionIndex - 1].key)}
                      sx={{ minWidth: 0, px: 1.25, height: 28, fontSize: '0.72rem' }}
                    >
                      Prev
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title={canGoNext ? `${SECTION_DEFS[activeSectionIndex + 1]?.label} →` : ''} placement="top">
                  <span>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={!canGoNext}
                      endIcon={<NextIcon sx={{ fontSize: '0.7rem !important' }} />}
                      onClick={() => canGoNext && setActiveSection(SECTION_DEFS[activeSectionIndex + 1].key)}
                      sx={{ minWidth: 0, px: 1.25, height: 28, fontSize: '0.72rem' }}
                    >
                      Next
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>

            {/* Active section component */}
            {renderActiveSection()}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BusinessBuilderPage;
