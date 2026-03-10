import { BusinessModel } from '../businessModel/types';
import { SimulatorScenario } from '../businessSimulator/types';
import { computeResults } from '../businessSimulator/calculations';
import { PlannerPlan } from '../launchPlanner/types';
import { computeReadiness } from '../launchPlanner/utils';
import { BusinessOperationsData } from '../operations/types';
import { computeOperationsSummary } from '../operations/utils';
import {
  BuilderHealth,
  BuilderSectionHealth,
  SimulationHealth,
  LaunchHealth,
  OpsHealth,
  DashboardPriorityItem,
  RecommendedAction,
} from './types';

function isFilledString(v: string | null | undefined): boolean {
  return typeof v === 'string' && v.trim().length > 0;
}

function isFilledNumber(v: number | null | undefined): boolean {
  return typeof v === 'number' && v !== null;
}

export function computeBuilderHealth(model: BusinessModel | null): BuilderHealth {
  if (!model) {
    return {
      totalFields: 25,
      filledFields: 0,
      completenessPercent: 0,
      sections: [],
      isComplete: false,
    };
  }

  const sections: BuilderSectionHealth[] = [
    {
      key: 'offer',
      label: 'Offer',
      filled: [
        isFilledString(model.offer.productName),
        isFilledString(model.offer.valueProposition),
        isFilledString(model.offer.keyFeatures),
        isFilledString(model.offer.pricingApproach),
      ].filter(Boolean).length,
      total: 4,
      complete: false,
    },
    {
      key: 'customer',
      label: 'Target Customer',
      filled: [
        isFilledString(model.customer.targetSegment),
        isFilledString(model.customer.customerProblem),
        isFilledString(model.customer.willingnessToPay),
        isFilledString(model.customer.geographicFocus),
      ].filter(Boolean).length,
      total: 4,
      complete: false,
    },
    {
      key: 'revenue',
      label: 'Revenue Model',
      filled: [
        isFilledString(model.revenue.pricingModel),
        isFilledString(model.revenue.revenueStreams),
        isFilledNumber(model.revenue.averageTransactionValue),
        isFilledString(model.revenue.expectedSalesVolume),
      ].filter(Boolean).length,
      total: 4,
      complete: false,
    },
    {
      key: 'acquisition',
      label: 'Acquisition',
      filled: [
        isFilledString(model.acquisition.marketingChannels),
        isFilledString(model.acquisition.salesModel),
        isFilledString(model.acquisition.conversionAssumptions),
        isFilledNumber(model.acquisition.estimatedAcquisitionCost),
      ].filter(Boolean).length,
      total: 4,
      complete: false,
    },
    {
      key: 'operations',
      label: 'Operations',
      filled: [
        isFilledString(model.operations.teamStructure),
        isFilledString(model.operations.keyResources),
        isFilledString(model.operations.suppliersOrPartners),
        isFilledString(model.operations.operationalComplexity),
        isFilledString(model.operations.capacityConstraints),
      ].filter(Boolean).length,
      total: 5,
      complete: false,
    },
    {
      key: 'financials',
      label: 'Financial Snapshot',
      filled: [
        isFilledNumber(model.financials.expectedMonthlyRevenue),
        isFilledNumber(model.financials.expectedMonthlyCosts),
        isFilledString(model.financials.breakEvenEstimate),
        isFilledNumber(model.financials.marginEstimate),
      ].filter(Boolean).length,
      total: 4,
      complete: false,
    },
  ];

  const sectionsWithComplete = sections.map((s) => ({
    ...s,
    complete: s.filled === s.total,
  }));

  const totalFields = sectionsWithComplete.reduce((acc, s) => acc + s.total, 0);
  const filledFields = sectionsWithComplete.reduce((acc, s) => acc + s.filled, 0);
  const completenessPercent = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  return {
    totalFields,
    filledFields,
    completenessPercent,
    sections: sectionsWithComplete,
    isComplete: completenessPercent === 100,
  };
}

export function computeSimulationHealth(
  scenario: SimulatorScenario | null
): SimulationHealth {
  if (!scenario) {
    return {
      hasScenarios: false,
      activeScenarioName: '',
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      operatingProfit: 0,
      operatingMargin: 0,
      breakEvenRevenue: 0,
      isViable: false,
    };
  }

  const results = computeResults(scenario.assumptions);
  const monthlyExpenses = results.variableCosts + results.totalFixedCosts;

  return {
    hasScenarios: true,
    activeScenarioName: scenario.name,
    monthlyRevenue: results.monthlyRevenue,
    monthlyExpenses,
    operatingProfit: results.operatingProfit,
    operatingMargin: results.operatingMargin,
    breakEvenRevenue: results.breakEvenRevenue,
    isViable: results.operatingProfit > 0,
  };
}

