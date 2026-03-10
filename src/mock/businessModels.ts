import { BusinessModel } from '../features/businessModel/types';

export const mockBusinessModels: BusinessModel[] = [
  {
    businessId: 'biz-001',
    offer: {
      productName: 'Specialty Coffee & Pastries',
      valueProposition:
        'A neighborhood café offering high-quality single-origin coffee and house-made pastries in a welcoming, cozy environment.',
      keyFeatures: 'Single-origin beans, house-roasted, seasonal menu, comfortable seating, free Wi-Fi',
      pricingApproach: 'Premium pricing for specialty drinks; mid-range for food items',
    },
    customer: {
      targetSegment: 'Urban professionals aged 25–45, remote workers, coffee enthusiasts',
      customerProblem:
        'Lack of a comfortable, high-quality third place between home and office for focused work or relaxed social time.',
      willingnessToPay: '$5–$8 per drink, $4–$9 per food item',
      geographicFocus: 'Austin, TX — South Congress neighborhood',
    },
    revenue: {
      pricingModel: 'Transactional — pay-per-order',
      revenueStreams: 'Espresso drinks, batch brew, food & pastries, merchandise, private events',
      averageTransactionValue: 14,
      expectedSalesVolume: '280–350 transactions per day',
    },
    acquisition: {
      marketingChannels: 'Instagram, Google Maps, local events, word-of-mouth, neighborhood newsletters',
      salesModel: 'Walk-in, mobile order ahead',
      conversionAssumptions: 'High foot traffic converts at ~40%; returning customers represent 60% of daily sales',
      estimatedAcquisitionCost: 8,
    },
    operations: {
      teamStructure: '1 manager, 3 full-time baristas, 2 part-time staff',
      keyResources: 'Espresso machines, grinders, POS system, commercial kitchen, seating capacity 40',
      suppliersOrPartners: 'Local roastery (primary), bakery supplier, dairy farm',
      operationalComplexity: 'Moderate — daily prep, consistent quality control, staff scheduling',
      capacityConstraints: 'Peak morning rush (7–10 AM), limited seating during weekends',
    },
    financials: {
      expectedMonthlyRevenue: 52000,
      expectedMonthlyCosts: 38000,
      breakEvenEstimate: '~230 transactions/day',
      marginEstimate: 27,
    },
  },
  {
    businessId: 'biz-002',
    offer: {
      productName: 'Curated Contemporary Fashion',
      valueProposition:
        'A boutique retail experience offering carefully selected contemporary clothing from independent designers not available in mainstream retail.',
      keyFeatures:
        'Independent designer labels, limited-edition drops, personalized styling assistance, sustainable sourcing',
      pricingApproach: 'Premium boutique pricing — differentiated from fast fashion',
    },
    customer: {
      targetSegment: 'Fashion-conscious women aged 22–40 seeking unique, quality pieces',
      customerProblem:
        'Difficulty finding distinctive, quality clothing that reflects personal style beyond mass-market options.',
      willingnessToPay: '$80–$400 per item, $200–$600 per basket',
      geographicFocus: 'Portland, OR — Pearl District; also online via Shopify',
    },
    revenue: {
      pricingModel: 'Transactional — product sales with seasonal promotions',
      revenueStreams: 'In-store sales, online store, styling consultations, private shopping events',
      averageTransactionValue: 280,
      expectedSalesVolume: '120–180 transactions per month in-store; 80–120 online',
    },
    acquisition: {
      marketingChannels: 'Instagram, Pinterest, fashion bloggers, email list, local press',
      salesModel: 'In-store walk-in, online DTC, event-based selling',
      conversionAssumptions: 'In-store browsing converts at ~35%; email list converts at ~12%',
      estimatedAcquisitionCost: 22,
    },
    operations: {
      teamStructure: '1 owner/buyer, 2 full-time sales associates, 1 part-time e-commerce manager',
      keyResources: 'Store space 1,200 sq ft, inventory management system, Shopify store, styling suite',
      suppliersOrPartners: '12 independent designer labels, 2 sustainable fabric importers',
      operationalComplexity: 'Moderate — seasonal buying cycles, inventory management, online fulfillment',
      capacityConstraints: 'Inventory storage, seasonal cash flow during buying season',
    },
    financials: {
      expectedMonthlyRevenue: 68000,
      expectedMonthlyCosts: 54000,
      breakEvenEstimate: '~90 in-store transactions/month at average basket',
      marginEstimate: 21,
    },
  },
  {
    businessId: 'biz-003',
    offer: {
      productName: 'Digital Growth & Brand Strategy',
      valueProposition:
        'A full-service digital agency helping growth-stage companies build brand presence, run performance marketing, and scale customer acquisition.',
      keyFeatures:
        'Brand strategy, paid media (Meta & Google), SEO, content production, analytics & reporting',
      pricingApproach: 'Monthly retainer model; project-based for one-off engagements',
    },
    customer: {
      targetSegment: 'B2B SaaS companies and DTC e-commerce brands with $500K–$10M ARR',
      customerProblem:
        'Lack of in-house marketing expertise and bandwidth to execute multi-channel growth campaigns at scale.',
      willingnessToPay: '$4,000–$15,000/month retainer depending on scope',
      geographicFocus: 'Remote-first, US market with some European clients',
    },
    revenue: {
      pricingModel: 'Monthly retainer + project fees + performance bonuses',
      revenueStreams: 'Strategy retainers, paid media management, content production, brand audits',
      averageTransactionValue: 7500,
      expectedSalesVolume: '8–12 active retainer clients per quarter',
    },
    acquisition: {
      marketingChannels: 'LinkedIn, referral network, content marketing, industry events, cold outreach',
      salesModel: 'Consultative sales — discovery call → proposal → negotiation → onboarding',
      conversionAssumptions: 'Lead-to-client conversion ~18%; avg sales cycle 3–5 weeks',
      estimatedAcquisitionCost: 1200,
    },
    operations: {
      teamStructure: '1 founder/strategist, 2 account managers, 3 specialists (paid media, SEO, content)',
      keyResources: 'Project management tools, analytics stack, creative production pipeline',
      suppliersOrPartners: 'Freelance designers, video production, media buying platforms',
      operationalComplexity: 'High — custom deliverables per client, multiple concurrent projects',
      capacityConstraints: 'Team bandwidth caps at ~14 active clients without additional hires',
    },
    financials: {
      expectedMonthlyRevenue: 78000,
      expectedMonthlyCosts: 55000,
      breakEvenEstimate: '~6 retainer clients at average rate',
      marginEstimate: 29,
    },
  },
];
