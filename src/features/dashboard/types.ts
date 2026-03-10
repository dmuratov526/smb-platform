export type HealthStatus = 'good' | 'fair' | 'poor' | 'unknown';

export type PriorityItemSource =
  | 'builder'
  | 'simulation'
  | 'launch'
  | 'operations';

export type PriorityItemSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface DashboardPriorityItem {
  id: string;
  title: string;
  description: string;
  source: PriorityItemSource;
  severity: PriorityItemSeverity;
  actionPath?: string;
  actionLabel?: string;
}

export type RecommendationCategory =
  | 'complete_builder'
  | 'run_simulation'
  | 'finish_launch'
  | 'resolve_issues'
  | 'review_operations'
  | 'business_running';

export interface RecommendedAction {
  category: RecommendationCategory;
  title: string;
  description: string;
  path: string;
  ctaLabel: string;
}

export interface BuilderSectionHealth {
  key: string;
  label: string;
  filled: number;
  total: number;
  complete: boolean;
}

export interface BuilderHealth {
  totalFields: number;
  filledFields: number;
  completenessPercent: number;
  sections: BuilderSectionHealth[];
  isComplete: boolean;
}

export interface SimulationHealth {
  hasScenarios: boolean;
  activeScenarioName: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  operatingProfit: number;
  operatingMargin: number;
  breakEvenRevenue: number;
  isViable: boolean;
}

export interface LaunchHealth {
  hasPlan: boolean;
  overallPercent: number;
  completedTasks: number;
  totalTasks: number;
  remainingTasks: number;
  blockedTasks: number;
  currentPhaseName: string;
  nextMilestoneName: string;
}

export interface OpsHealth {
  hasData: boolean;
  overallHealth: 'good' | 'fair' | 'poor';
  openIssues: number;
  criticalIssues: number;
  tasksDueSoon: number;
  tasksOverdue: number;
  tasksCompleted: number;
}

export interface DashboardSummaryData {
  builder: BuilderHealth;
  simulation: SimulationHealth;
  launch: LaunchHealth;
  ops: OpsHealth;
  priorityItems: DashboardPriorityItem[];
  recommendedAction: RecommendedAction;
}
