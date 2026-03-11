import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  Science as SimulatorIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectSimulatorScenarios,
  selectActiveScenario,
  selectBaseScenario,
} from './selectors';
import { setActiveScenario, updateAssumptions, initScenariosForBusiness } from './slice';
import { computeResults } from './calculations';
import { SimulatorAssumptions, SimulatorResults } from './types';
import ScenarioSelector from './components/ScenarioSelector';
import AssumptionsPanel from './components/AssumptionsPanel';
import ResultsPanel from './components/ResultsPanel';
import { generateDefaultScenarios } from './utils';

const BusinessSimulatorPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  const scenarios = useAppSelector((s) =>
    activeBusinessId ? selectSimulatorScenarios(s, activeBusinessId) : []
  );
  const activeScenario = useAppSelector((s) =>
    activeBusinessId ? selectActiveScenario(s, activeBusinessId) : undefined
  );
  const baseScenario = useAppSelector((s) =>
    activeBusinessId ? selectBaseScenario(s, activeBusinessId) : undefined
  );

  const results: SimulatorResults | null = useMemo(
    () => (activeScenario ? computeResults(activeScenario.assumptions) : null),
    [activeScenario]
  );

  const baseResults: SimulatorResults | null = useMemo(
    () => (baseScenario ? computeResults(baseScenario.assumptions) : null),
    [baseScenario]
  );

  const scenarioResults: Record<string, SimulatorResults> = useMemo(
    () =>
      Object.fromEntries(
        scenarios.map((s) => [s.id, computeResults(s.assumptions)])
      ),
    [scenarios]
  );

  const handleScenarioSelect = (scenarioId: string) => {
    if (!activeBusinessId) return;
    dispatch(setActiveScenario({ businessId: activeBusinessId, scenarioId }));
  };

  const handleAssumptionsChange = (updated: SimulatorAssumptions) => {
    if (!activeBusinessId || !activeScenario) return;
    dispatch(
      updateAssumptions({
        businessId: activeBusinessId,
        scenarioId: activeScenario.id,
        assumptions: updated,
      })
    );
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateScenarios = () => {
    if (!activeBusinessId) return;
    setIsGenerating(true);
    const defaultScenarios = generateDefaultScenarios(activeBusinessId);
    dispatch(initScenariosForBusiness({ businessId: activeBusinessId, scenarios: defaultScenarios }));
    setTimeout(() => setIsGenerating(false), 300);
  };

  // Auto-init scenarios on first visit
  useEffect(() => {
    if (activeBusinessId && scenarios.length === 0) {
      handleGenerateScenarios();
    }
  }, [activeBusinessId]);

  if (!activeBusinessId || !activeBusiness) {
    return (
      <Box>
        <PageHeader
          title="Business Simulator"
          description="Test assumptions and project business outcomes."
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
            <SimulatorIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            No business selected
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={380} mb={3}>
            Create a business first, then use the Simulator to test your assumptions
            and project financial outcomes.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/onboarding')}
            sx={{ borderRadius: 2 }}
          >
            Create a Business
          </Button>
        </Box>
      </Box>
    );
  }

  if (scenarios.length === 0 && !isGenerating) {
    return (
      <Box>
        <PageHeader
          title="Business Simulator"
          description="Test assumptions and project business outcomes."
        />
        <Box py={6}>
          <Card
            elevation={0}
            sx={{
              maxWidth: 600,
              mx: 'auto',
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.25)}`,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.primary.main, 0.01)})`,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box
                width={72}
                height={72}
                borderRadius={3}
                mx="auto"
                mb={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <SimulatorIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>

              <Typography variant="h5" fontWeight={800} mb={1.5} sx={{ letterSpacing: '-0.02em' }}>
                Ready to test your business model?
              </Typography>

              <Typography variant="body1" color="text.secondary" mb={0.75} sx={{ lineHeight: 1.7 }}>
                The simulator helps you validate assumptions before investing time and money.
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3} sx={{ lineHeight: 1.65 }}>
                We'll create 3 scenarios (Base, Best, Worst) with default assumptions that you can customize.
              </Typography>

              <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
                <Box display="flex" alignItems="center" gap={1.5} px={2} py={1.25} borderRadius={2} bgcolor={alpha(theme.palette.success.main, 0.08)} border={`1px solid ${alpha(theme.palette.success.main, 0.2)}`}>
                  <Box width={6} height={6} borderRadius="50%" bgcolor="success.main" flexShrink={0} />
                  <Typography variant="body2" fontWeight={600} color="text.primary" textAlign="left">
                    Adjust pricing, volume, costs, and acquisition assumptions
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5} px={2} py={1.25} borderRadius={2} bgcolor={alpha(theme.palette.info.main, 0.08)} border={`1px solid ${alpha(theme.palette.info.main, 0.2)}`}>
                  <Box width={6} height={6} borderRadius="50%" bgcolor="info.main" flexShrink={0} />
                  <Typography variant="body2" fontWeight={600} color="text.primary" textAlign="left">
                    See instant calculations: revenue, profit, margins, break-even
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5} px={2} py={1.25} borderRadius={2} bgcolor={alpha(theme.palette.warning.main, 0.08)} border={`1px solid ${alpha(theme.palette.warning.main, 0.2)}`}>
                  <Box width={6} height={6} borderRadius="50%" bgcolor="warning.main" flexShrink={0} />
                  <Typography variant="body2" fontWeight={600} color="text.primary" textAlign="left">
                    Compare scenarios side-by-side to find the best path forward
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleGenerateScenarios}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
                  '&:hover': {
                    background: theme.palette.primary.main,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                  },
                }}
              >
                Generate Default Scenarios
              </Button>

              <Typography variant="caption" color="text.disabled" display="block" mt={2}>
                You can customize all assumptions after generation
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  const isBaseScenario = activeScenario?.type === 'base';

  return (
    <Box>
      <PageHeader
        title="Business Simulator"
        description="Adjust assumptions and instantly see how changes affect your business outcomes."
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
            {activeScenario && (
              <Chip
                label={activeScenario.name}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: '0.72rem' }}
              />
            )}
          </Box>
        }
      />

      {/* Scenario selector */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Scenarios
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Select a scenario to edit its assumptions
            </Typography>
          </Box>
          <ScenarioSelector
            scenarios={scenarios}
            activeScenarioId={activeScenario?.id ?? ''}
            results={scenarioResults}
            onSelect={handleScenarioSelect}
          />
        </CardContent>
      </Card>

      {/* Main workspace */}
      {activeScenario && results && (
        <Grid container spacing={2.5}>
          {/* Left: Assumptions */}
          <Grid item xs={12} lg={5}>
            <AssumptionsPanel
              assumptions={activeScenario.assumptions}
              onChange={handleAssumptionsChange}
            />
          </Grid>

          {/* Right: Results */}
          <Grid item xs={12} lg={7}>
            <ResultsPanel
              results={results}
              baseResults={baseResults}
              isBaseScenario={isBaseScenario ?? true}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BusinessSimulatorPage;
