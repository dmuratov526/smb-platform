import React, { useMemo } from 'react';
import { Box, Grid, Typography, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import PageHeader from '../../shared/components/PageHeader';
import OperationsOverview from './components/OperationsOverview';
import OperationalAreaCard from './components/OperationalAreaCard';
import RecurringTasksSection from './components/RecurringTasksSection';
import IssuesSection from './components/IssuesSection';
import FocusSummary from './components/FocusSummary';
import LaunchTransitionBanner from './components/LaunchTransitionBanner';
import {
  computeOperationsSummary,
  getTasksDueSoon,
  getOverdueTasks,
  getHighPriorityIssues,
} from './utils';

const OperationsPage: React.FC = () => {
  const activeBusinessId = useSelector((state: RootState) => state.business.activeBusinessId);
  const businesses = useSelector((state: RootState) => state.business.businesses);
  const operationsData = useSelector((state: RootState) =>
    activeBusinessId ? state.operations.data[activeBusinessId] : undefined
  );

  const activeBusiness = useMemo(
    () => businesses.find((b) => b.id === activeBusinessId),
    [businesses, activeBusinessId]
  );

  const summary = useMemo(
    () => (operationsData ? computeOperationsSummary(operationsData) : null),
    [operationsData]
  );

  const tasksDueSoon = useMemo(
    () => (operationsData ? getTasksDueSoon(operationsData.recurringTasks) : []),
    [operationsData]
  );

  const overdueTasks = useMemo(
    () => (operationsData ? getOverdueTasks(operationsData.recurringTasks) : []),
    [operationsData]
  );

  const highPriorityIssues = useMemo(
    () => (operationsData ? getHighPriorityIssues(operationsData.issues) : []),
    [operationsData]
  );

  const areaTaskCounts = useMemo(() => {
    if (!operationsData) return {};
    const counts: Record<string, number> = {};
    operationsData.recurringTasks.forEach((t) => {
      counts[t.areaId] = (counts[t.areaId] ?? 0) + 1;
    });
    return counts;
  }, [operationsData]);

  const areaIssueCounts = useMemo(() => {
    if (!operationsData) return {};
    const counts: Record<string, number> = {};
    operationsData.issues
      .filter((i) => i.status !== 'resolved')
      .forEach((i) => {
        counts[i.areaId] = (counts[i.areaId] ?? 0) + 1;
      });
    return counts;
  }, [operationsData]);

  if (!activeBusinessId || !operationsData) {
    return (
      <Box>
        <PageHeader
          title="Operations"
          description="Manage your day-to-day business operations."
        />
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No operations data available for the active business. Select a business to get started.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Operations"
        description={`Day-to-day execution workspace for ${activeBusiness?.name ?? 'your business'}`}
      />

      {summary && (
        <OperationsOverview
          summary={summary}
          businessName={activeBusiness?.name ?? 'Business'}
        />
      )}

      <LaunchTransitionBanner
        businessId={activeBusinessId}
        areas={operationsData.areas}
      />

      <Grid container spacing={2.5} mb={3} alignItems="flex-start">
        <Grid item xs={12} lg={8}>
          <Box mb={1.5}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Operational Areas
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Key areas of ongoing business operations
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {operationsData.areas.map((area) => (
              <Grid item xs={12} sm={6} key={area.id}>
                <OperationalAreaCard
                  area={area}
                  taskCount={areaTaskCounts[area.id] ?? 0}
                  issueCount={areaIssueCounts[area.id] ?? 0}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box mb={1.5}>
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              Near-Term Focus
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Items requiring immediate attention
            </Typography>
          </Box>
          <FocusSummary
            tasksDueSoon={tasksDueSoon}
            overdueTasks={overdueTasks}
            highPriorityIssues={highPriorityIssues}
            areas={operationsData.areas}
          />
        </Grid>
      </Grid>

      <Box mb={3}>
        <RecurringTasksSection
          businessId={activeBusinessId}
          tasks={operationsData.recurringTasks}
          areas={operationsData.areas}
        />
      </Box>

      <Box>
        <IssuesSection
          businessId={activeBusinessId}
          issues={operationsData.issues}
          areas={operationsData.areas}
        />
      </Box>
    </Box>
  );
};

export default OperationsPage;
