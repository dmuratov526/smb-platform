export interface FinanceCategoryItem {
  id: string;
  category: string;
  amount: number;
  percentOfTotal: number;
  trend: 'up' | 'down' | 'flat';
  changePercent: number;
}

export interface MonthlyFinancial {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
}

export interface FinanceBudgetItem {
  category: string;
  budgeted: number;
  actual: number;
}

export const mockIncomeCategories: Record<string, FinanceCategoryItem[]> = {
  'biz-001': [
    { id: 'inc-01', category: 'Coffee Sales', amount: 22000, percentOfTotal: 53.4, trend: 'up', changePercent: 4.2 },
    { id: 'inc-02', category: 'Food Sales', amount: 10000, percentOfTotal: 24.3, trend: 'up', changePercent: 7.1 },
    { id: 'inc-03', category: 'Retail / Beans', amount: 5000, percentOfTotal: 12.1, trend: 'flat', changePercent: 0.5 },
    { id: 'inc-04', category: 'Events & Catering', amount: 4200, percentOfTotal: 10.2, trend: 'up', changePercent: 18.0 },
  ],
  'biz-002': [
    { id: 'inc-05', category: 'Online Sales', amount: 9800, percentOfTotal: 53.0, trend: 'up', changePercent: 22.5 },
    { id: 'inc-06', category: 'In-Store Sales', amount: 6200, percentOfTotal: 33.5, trend: 'flat', changePercent: 1.2 },
    { id: 'inc-07', category: 'Wholesale', amount: 2500, percentOfTotal: 13.5, trend: 'up', changePercent: 9.0 },
  ],
  'biz-003': [
    { id: 'inc-08', category: 'Retainer Clients', amount: 38000, percentOfTotal: 56.7, trend: 'up', changePercent: 5.6 },
    { id: 'inc-09', category: 'Project Work', amount: 22000, percentOfTotal: 32.8, trend: 'up', changePercent: 9.2 },
    { id: 'inc-10', category: 'Consulting', amount: 7000, percentOfTotal: 10.4, trend: 'down', changePercent: -8.3 },
  ],
};

export const mockExpenseCategories: Record<string, FinanceCategoryItem[]> = {
  'biz-001': [
    { id: 'exp-01', category: 'Payroll', amount: 14000, percentOfTotal: 40.9, trend: 'flat', changePercent: 0.0 },
    { id: 'exp-02', category: 'COGS', amount: 9500, percentOfTotal: 27.7, trend: 'up', changePercent: 3.3 },
    { id: 'exp-03', category: 'Rent & Utilities', amount: 8500, percentOfTotal: 24.8, trend: 'flat', changePercent: 0.0 },
    { id: 'exp-04', category: 'Marketing', amount: 1200, percentOfTotal: 3.5, trend: 'down', changePercent: -15.0 },
    { id: 'exp-05', category: 'Other', amount: 1050, percentOfTotal: 3.1, trend: 'flat', changePercent: 2.1 },
  ],
  'biz-002': [
    { id: 'exp-06', category: 'COGS / Inventory', amount: 11000, percentOfTotal: 44.2, trend: 'up', changePercent: 8.0 },
    { id: 'exp-07', category: 'Payroll', amount: 7800, percentOfTotal: 31.3, trend: 'flat', changePercent: 0.0 },
    { id: 'exp-08', category: 'Rent', amount: 3900, percentOfTotal: 15.7, trend: 'flat', changePercent: 0.0 },
    { id: 'exp-09', category: 'Marketing', amount: 1400, percentOfTotal: 5.6, trend: 'up', changePercent: 16.7 },
    { id: 'exp-10', category: 'Other', amount: 800, percentOfTotal: 3.2, trend: 'flat', changePercent: 0.0 },
  ],
  'biz-003': [
    { id: 'exp-11', category: 'Payroll', amount: 24000, percentOfTotal: 58.3, trend: 'up', changePercent: 4.3 },
    { id: 'exp-12', category: 'Software & Tools', amount: 4800, percentOfTotal: 11.7, trend: 'up', changePercent: 20.0 },
    { id: 'exp-13', category: 'Office & Coworking', amount: 3600, percentOfTotal: 8.7, trend: 'flat', changePercent: 0.0 },
    { id: 'exp-14', category: 'Marketing', amount: 5500, percentOfTotal: 13.3, trend: 'down', changePercent: -8.3 },
    { id: 'exp-15', category: 'Other', amount: 3300, percentOfTotal: 8.0, trend: 'up', changePercent: 10.0 },
  ],
};

