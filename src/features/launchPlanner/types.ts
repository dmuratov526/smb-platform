export type PlannerTaskStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';

export interface PlannerTask {
  id: string;
  phaseId: string;
  title: string;
  description?: string;
  status: PlannerTaskStatus;
  owner?: string;
  dueTiming?: string;
}

export interface LaunchPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  tasks: PlannerTask[];
}

export interface PlannerPlan {
  businessId: string;
  phases: LaunchPhase[];
  targetLaunchDate: string;
}

export interface PhaseReadiness {
  phaseId: string;
  name: string;
  completedTasks: number;
  inProgressTasks: number;
  totalTasks: number;
  percent: number;
}

export interface LaunchReadiness {
  overallPercent: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  remainingTasks: number;
  totalTasks: number;
  phaseReadiness: PhaseReadiness[];
  activePhaseIndex: number;
}

export interface TaskTemplate {
  title: string;
  description?: string;
  dueTiming?: string;
}

export interface PhaseTaskSet {
  phaseId: string;
  tasks: TaskTemplate[];
}

export interface PhaseDefinition {
  id: string;
  name: string;
  description: string;
  order: number;
}