export function computeLaunchHealth(plan: PlannerPlan | undefined): LaunchHealth {
  if (!plan) {
    return {
      hasPlan: false,
      overallPercent: 0,
      completedTasks: 0,
      totalTasks: 0,
      remainingTasks: 0,
      blockedTasks: 0,
      currentPhaseName: '',
      nextMilestoneName: '',
    };
  }

  const readiness = computeReadiness(plan);
  const activePhase = plan.phases[readiness.activePhaseIndex];
  const nextIncompletePhase = plan.phases.find(
    (p) => p.tasks.some((t) => t.status !== 'completed')
  );

  return {
    hasPlan: true,
    overallPercent: readiness.overallPercent,
    completedTasks: readiness.completedTasks,
    totalTasks: readiness.totalTasks,
    remainingTasks: readiness.remainingTasks,
    blockedTasks: readiness.blockedTasks,
    currentPhaseName: activePhase?.name ?? '',
    nextMilestoneName: nextIncompletePhase?.name ?? 'Launch Execution',
  };
}

export function computeOpsHealth(
  data: BusinessOperationsData | undefined
): OpsHealth {
  if (!data) {
    return {
      hasData: false,
      overallHealth: 'good',
      openIssues: 0,
      criticalIssues: 0,
      tasksDueSoon: 0,
      tasksOverdue: 0,
      tasksCompleted: 0,
    };
  }

  const summary = computeOperationsSummary(data);

  return {
    hasData: true,
    overallHealth: summary.overallHealth,
    openIssues: summary.openIssues,
    criticalIssues: summary.criticalIssues,
    tasksDueSoon: summary.tasksDueSoon,
    tasksOverdue: summary.tasksOverdue,
    tasksCompleted: summary.tasksCompleted,
  };
}

export function generatePriorityItems(
  builder: BuilderHealth,
  simulation: SimulationHealth,
  launch: LaunchHealth,
  ops: OpsHealth
): DashboardPriorityItem[] {
  const items: DashboardPriorityItem[] = [];

  if (builder.completenessPercent < 50) {
    items.push({
      id: 'builder-incomplete',
      title: 'Business Builder is incomplete',
      description: `Only ${builder.completenessPercent}% of your business model is defined. Complete the remaining sections to unlock your full business potential.`,
      source: 'builder',
      severity: 'high',
      actionPath: '/builder',
      actionLabel: 'Open Builder',
    });
  } else {
    const incompleteSections = builder.sections.filter((s) => !s.complete);
    if (incompleteSections.length > 0) {
      items.push({
        id: 'builder-sections-missing',
        title: `${incompleteSections.length} builder section${incompleteSections.length > 1 ? 's' : ''} incomplete`,
        description: `Missing: ${incompleteSections.map((s) => s.label).join(', ')}.`,
        source: 'builder',
        severity: 'medium',
        actionPath: '/builder',
        actionLabel: 'Complete Builder',
      });
    }
  }

  if (!simulation.hasScenarios) {
    items.push({
      id: 'simulation-missing',
      title: 'No simulation configured',
      description: 'Run the Business Simulator to validate your financial assumptions before launching.',
      source: 'simulation',
      severity: 'high',
      actionPath: '/simulator',
      actionLabel: 'Open Simulator',
    });
  } else if (!simulation.isViable) {
    items.push({
      id: 'simulation-not-viable',
      title: 'Current scenario is not profitable',
      description: `The active scenario shows a projected loss of $${Math.abs(simulation.operatingProfit).toLocaleString()}/month. Review your assumptions.`,
      source: 'simulation',
      severity: 'critical',
      actionPath: '/simulator',
      actionLabel: 'Review Simulation',
    });
  }

  if (launch.hasPlan) {
    if (launch.blockedTasks > 0) {
      items.push({
        id: 'launch-blocked-tasks',
        title: `${launch.blockedTasks} launch task${launch.blockedTasks > 1 ? 's' : ''} blocked`,
        description: 'Blocked tasks are preventing launch readiness progress. Review dependencies.',
        source: 'launch',
        severity: 'high',
        actionPath: '/planner',
        actionLabel: 'Review Launch Plan',
      });
    }
    if (launch.overallPercent < 30 && launch.totalTasks > 0) {
      items.push({
        id: 'launch-early-stage',
        title: 'Launch preparation just started',
        description: `${launch.overallPercent}% of launch tasks complete. Current phase: ${launch.currentPhaseName}.`,
        source: 'launch',
        severity: 'medium',
        actionPath: '/planner',
        actionLabel: 'Open Launch Planner',
      });
    }
  }

  if (ops.hasData) {
    if (ops.criticalIssues > 0) {
      items.push({
        id: 'ops-critical-issues',
        title: `${ops.criticalIssues} critical operational issue${ops.criticalIssues > 1 ? 's' : ''}`,
        description: 'Critical issues require immediate attention to maintain business health.',
        source: 'operations',
        severity: 'critical',
        actionPath: '/operations',
        actionLabel: 'View Operations',
      });
    } else if (ops.openIssues > 3) {
      items.push({
        id: 'ops-open-issues',
        title: `${ops.openIssues} open operational issues`,
        description: 'Multiple unresolved issues are affecting operational health.',
        source: 'operations',
        severity: 'high',
        actionPath: '/operations',
        actionLabel: 'View Issues',
      });
    }

    if (ops.tasksOverdue > 0) {
      items.push({
        id: 'ops-overdue-tasks',
        title: `${ops.tasksOverdue} recurring task${ops.tasksOverdue > 1 ? 's' : ''} overdue`,
        description: 'Overdue recurring tasks may be impacting operational reliability.',
        source: 'operations',
        severity: 'high',
        actionPath: '/operations',
        actionLabel: 'View Tasks',
      });
    }

    if (ops.tasksDueSoon > 0) {
      items.push({
        id: 'ops-tasks-due-soon',
        title: `${ops.tasksDueSoon} task${ops.tasksDueSoon > 1 ? 's' : ''} due soon`,
        description: 'Recurring tasks are coming due. Review and action before they become overdue.',
        source: 'operations',
        severity: 'low',
        actionPath: '/operations',
        actionLabel: 'View Tasks',
      });
    }
  }

  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return items.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
}