export const mockMonthlyFinancials: Record<string, MonthlyFinancial[]> = {
  'biz-001': [
    { month: 'Oct', revenue: 36200, expenses: 32800, net: 3400 },
    { month: 'Nov', revenue: 37800, expenses: 33100, net: 4700 },
    { month: 'Dec', revenue: 42100, expenses: 33600, net: 8500 },
    { month: 'Jan', revenue: 35900, expenses: 32200, net: 3700 },
    { month: 'Feb', revenue: 38500, expenses: 33800, net: 4700 },
    { month: 'Mar', revenue: 41200, expenses: 34250, net: 6950 },
  ],
  'biz-002': [
    { month: 'Oct', revenue: 10200, expenses: 18500, net: -8300 },
    { month: 'Nov', revenue: 11400, expenses: 19200, net: -7800 },
    { month: 'Dec', revenue: 14500, expenses: 20100, net: -5600 },
    { month: 'Jan', revenue: 11800, expenses: 20400, net: -8600 },
    { month: 'Feb', revenue: 12000, expenses: 21000, net: -9000 },
    { month: 'Mar', revenue: 18500, expenses: 24900, net: -6400 },
  ],
  'biz-003': [
    { month: 'Oct', revenue: 54000, expenses: 37200, net: 16800 },
    { month: 'Nov', revenue: 58500, expenses: 38100, net: 20400 },
    { month: 'Dec', revenue: 61200, expenses: 39400, net: 21800 },
    { month: 'Jan', revenue: 59800, expenses: 38800, net: 21000 },
    { month: 'Feb', revenue: 61500, expenses: 39000, net: 22500 },
    { month: 'Mar', revenue: 67000, expenses: 41200, net: 25800 },
  ],
};

export interface AnnualPlanMonth {
  month: string;
  revenueTgt: number;
  expenseTgt: number;
  revenueAct?: number;
  expenseAct?: number;
}

export interface AnnualPlanData {
  year: number;
  annualRevenueGoal: number;
  annualExpenseBudget: number;
  months: AnnualPlanMonth[];
}

