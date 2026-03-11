import { SimulatorScenario } from './types';

/**
 * Generate 3 default scenarios (base, best, worst) for a new business.
 * Uses reasonable default assumptions that can be adjusted by the user.
 */
export function generateDefaultScenarios(businessId: string): SimulatorScenario[] {
  const timestamp = Date.now();

  return [
    {
      id: `sim-${businessId}-base-${timestamp}`,
      businessId,
      name: 'Base Case',
      description: 'Realistic assumptions based on typical market conditions.',
      type: 'base',
      assumptions: {
        revenue: {
          pricePerUnit: 100,
          monthlySalesVolume: 100,
          repeatPurchaseRate: 50,
        },
        acquisition: {
          monthlyLeads: 500,
          conversionRate: 20,
          acquisitionCost: 25,
        },
        costs: {
          fixedCosts: 5000,
          variableCostPercent: 30,
          payroll: 10000,
          marketingSpend: 2000,
          otherOperatingCosts: 2000,
        },
      },
    },
    {
      id: `sim-${businessId}-best-${timestamp}`,
      businessId,
      name: 'Best Case',
      description: 'Optimistic scenario with strong market response and efficiency.',
      type: 'best',
      assumptions: {
        revenue: {
          pricePerUnit: 120,
          monthlySalesVolume: 150,
          repeatPurchaseRate: 65,
        },
        acquisition: {
          monthlyLeads: 800,
          conversionRate: 28,
          acquisitionCost: 18,
        },
        costs: {
          fixedCosts: 5000,
          variableCostPercent: 25,
          payroll: 12000,
          marketingSpend: 3000,
          otherOperatingCosts: 2000,
        },
      },
    },
    {
      id: `sim-${businessId}-worst-${timestamp}`,
      businessId,
      name: 'Worst Case',
      description: 'Conservative scenario with market challenges and higher costs.',
      type: 'worst',
      assumptions: {
        revenue: {
          pricePerUnit: 85,
          monthlySalesVolume: 65,
          repeatPurchaseRate: 35,
        },
        acquisition: {
          monthlyLeads: 300,
          conversionRate: 15,
          acquisitionCost: 35,
        },
        costs: {
          fixedCosts: 5500,
          variableCostPercent: 38,
          payroll: 10000,
          marketingSpend: 1500,
          otherOperatingCosts: 2500,
        },
      },
    },
  ];
}