export function generateRecommendedAction(
  builder: BuilderHealth,
  simulation: SimulationHealth,
  launch: LaunchHealth,
  ops: OpsHealth
): RecommendedAction {
  if (builder.completenessPercent < 50) {
    return {
      category: 'complete_builder',
      title: 'Complete your Business Model',
      description:
        'Your Business Builder is only partially filled. A complete business model gives you a stronger foundation for simulation, launch planning, and operations.',
      path: '/builder',
      ctaLabel: 'Open Business Builder',
    };
  }

  if (!simulation.hasScenarios || !simulation.isViable) {
    return {
      category: 'run_simulation',
      title: 'Validate your Financial Assumptions',
      description:
        simulation.hasScenarios
          ? 'Your current simulation scenario is not showing a profit. Adjust your assumptions to identify a viable path to profitability.'
          : 'Run the Business Simulator to stress-test your financial assumptions and validate your business model before launch.',
      path: '/simulator',
      ctaLabel: 'Open Business Simulator',
    };
  }

  if (launch.hasPlan && launch.overallPercent < 80) {
    return {
      category: 'finish_launch',
      title: 'Advance your Launch Readiness',
      description: `You are ${launch.overallPercent}% ready for launch. The current focus area is ${launch.currentPhaseName || 'Foundation'}. Complete pending tasks to stay on track.`,
      path: '/planner',
      ctaLabel: 'Open Launch Planner',
    };
  }

  if (ops.hasData && (ops.criticalIssues > 0 || ops.tasksOverdue > 1)) {
    return {
      category: 'resolve_issues',
      title: 'Resolve Operational Issues',
      description:
        ops.criticalIssues > 0
          ? `You have ${ops.criticalIssues} critical operational issue${ops.criticalIssues > 1 ? 's' : ''} that require immediate attention.`
          : `You have ${ops.tasksOverdue} overdue recurring tasks. Address them to maintain operational health.`,
      path: '/operations',
      ctaLabel: 'Open Operations',
    };
  }

  if (ops.hasData && ops.overallHealth !== 'good') {
    return {
      category: 'review_operations',
      title: 'Review Your Operations',
      description:
        'Your operational health is not fully green. Review your recurring tasks, areas, and open issues to ensure smooth day-to-day operations.',
      path: '/operations',
      ctaLabel: 'Open Operations',
    };
  }

  return {
    category: 'business_running',
    title: 'Your Business is On Track',
    description:
      'Your business model is complete, simulation looks viable, and operations are healthy. Keep an eye on your key metrics and continue optimizing.',
    path: '/simulator',
    ctaLabel: 'Review Simulation',
  };
}
