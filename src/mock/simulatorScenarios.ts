import { SimulatorScenario } from '../features/businessSimulator/types';

export const mockSimulatorScenarios: SimulatorScenario[] = [
  // ─── biz-001: Brewed Awakening (Specialty Café) ───────────────────────────
  {
    id: 'bsim-001-base',
    businessId: 'biz-001',
    name: 'Base Case',
    description: 'Current operating assumptions based on the business model.',
    type: 'base',
    assumptions: {
      revenue: {
        pricePerUnit: 14,
        monthlySalesVolume: 3700,
        repeatPurchaseRate: 65,
      },
      acquisition: {
        monthlyLeads: 6000,
        conversionRate: 40,
        acquisitionCost: 8,
      },
      costs: {
        fixedCosts: 9000,
        variableCostPercent: 28,
        payroll: 14000,
        marketingSpend: 1200,
        otherOperatingCosts: 2500,
      },
    },
  },
  {
    id: 'bsim-001-best',
    businessId: 'biz-001',
    name: 'Best Case',
    description: 'Expanded hours, menu additions, and higher customer volume.',
    type: 'best',
    assumptions: {
      revenue: {
        pricePerUnit: 16,
        monthlySalesVolume: 4800,
        repeatPurchaseRate: 75,
      },
      acquisition: {
        monthlyLeads: 8000,
        conversionRate: 48,
        acquisitionCost: 6,
      },
      costs: {
        fixedCosts: 9000,
        variableCostPercent: 25,
        payroll: 17000,
        marketingSpend: 2200,
        otherOperatingCosts: 2500,
      },
    },
  },
  {
    id: 'bsim-001-worst',
    businessId: 'biz-001',
    name: 'Worst Case',
    description: 'Lower foot traffic, pricing pressure, and increased costs.',
    type: 'worst',
    assumptions: {
      revenue: {
        pricePerUnit: 12,
        monthlySalesVolume: 2600,
        repeatPurchaseRate: 48,
      },
      acquisition: {
        monthlyLeads: 3800,
        conversionRate: 30,
        acquisitionCost: 13,
      },
      costs: {
        fixedCosts: 9500,
        variableCostPercent: 33,
        payroll: 14000,
        marketingSpend: 800,
        otherOperatingCosts: 3000,
      },
    },
  },

  // ─── biz-002: Apex Threads (Boutique Retail) ──────────────────────────────
  {
    id: 'bsim-002-base',
    businessId: 'biz-002',
    name: 'Base Case',
    description: 'Current assumptions for in-store and online combined sales.',
    type: 'base',
    assumptions: {
      revenue: {
        pricePerUnit: 280,
        monthlySalesVolume: 240,
        repeatPurchaseRate: 30,
      },
      acquisition: {
        monthlyLeads: 800,
        conversionRate: 35,
        acquisitionCost: 22,
      },
      costs: {
        fixedCosts: 6500,
        variableCostPercent: 44,
        payroll: 12000,
        marketingSpend: 3000,
        otherOperatingCosts: 2500,
      },
    },
  },
  {
    id: 'bsim-002-best',
    businessId: 'biz-002',
    name: 'Best Case',
    description: 'Strong seasonal demand, brand recognition, and higher basket value.',
    type: 'best',
    assumptions: {
      revenue: {
        pricePerUnit: 320,
        monthlySalesVolume: 310,
        repeatPurchaseRate: 40,
      },
      acquisition: {
        monthlyLeads: 1200,
        conversionRate: 42,
        acquisitionCost: 17,
      },
      costs: {
        fixedCosts: 6500,
        variableCostPercent: 40,
        payroll: 14000,
        marketingSpend: 5000,
        otherOperatingCosts: 2500,
      },
    },
  },
  {
    id: 'bsim-002-worst',
    businessId: 'biz-002',
    name: 'Worst Case',
    description: 'Slow season, higher inventory carrying costs, reduced foot traffic.',
    type: 'worst',
    assumptions: {
      revenue: {
        pricePerUnit: 245,
        monthlySalesVolume: 155,
        repeatPurchaseRate: 20,
      },
      acquisition: {
        monthlyLeads: 480,
        conversionRate: 26,
        acquisitionCost: 30,
      },
      costs: {
        fixedCosts: 7000,
        variableCostPercent: 50,
        payroll: 12000,
        marketingSpend: 1500,
        otherOperatingCosts: 3000,
      },
    },
  },

  // ─── biz-003: Brightline Digital (Agency) ─────────────────────────────────
  {
    id: 'bsim-003-base',
    businessId: 'biz-003',
    name: 'Base Case',
    description: 'Current retainer client base with stable monthly revenue.',
    type: 'base',
    assumptions: {
      revenue: {
        pricePerUnit: 7500,
        monthlySalesVolume: 10,
        repeatPurchaseRate: 85,
      },
      acquisition: {
        monthlyLeads: 25,
        conversionRate: 18,
        acquisitionCost: 1200,
      },
      costs: {
        fixedCosts: 3000,
        variableCostPercent: 15,
        payroll: 38000,
        marketingSpend: 2500,
        otherOperatingCosts: 3000,
      },
    },
  },
  {
    id: 'bsim-003-best',
    businessId: 'biz-003',
    name: 'Best Case',
    description: 'Scaled client base, higher retainer rates, strong referral pipeline.',
    type: 'best',
    assumptions: {
      revenue: {
        pricePerUnit: 9000,
        monthlySalesVolume: 13,
        repeatPurchaseRate: 90,
      },
      acquisition: {
        monthlyLeads: 40,
        conversionRate: 24,
        acquisitionCost: 900,
      },
      costs: {
        fixedCosts: 3500,
        variableCostPercent: 12,
        payroll: 44000,
        marketingSpend: 4000,
        otherOperatingCosts: 3500,
      },
    },
  },
  {
    id: 'bsim-003-worst',
    businessId: 'biz-003',
    name: 'Worst Case',
    description: 'Client churn, longer sales cycles, and increased delivery costs.',
    type: 'worst',
    assumptions: {
      revenue: {
        pricePerUnit: 6500,
        monthlySalesVolume: 7,
        repeatPurchaseRate: 72,
      },
      acquisition: {
        monthlyLeads: 14,
        conversionRate: 12,
        acquisitionCost: 1600,
      },
      costs: {
        fixedCosts: 3000,
        variableCostPercent: 20,
        payroll: 38000,
        marketingSpend: 1500,
        otherOperatingCosts: 4000,
      },
    },
  },
];