export const mockAnnualPlan: Record<string, AnnualPlanData> = {
  'biz-001': {
    year: 2025,
    annualRevenueGoal: 520000,
    annualExpenseBudget: 415000,
    months: [
      { month: 'Jan', revenueTgt: 38000, expenseTgt: 32000, revenueAct: 35900, expenseAct: 32200 },
      { month: 'Feb', revenueTgt: 39000, expenseTgt: 33000, revenueAct: 38500, expenseAct: 33800 },
      { month: 'Mar', revenueTgt: 41000, expenseTgt: 33500, revenueAct: 41200, expenseAct: 34250 },
      { month: 'Apr', revenueTgt: 42000, expenseTgt: 34000 },
      { month: 'May', revenueTgt: 43000, expenseTgt: 34000 },
      { month: 'Jun', revenueTgt: 44000, expenseTgt: 34500 },
      { month: 'Jul', revenueTgt: 44000, expenseTgt: 34500 },
      { month: 'Aug', revenueTgt: 44500, expenseTgt: 34500 },
      { month: 'Sep', revenueTgt: 45000, expenseTgt: 34500 },
      { month: 'Oct', revenueTgt: 46000, expenseTgt: 35000 },
      { month: 'Nov', revenueTgt: 47000, expenseTgt: 35000 },
      { month: 'Dec', revenueTgt: 50000, expenseTgt: 36000 },
    ],
  },
  'biz-002': {
    year: 2025,
    annualRevenueGoal: 350000,
    annualExpenseBudget: 320000,
    months: [
      { month: 'Jan', revenueTgt: 12000, expenseTgt: 20000, revenueAct: 11800, expenseAct: 20400 },
      { month: 'Feb', revenueTgt: 14000, expenseTgt: 21000, revenueAct: 12000, expenseAct: 21000 },
      { month: 'Mar', revenueTgt: 16000, expenseTgt: 22000, revenueAct: 18500, expenseAct: 24900 },
      { month: 'Apr', revenueTgt: 20000, expenseTgt: 23000 },
      { month: 'May', revenueTgt: 24000, expenseTgt: 24000 },
      { month: 'Jun', revenueTgt: 28000, expenseTgt: 25000 },
      { month: 'Jul', revenueTgt: 32000, expenseTgt: 26000 },
      { month: 'Aug', revenueTgt: 35000, expenseTgt: 27000 },
      { month: 'Sep', revenueTgt: 38000, expenseTgt: 28000 },
      { month: 'Oct', revenueTgt: 40000, expenseTgt: 28500 },
      { month: 'Nov', revenueTgt: 42000, expenseTgt: 29000 },
      { month: 'Dec', revenueTgt: 48000, expenseTgt: 30000 },
    ],
  },
  'biz-003': {
    year: 2025,
    annualRevenueGoal: 820000,
    annualExpenseBudget: 500000,
    months: [
      { month: 'Jan', revenueTgt: 60000, expenseTgt: 39000, revenueAct: 59800, expenseAct: 38800 },
      { month: 'Feb', revenueTgt: 62000, expenseTgt: 39500, revenueAct: 61500, expenseAct: 39000 },
      { month: 'Mar', revenueTgt: 65000, expenseTgt: 40000, revenueAct: 67000, expenseAct: 41200 },
      { month: 'Apr', revenueTgt: 67000, expenseTgt: 40500 },
      { month: 'May', revenueTgt: 68000, expenseTgt: 41000 },
      { month: 'Jun', revenueTgt: 70000, expenseTgt: 41500 },
      { month: 'Jul', revenueTgt: 70000, expenseTgt: 41500 },
      { month: 'Aug', revenueTgt: 71000, expenseTgt: 42000 },
      { month: 'Sep', revenueTgt: 72000, expenseTgt: 42000 },
      { month: 'Oct', revenueTgt: 73000, expenseTgt: 42500 },
      { month: 'Nov', revenueTgt: 74000, expenseTgt: 43000 },
      { month: 'Dec', revenueTgt: 77000, expenseTgt: 43500 },
    ],
  },
};

export const mockBudgetItems: Record<string, FinanceBudgetItem[]> = {
  'biz-001': [
    { category: 'Payroll', budgeted: 14000, actual: 14000 },
    { category: 'COGS', budgeted: 9000, actual: 9500 },
    { category: 'Rent & Utilities', budgeted: 8500, actual: 8500 },
    { category: 'Marketing', budgeted: 1500, actual: 1200 },
    { category: 'Other', budgeted: 900, actual: 1050 },
  ],
  'biz-002': [
    { category: 'COGS / Inventory', budgeted: 10000, actual: 11000 },
    { category: 'Payroll', budgeted: 7800, actual: 7800 },
    { category: 'Rent', budgeted: 3900, actual: 3900 },
    { category: 'Marketing', budgeted: 1200, actual: 1400 },
    { category: 'Other', budgeted: 800, actual: 800 },
  ],
  'biz-003': [
    { category: 'Payroll', budgeted: 23000, actual: 24000 },
    { category: 'Software & Tools', budgeted: 4000, actual: 4800 },
    { category: 'Office & Coworking', budgeted: 3600, actual: 3600 },
    { category: 'Marketing', budgeted: 6000, actual: 5500 },
    { category: 'Other', budgeted: 3000, actual: 3300 },
  ],
};
