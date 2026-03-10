export type BusinessStatus = 'draft' | 'active' | 'paused' | 'archived';

export type BusinessIndustry =
  | 'food_service'
  | 'retail'
  | 'services'
  | 'manufacturing'
  | 'workshop'
  | 'digital'
  | 'other';

export interface Business {
  id: string;
  name: string;
  industry: BusinessIndustry;
  description: string;
  status: BusinessStatus;
  location: string;
  logoColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueStream {
  id: string;
  name: string;
  type: 'product' | 'service' | 'subscription' | 'other';
  monthlyAmount: number;
  description?: string;
}

export interface CostCategory {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
  monthlyAmount: number;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  type: 'full_time' | 'part_time' | 'contractor';
  monthlyCost: number;
}

export interface MarketingChannel {
  id: string;
  name: string;
  monthlyBudget: number;
  expectedReach: number;
  type: 'social' | 'search' | 'email' | 'print' | 'events' | 'referral' | 'other';
}

export interface BusinessConfiguration {
  businessId: string;
  revenueStreams: RevenueStream[];
  costCategories: CostCategory[];
  employees: Employee[];
  marketingChannels: MarketingChannel[];
  initialBudget: number;
  targetMonthlyRevenue: number;
}

export interface SimulationInputs {
  revenueMultiplier: number;
  costMultiplier: number;
  marketingBudget: number;
  staffingCost: number;
  pricePerUnit: number;
  expectedDemand: number;
  rentCost: number;
}

export interface SimulationOutputs {
  projectedRevenue: number;
  projectedExpenses: number;
  projectedProfit: number;
  profitMargin: number;
  breakEvenPoint: number;
  cashRunway: number;
  capitalRequired: number;
}

export interface SimulationScenario {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  inputs: SimulationInputs;
  outputs: SimulationOutputs;
  createdAt: string;
}

export type LaunchTaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type LaunchTaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface LaunchTask {
  id: string;
  title: string;
  description?: string;
  status: LaunchTaskStatus;
  priority: LaunchTaskPriority;
  category: string;
  dueDate?: string;
  dependsOn?: string[];
}

export interface LaunchMilestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  taskIds: string[];
}

export interface LaunchPlan {
  businessId: string;
  tasks: LaunchTask[];
  milestones: LaunchMilestone[];
  targetLaunchDate: string;
  readinessScore: number;
}

export interface FinancialTransaction {
  id: string;
  businessId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface MarketingCampaign {
  id: string;
  businessId: string;
  name: string;
  channel: string;
  budget: number;
  spent: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  leads: number;
  conversions: number;
}

export type AlertSeverity = 'info' | 'warning' | 'error' | 'success';

export interface Alert {
  id: string;
  businessId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  read: boolean;
  category: 'finance' | 'operations' | 'marketing' | 'team' | 'system';
}

export interface DashboardSummary {
  businessId: string;
  revenue: { current: number; previous: number; target: number };
  expenses: { current: number; previous: number };
  profit: { current: number; previous: number };
  cashBalance: number;
  cashRunway: number;
  pendingTasks: number;
  activeAlerts: number;
  marketingROI: number;
  teamSize: number;
}

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}
