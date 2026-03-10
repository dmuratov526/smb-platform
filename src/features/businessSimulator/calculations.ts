import { SimulatorAssumptions, SimulatorResults } from './types';

export function computeResults(assumptions: SimulatorAssumptions): SimulatorResults {
  const { revenue, acquisition, costs } = assumptions;

  const monthlyRevenue = revenue.pricePerUnit * revenue.monthlySalesVolume;
  const variableCosts = monthlyRevenue * (costs.variableCostPercent / 100);
  const grossProfit = monthlyRevenue - variableCosts;
  const grossMargin = monthlyRevenue > 0 ? (grossProfit / monthlyRevenue) * 100 : 0;

  const totalFixedCosts =
    costs.fixedCosts + costs.payroll + costs.marketingSpend + costs.otherOperatingCosts;
  const operatingProfit = grossProfit - totalFixedCosts;
  const operatingMargin = monthlyRevenue > 0 ? (operatingProfit / monthlyRevenue) * 100 : 0;

  const contributionMarginRate = 1 - costs.variableCostPercent / 100;
  const breakEvenRevenue =
    contributionMarginRate > 0 ? totalFixedCosts / contributionMarginRate : 0;
  const breakEvenUnits =
    revenue.pricePerUnit > 0 ? breakEvenRevenue / revenue.pricePerUnit : 0;

  const monthlyNewCustomers = acquisition.monthlyLeads * (acquisition.conversionRate / 100);

  return {
    monthlyRevenue: Math.round(monthlyRevenue),
    variableCosts: Math.round(variableCosts),
    grossProfit: Math.round(grossProfit),
    grossMargin: Math.round(grossMargin * 10) / 10,
    totalFixedCosts: Math.round(totalFixedCosts),
    operatingProfit: Math.round(operatingProfit),
    operatingMargin: Math.round(operatingMargin * 10) / 10,
    breakEvenRevenue: Math.round(breakEvenRevenue),
    breakEvenUnits: Math.round(breakEvenUnits),
    monthlyNewCustomers: Math.round(monthlyNewCustomers),
  };
}

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getDelta(current: number, base: number): number {
  if (base === 0) return 0;
  return Math.round(((current - base) / Math.abs(base)) * 100);
}
