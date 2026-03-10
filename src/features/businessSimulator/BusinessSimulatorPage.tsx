import React, { useMemo } from 'react';
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
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectSimulatorScenarios,
  selectActiveScenario,
  selectBaseScenario,
} from './selectors';
import { setActiveScenario, updateAssumptions } from './slice';
import { computeResults } from './calculations';
import { SimulatorAssumptions, SimulatorResults } from './types';
import ScenarioSelector from './components/ScenarioSelector';
import AssumptionsPanel from './components/AssumptionsPanel';
import ResultsPanel from './components/ResultsPanel';

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

  if (scenarios.length === 0) {
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
            No scenarios available
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={380} mb={3}>
            Complete the Business Builder first to generate simulation scenarios based on
            your business model.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ArrowIcon />}
            onClick={() => navigate('/builder')}
            sx={{ borderRadius: 2 }}
          >
            Go to Business Builder
          </Button>
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
