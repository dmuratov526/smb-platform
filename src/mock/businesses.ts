import { Business, BusinessConfiguration } from '../types';

export const mockBusinesses: Business[] = [
  {
    id: 'biz-001',
    name: 'Brewed Awakening',
    industry: 'food_service',
    description: 'Specialty coffee shop and café serving artisan roasts, pastries, and light meals in a modern urban setting.',
    status: 'active',
    location: 'Austin, TX',
    logoColor: '#C8702A',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-01T14:30:00Z',
  },
  {
    id: 'biz-002',
    name: 'Apex Threads',
    industry: 'retail',
    description: 'Contemporary menswear boutique focusing on sustainable fabrics and locally sourced clothing lines.',
    status: 'draft',
    location: 'Portland, OR',
    logoColor: '#2563EB',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-28T11:00:00Z',
  },
  {
    id: 'biz-003',
    name: 'Brightline Digital',
    industry: 'digital',
    description: 'Boutique digital marketing agency helping SMBs grow through SEO, paid ads, and content strategy.',
    status: 'active',
    location: 'Remote (US)',
    logoColor: '#7C3AED',
    createdAt: '2023-11-01T08:00:00Z',
    updatedAt: '2024-03-05T16:00:00Z',
  },
];

export const mockBusinessConfigurations: BusinessConfiguration[] = [
  {
    businessId: 'biz-001',
    initialBudget: 120000,
    targetMonthlyRevenue: 45000,
    revenueStreams: [
      { id: 'rev-001', name: 'Espresso & Coffee Drinks', type: 'product', monthlyAmount: 22000, description: 'Hot and cold espresso-based beverages' },
      { id: 'rev-002', name: 'Pastries & Food', type: 'product', monthlyAmount: 10000, description: 'Baked goods and light meal items' },
      { id: 'rev-003', name: 'Whole Bean Retail', type: 'product', monthlyAmount: 5000, description: 'Retail bag sales of house roasts' },
      { id: 'rev-004', name: 'Catering & Events', type: 'service', monthlyAmount: 4000, description: 'Off-site catering and private events' },
    ],
    costCategories: [
      { id: 'cost-001', name: 'Rent & Utilities', type: 'fixed', monthlyAmount: 8500, description: 'Storefront lease and monthly utilities' },
      { id: 'cost-002', name: 'Payroll', type: 'fixed', monthlyAmount: 14000, description: 'Staff wages and payroll taxes' },
      { id: 'cost-003', name: 'Coffee & Ingredient COGS', type: 'variable', monthlyAmount: 9500, description: 'Green beans, dairy, syrups, food ingredients' },
      { id: 'cost-004', name: 'Equipment Maintenance', type: 'fixed', monthlyAmount: 600, description: 'Espresso machine and grinder service' },
      { id: 'cost-005', name: 'Marketing', type: 'variable', monthlyAmount: 1200, description: 'Social media, local ads, promotions' },
      { id: 'cost-006', name: 'Insurance & Licenses', type: 'fixed', monthlyAmount: 450, description: 'Business insurance and health permits' },
    ],
    employees: [
      { id: 'emp-001', name: 'Jordan Lee', role: 'Head Barista / Manager', type: 'full_time', monthlyCost: 4200 },
      { id: 'emp-002', name: 'Sam Rivera', role: 'Barista', type: 'full_time', monthlyCost: 3100 },
      { id: 'emp-003', name: 'Mia Chen', role: 'Barista', type: 'part_time', monthlyCost: 2200 },
      { id: 'emp-004', name: 'Alex Park', role: 'Barista / Kitchen', type: 'part_time', monthlyCost: 2100 },
      { id: 'emp-005', name: 'Taylor Brooks', role: 'Bookkeeper', type: 'contractor', monthlyCost: 800 },
    ],
    marketingChannels: [
      { id: 'mkt-001', name: 'Instagram & Facebook', type: 'social', monthlyBudget: 500, expectedReach: 8000 },
      { id: 'mkt-002', name: 'Google My Business / Local SEO', type: 'search', monthlyBudget: 200, expectedReach: 3000 },
      { id: 'mkt-003', name: 'Email Newsletter', type: 'email', monthlyBudget: 100, expectedReach: 1500 },
      { id: 'mkt-004', name: 'Local Flyers & Community', type: 'print', monthlyBudget: 200, expectedReach: 2000 },
      { id: 'mkt-005', name: 'Loyalty Referral Program', type: 'referral', monthlyBudget: 200, expectedReach: 1000 },
    ],
  },
  {
    businessId: 'biz-002',
    initialBudget: 85000,
    targetMonthlyRevenue: 30000,
    revenueStreams: [
      { id: 'rev-010', name: 'In-Store Apparel Sales', type: 'product', monthlyAmount: 20000 },
      { id: 'rev-011', name: 'Online Store', type: 'product', monthlyAmount: 7000 },
      { id: 'rev-012', name: 'Custom Tailoring', type: 'service', monthlyAmount: 3000 },
    ],
    costCategories: [
      { id: 'cost-010', name: 'Rent', type: 'fixed', monthlyAmount: 5500 },
      { id: 'cost-011', name: 'Inventory / COGS', type: 'variable', monthlyAmount: 10000 },
      { id: 'cost-012', name: 'Payroll', type: 'fixed', monthlyAmount: 7500 },
      { id: 'cost-013', name: 'Marketing', type: 'variable', monthlyAmount: 1500 },
      { id: 'cost-014', name: 'E-commerce & POS Fees', type: 'fixed', monthlyAmount: 400 },
    ],
    employees: [
      { id: 'emp-010', name: 'Chris Nguyen', role: 'Store Manager', type: 'full_time', monthlyCost: 3800 },
      { id: 'emp-011', name: 'Dana Kim', role: 'Sales Associate', type: 'part_time', monthlyCost: 2200 },
      { id: 'emp-012', name: 'Priya Patel', role: 'Tailor', type: 'contractor', monthlyCost: 1500 },
    ],
    marketingChannels: [
      { id: 'mkt-010', name: 'Instagram', type: 'social', monthlyBudget: 700, expectedReach: 10000 },
      { id: 'mkt-011', name: 'Google Ads', type: 'search', monthlyBudget: 500, expectedReach: 4000 },
      { id: 'mkt-012', name: 'Influencer Partnerships', type: 'events', monthlyBudget: 300, expectedReach: 6000 },
    ],
  },
];
