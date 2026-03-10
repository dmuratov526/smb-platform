export type ScenarioType = 'base' | 'best' | 'worst';

export interface RevenueAssumptions {
  pricePerUnit: number;
  monthlySalesVolume: number;
  repeatPurchaseRate: number;
}

export interface AcquisitionAssumptions {
  monthlyLeads: number;
  conversionRate: number;
  acquisitionCost: number;
}

export interface CostAssumptions {
  fixedCosts: number;
  variableCostPercent: number;
  payroll: number;
  marketingSpend: number;
  otherOperatingCosts: number;
}

export interface SimulatorAssumptions {
  revenue: RevenueAssumptions;
  acquisition: AcquisitionAssumptions;
  costs: CostAssumptions;
}

export interface SimulatorResults {
  monthlyRevenue: number;
  variableCosts: number;
  grossProfit: number;
  grossMargin: number;
  totalFixedCosts: number;
  operatingProfit: number;
  operatingMargin: number;
  breakEvenRevenue: number;
  breakEvenUnits: number;
  monthlyNewCustomers: number;
}

export interface SimulatorScenario {
  id: string;
  businessId: string;
  name: string;
  description: string;
  type: ScenarioType;
  assumptions: SimulatorAssumptions;
}
