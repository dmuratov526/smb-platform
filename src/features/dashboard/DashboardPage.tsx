import React, { useMemo } from 'react';
import { Box, Grid, Alert } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import PageHeader from '../../shared/components/PageHeader';
import { makeSelectDashboardSummary } from './selectors';
import BusinessOverviewHeader from './components/BusinessOverviewHeader';
import HealthSummary from './components/HealthSummary';
import BusinessModelSnapshot from './components/BusinessModelSnapshot';
import SimulationSnapshot from './components/SimulationSnapshot';
import LaunchProgressSummary from './components/LaunchProgressSummary';
import OperationsSummaryWidget from './components/OperationsSummaryWidget';
import PriorityList from './components/PriorityList';
import RecommendedNextStep from './components/RecommendedNextStep';
import DashboardSection from './components/DashboardSection';

const DashboardPage: React.FC = () => {
  const { activeBusinessId, businesses } = useAppSelector((s) => s.business);
  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);

  const selectDashboardSummary = useMemo(
    () => makeSelectDashboardSummary(activeBusinessId ?? ''),
    [activeBusinessId]
  );
  const summary = useAppSelector(selectDashboardSummary);

  const activeModel = useAppSelector(
    (s) => (activeBusinessId ? s.businessModel.models[activeBusinessId] ?? null : null)
  );

  if (!activeBusiness) {
    return (
      <Box>
        <PageHeader title="Dashboard" description="Select a business to view your control center." />
        <Alert severity="info">No active business selected.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        description={`Business control center for ${activeBusiness.name}`}
      />

      {/* Section 1: Business Overview */}
      <BusinessOverviewHeader business={activeBusiness} />

      {/* Section 2: Business Health Summary */}
      <DashboardSection title="Business Health" mb={3}>
        <HealthSummary
          builder={summary.builder}
          simulation={summary.simulation}
          launch={summary.launch}
          ops={summary.ops}
        />
      </DashboardSection>

      {/* Section 8: Recommended Next Step — elevated above fold */}
      <DashboardSection title="Recommended Next Step" mb={3}>
        <RecommendedNextStep action={summary.recommendedAction} />
      </DashboardSection>

      {/* Sections 3 + 4: Business Model Snapshot & Simulation Snapshot */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} md={6}>
          <DashboardSection title="Business Model" navPath="/builder" navLabel="Open Builder" mb={0}>
            <BusinessModelSnapshot model={activeModel} health={summary.builder} />
          </DashboardSection>
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardSection title="Simulation" navPath="/simulator" navLabel="Open Simulator" mb={0}>
            <SimulationSnapshot simulation={summary.simulation} />
          </DashboardSection>
        </Grid>
      </Grid>

      {/* Sections 5 + 6: Launch Progress & Operations */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} md={6}>
          <DashboardSection title="Launch Readiness" navPath="/planner" navLabel="Open Planner" mb={0}>
            <LaunchProgressSummary launch={summary.launch} />
          </DashboardSection>
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardSection title="Operations" navPath="/operations" navLabel="Open Operations" mb={0}>
            <OperationsSummaryWidget ops={summary.ops} />
          </DashboardSection>
        </Grid>
      </Grid>

      {/* Section 7: Priority / Attention List */}
      <DashboardSection title="Needs Attention" mb={0}>
        <PriorityList items={summary.priorityItems} />
      </DashboardSection>
    </Box>
  );
};

export default DashboardPage;
