export interface OfferConfig {
  productName: string;
  valueProposition: string;
  keyFeatures: string;
  pricingApproach: string;
}

export interface CustomerConfig {
  targetSegment: string;
  customerProblem: string;
  willingnessToPay: string;
  geographicFocus: string;
}

export interface RevenueModel {
  pricingModel: string;
  revenueStreams: string;
  averageTransactionValue: number | null;
  expectedSalesVolume: string;
}

export interface AcquisitionModel {
  marketingChannels: string;
  salesModel: string;
  conversionAssumptions: string;
  estimatedAcquisitionCost: number | null;
}

export interface OperationsModel {
  teamStructure: string;
  keyResources: string;
  suppliersOrPartners: string;
  operationalComplexity: string;
  capacityConstraints: string;
}

export interface FinancialSnapshot {
  expectedMonthlyRevenue: number | null;
  expectedMonthlyCosts: number | null;
  breakEvenEstimate: string;
  marginEstimate: number | null;
}

export interface BusinessModel {
  businessId: string;
  offer: OfferConfig;
  customer: CustomerConfig;
  revenue: RevenueModel;
  acquisition: AcquisitionModel;
  operations: OperationsModel;
  financials: FinancialSnapshot;
}

export type BusinessModelSection = keyof Omit<BusinessModel, 'businessId'>;
