import {
  BusinessOperationsData,
  OperationsSummary,
  RecurringTask,
  OperationalIssue,
} from './types';

const DUE_SOON_LABELS = ['Today', 'Tomorrow', 'This Week'];

export function computeOperationsSummary(data: BusinessOperationsData): OperationsSummary {
  const { areas, recurringTasks, issues } = data;

  const healthyAreas = areas.filter((a) => a.status === 'healthy').length;
  const atRiskAreas = areas.filter((a) => a.status === 'at_risk').length;
  const criticalAreas = areas.filter((a) => a.status === 'critical').length;

  const openIssues = issues.filter((i) => i.status !== 'resolved').length;
  const criticalIssues = issues.filter(
    (i) => i.severity === 'critical' && i.status !== 'resolved'
  ).length;

  const tasksDueSoon = recurringTasks.filter(
    (t) => DUE_SOON_LABELS.includes(t.nextDue) && t.status !== 'completed'
  ).length;
  const tasksOverdue = recurringTasks.filter((t) => t.status === 'overdue').length;
  const tasksCompleted = recurringTasks.filter((t) => t.status === 'completed').length;

  let overallHealth: 'good' | 'fair' | 'poor' = 'good';
  if (criticalAreas > 0 || criticalIssues > 0 || tasksOverdue > 2) {
    overallHealth = 'poor';
  } else if (atRiskAreas > 0 || openIssues > 2 || tasksOverdue > 0) {
    overallHealth = 'fair';
  }

  return {
    totalAreas: areas.length,
    healthyAreas,
    atRiskAreas,
    criticalAreas,
    openIssues,
    criticalIssues,
    tasksDueSoon,
    tasksOverdue,
    tasksCompleted,
    overallHealth,
  };
}

export function getTasksDueSoon(tasks: RecurringTask[]): RecurringTask[] {
  return tasks.filter(
    (t) => DUE_SOON_LABELS.includes(t.nextDue) && t.status !== 'completed'
  );
}

export function getOverdueTasks(tasks: RecurringTask[]): RecurringTask[] {
  return tasks.filter((t) => t.status === 'overdue');
}

export function getHighPriorityIssues(issues: OperationalIssue[]): OperationalIssue[] {
  return issues.filter(
    (i) => (i.severity === 'critical' || i.severity === 'high') && i.status !== 'resolved'
  );
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
