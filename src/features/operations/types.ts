export type AreaStatus = 'healthy' | 'at_risk' | 'critical';

export type RecurringTaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export type RecurringTaskFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface OperationalArea {
  id: string;
  name: string;
  description: string;
  status: AreaStatus;
  owner?: string;
}

export interface RecurringTask {
  id: string;
  title: string;
  description?: string;
  frequency: RecurringTaskFrequency;
  status: RecurringTaskStatus;
  nextDue: string;
  areaId: string;
  owner?: string;
}

export interface OperationalIssue {
  id: string;
  title: string;
  description?: string;
  severity: IssueSeverity;
  status: IssueStatus;
  areaId: string;
  owner?: string;
  createdAt: string;
}

export interface BusinessOperationsData {
  businessId: string;
  areas: OperationalArea[];
  recurringTasks: RecurringTask[];
  issues: OperationalIssue[];
}

export interface OperationsState {
  data: Record<string, BusinessOperationsData>;
}

export interface OperationsSummary {
  totalAreas: number;
  healthyAreas: number;
  atRiskAreas: number;
  criticalAreas: number;
  openIssues: number;
  criticalIssues: number;
  tasksDueSoon: number;
  tasksOverdue: number;
  tasksCompleted: number;
  overallHealth: 'good' | 'fair' | 'poor';
}
