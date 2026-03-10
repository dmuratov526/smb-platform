import { BusinessCategoryKey, BusinessIndustry } from '../../../types';

export interface BusinessCategory {
  key: BusinessCategoryKey;
  label: string;
  group: string;
  description: string;
  industryMapping: BusinessIndustry;
  logoColor: string;
}

export const businessCategories: BusinessCategory[] = [
  // Local & Service
  {
    key: 'restaurant_cafe',
    label: 'Restaurant / Cafe',
    group: 'Local & Service',
    description: 'Food service venue with dine-in, takeaway, or delivery',
    industryMapping: 'food_service',
    logoColor: '#C8702A',
  },
  {
    key: 'salon_barbershop',
    label: 'Salon / Barbershop',
    group: 'Local & Service',
    description: 'Personal care and grooming services',
    industryMapping: 'services',
    logoColor: '#EC4899',
  },
  {
    key: 'fitness_studio',
    label: 'Fitness Studio / Gym',
    group: 'Local & Service',
    description: 'Health, fitness, and wellness facility',
    industryMapping: 'services',
    logoColor: '#F97316',
  },
  {
    key: 'cleaning_service',
    label: 'Cleaning Service',
    group: 'Local & Service',
    description: 'Residential or commercial cleaning operations',
    industryMapping: 'services',
    logoColor: '#06B6D4',
  },
  {
    key: 'repair_service',
    label: 'Repair Service',
    group: 'Local & Service',
    description: 'Equipment, vehicle, or property repair',
    industryMapping: 'services',
    logoColor: '#64748B',
  },
  {
    key: 'healthcare_clinic',
    label: 'Healthcare Clinic',
    group: 'Local & Service',
    description: 'Medical, dental, or wellness clinic',
    industryMapping: 'services',
    logoColor: '#0EA5E9',
  },
  {
    key: 'education_tutoring',
    label: 'Education / Tutoring',
    group: 'Local & Service',
    description: 'Learning programs, tutoring, or training services',
    industryMapping: 'services',
    logoColor: '#A855F7',
  },
  {
    key: 'consulting_agency',
    label: 'Consulting / Agency',
    group: 'Local & Service',
    description: 'Professional services, consulting, or creative agency',
    industryMapping: 'services',
    logoColor: '#7C3AED',
  },
  // Commerce
  {
    key: 'ecommerce',
    label: 'E-commerce Brand',
    group: 'Commerce',
    description: 'Online-first product brand selling direct to consumers',
    industryMapping: 'retail',
    logoColor: '#F59E0B',
  },
  {
    key: 'retail_store',
    label: 'Retail Store',
    group: 'Commerce',
    description: 'Physical or hybrid retail store selling products',
    industryMapping: 'retail',
    logoColor: '#2563EB',
  },
  {
    key: 'wholesale',
    label: 'Wholesale / Distribution',
    group: 'Commerce',
    description: 'Bulk product distribution to retailers or businesses',
    industryMapping: 'retail',
    logoColor: '#475569',
  },
  {
    key: 'marketplace',
    label: 'Marketplace',
    group: 'Commerce',
    description: 'Platform connecting buyers and sellers',
    industryMapping: 'digital',
    logoColor: '#0284C7',
  },
  // Digital & Product
  {
    key: 'saas',
    label: 'SaaS',
    group: 'Digital & Product',
    description: 'Software-as-a-Service product with recurring revenue',
    industryMapping: 'digital',
    logoColor: '#6366F1',
  },
  {
    key: 'mobile_app',
    label: 'Mobile App',
    group: 'Digital & Product',
    description: 'Consumer or B2B mobile application',
    industryMapping: 'digital',
    logoColor: '#8B5CF6',
  },
  {
    key: 'media_content',
    label: 'Media / Content Business',
    group: 'Digital & Product',
    description: 'Content creation, publishing, or media platform',
    industryMapping: 'digital',
    logoColor: '#DC2626',
  },
  {
    key: 'ai_tool',
    label: 'AI Tool',
    group: 'Digital & Product',
    description: 'AI-powered product or automation tool',
    industryMapping: 'digital',
    logoColor: '#059669',
  },
  {
    key: 'design_studio',
    label: 'Design Studio',
    group: 'Digital & Product',
    description: 'Creative design, branding, or visual services',
    industryMapping: 'digital',
    logoColor: '#EC4899',
  },
  {
    key: 'software_agency',
    label: 'Software Agency',
    group: 'Digital & Product',
    description: 'Custom software development and engineering services',
    industryMapping: 'digital',
    logoColor: '#0F172A',
  },
  // Industrial & Operational
  {
    key: 'manufacturing',
    label: 'Manufacturing',
    group: 'Industrial & Operational',
    description: 'Physical product manufacturing and production',
    industryMapping: 'manufacturing',
    logoColor: '#78716C',
  },
  {
    key: 'logistics',
    label: 'Logistics / Delivery',
    group: 'Industrial & Operational',
    description: 'Freight, delivery, or supply chain operations',
    industryMapping: 'services',
    logoColor: '#F59E0B',
  },
  {
    key: 'construction',
    label: 'Construction',
    group: 'Industrial & Operational',
    description: 'Building, renovation, or civil engineering projects',
    industryMapping: 'workshop',
    logoColor: '#D97706',
  },
  {
    key: 'agriculture',
    label: 'Agriculture',
    group: 'Industrial & Operational',
    description: 'Farming, food production, or agribusiness',
    industryMapping: 'other',
    logoColor: '#16A34A',
  },
  {
    key: 'energy',
    label: 'Energy / Infrastructure',
    group: 'Industrial & Operational',
    description: 'Energy production, utilities, or infrastructure',
    industryMapping: 'other',
    logoColor: '#CA8A04',
  },
  // Hospitality & Events
  {
    key: 'hotel',
    label: 'Hotel / Accommodation',
    group: 'Hospitality & Events',
    description: 'Short or long-term accommodation and hospitality',
    industryMapping: 'services',
    logoColor: '#0369A1',
  },
  {
    key: 'event_business',
    label: 'Event Business',
    group: 'Hospitality & Events',
    description: 'Event planning, venues, or production',
    industryMapping: 'services',
    logoColor: '#9333EA',
  },
  {
    key: 'travel_service',
    label: 'Travel Service',
    group: 'Hospitality & Events',
    description: 'Travel agency, tours, or travel tech',
    industryMapping: 'services',
    logoColor: '#0891B2',
  },
];

export const categoryGroups: string[] = [
  'Local & Service',
  'Commerce',
  'Digital & Product',
  'Industrial & Operational',
  'Hospitality & Events',
];

export function getCategoryByKey(key: BusinessCategoryKey): BusinessCategory | undefined {
  return businessCategories.find((c) => c.key === key);
}

export function getCategoriesByGroup(group: string): BusinessCategory[] {
  return businessCategories.filter((c) => c.group === group);
}
