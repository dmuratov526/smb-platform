import { BusinessCategoryKey, OnboardingField, OnboardingStepConfig } from '../../../types';

interface CategoryStepConfig {
  categoryProfile: OnboardingStepConfig;
  operatingModel: OnboardingStepConfig;
  revenueModel: OnboardingStepConfig;
  teamResources: OnboardingStepConfig;
}

// ─── Restaurant / Cafe ───────────────────────────────────────────────────────

const restaurantCafeSteps: CategoryStepConfig = {
  categoryProfile: {
    title: 'Category Profile',
    description: 'Tell us about the format and concept of your food business.',
    fields: [
      {
        id: 'format',
        label: 'Business Format',
        type: 'select',
        required: true,
        options: [
          { value: 'cafe', label: 'Café' },
          { value: 'restaurant', label: 'Full-Service Restaurant' },
          { value: 'fast_casual', label: 'Fast Casual' },
          { value: 'cloud_kitchen', label: 'Cloud / Ghost Kitchen' },
          { value: 'food_truck', label: 'Food Truck' },
          { value: 'bakery', label: 'Bakery' },
          { value: 'bar', label: 'Bar / Pub' },
        ],
      },
      {
        id: 'cuisineType',
        label: 'Cuisine / Concept Type',
        type: 'text',
        placeholder: 'e.g. Specialty coffee, Italian, Mexican street food',
        required: true,
      },
      {
        id: 'serviceModel',
        label: 'Service Model',
        type: 'multiselect',
        options: [
          { value: 'dine_in', label: 'Dine-In' },
          { value: 'takeaway', label: 'Takeaway' },
          { value: 'delivery', label: 'Delivery' },
          { value: 'catering', label: 'Catering' },
        ],
      },
      {
        id: 'seatingCapacity',
        label: 'Seating Capacity',
        type: 'select',
        options: [
          { value: 'none', label: 'No seating (takeaway/delivery only)' },
          { value: 'small', label: 'Small (1–20 seats)' },
          { value: 'medium', label: 'Medium (21–60 seats)' },
          { value: 'large', label: 'Large (60+ seats)' },
        ],
      },
    ],
  },
  operatingModel: {
    title: 'Operating Model',
    description: 'Define how your food business operates day-to-day.',
    fields: [
      {
        id: 'openingHours',
        label: 'Operating Hours',
        type: 'select',
        options: [
          { value: 'morning', label: 'Morning only (6am–2pm)' },
          { value: 'daytime', label: 'Daytime (8am–6pm)' },
          { value: 'evening', label: 'Evening focused (4pm–11pm)' },
          { value: 'all_day', label: 'All day (8am–11pm)' },
          { value: '24_7', label: '24 hours' },
        ],
      },
      {
        id: 'kitchenType',
        label: 'Kitchen Setup',
        type: 'select',
        options: [
          { value: 'full_kitchen', label: 'Full commercial kitchen' },
          { value: 'prep_kitchen', label: 'Prep kitchen only' },
          { value: 'shared_kitchen', label: 'Shared / rented kitchen' },
          { value: 'no_kitchen', label: 'No kitchen (beverages only)' },
        ],
      },
      {
        id: 'supplyChain',
        label: 'Key Ingredients / Supply',
        type: 'select',
        options: [
          { value: 'local', label: 'Mostly local suppliers' },
          { value: 'wholesale', label: 'Wholesale / distributor' },
          { value: 'mixed', label: 'Mixed sourcing' },
          { value: 'imported', label: 'Specialty / imported ingredients' },
        ],
      },
    ],
  },
  revenueModel: {
    title: 'Revenue Model',
    description: 'Define your pricing and revenue expectations.',
    fields: [
      {
        id: 'averageOrderValue',
        label: 'Average Order / Transaction Value',
        type: 'select',
        options: [
          { value: 'under_10', label: 'Under $10' },
          { value: '10_25', label: '$10 – $25' },
          { value: '25_50', label: '$25 – $50' },
          { value: '50_100', label: '$50 – $100' },
          { value: 'over_100', label: 'Over $100' },
        ],
      },
      {
        id: 'peakPeriod',
        label: 'Peak Revenue Period',
        type: 'select',
        options: [
          { value: 'morning', label: 'Morning rush' },
          { value: 'lunch', label: 'Lunch' },
          { value: 'evening', label: 'Evening / dinner' },
          { value: 'weekends', label: 'Weekends' },
          { value: 'seasonal', label: 'Seasonal' },
        ],
      },
      {
        id: 'additionalRevenue',
        label: 'Additional Revenue Streams',
        type: 'multiselect',
        options: [
          { value: 'retail_sales', label: 'Retail product sales' },
          { value: 'catering_events', label: 'Catering & events' },
          { value: 'subscriptions', label: 'Subscription boxes / memberships' },
          { value: 'cooking_classes', label: 'Classes or workshops' },
        ],
      },
    ],
  },
  teamResources: {
    title: 'Team & Resources',
    description: 'Outline your staffing and key operational needs.',
    fields: [
      {
        id: 'staffCount',
        label: 'Expected Staff Count',
        type: 'select',
        options: [
          { value: '1_2', label: '1–2 people (solo / micro)' },
          { value: '3_5', label: '3–5 people' },
          { value: '6_10', label: '6–10 people' },
          { value: '11_20', label: '11–20 people' },
          { value: '20_plus', label: '20+ people' },
        ],
      },
      {
        id: 'keyRoles',
        label: 'Key Roles Needed',
        type: 'multiselect',
        options: [
          { value: 'chef_cook', label: 'Chef / Cook' },
          { value: 'barista', label: 'Barista' },
          { value: 'manager', label: 'Manager / Supervisor' },
          { value: 'front_of_house', label: 'Front of House / Server' },
          { value: 'delivery', label: 'Delivery Driver' },
          { value: 'bookkeeper', label: 'Bookkeeper / Admin' },
        ],
      },
      {
        id: 'operationalPriority',
        label: 'Biggest Operational Priority',
        type: 'select',
        options: [
          { value: 'quality', label: 'Product quality' },
          { value: 'speed', label: 'Service speed' },
          { value: 'cost', label: 'Cost control' },
          { value: 'consistency', label: 'Consistency at scale' },
          { value: 'experience', label: 'Customer experience' },
        ],
      },
    ],
  },
};

// ─── SaaS ─────────────────────────────────────────────────────────────────────

const saasSteps: CategoryStepConfig = {
  categoryProfile: {
    title: 'Category Profile',
    description: 'Define what your SaaS product does and who it serves.',
    fields: [
      {
        id: 'targetCustomer',
        label: 'Primary Target Customer',
        type: 'select',
        required: true,
        options: [
          { value: 'smb', label: 'Small & medium businesses (SMB)' },
          { value: 'enterprise', label: 'Enterprise' },
          { value: 'consumer', label: 'Consumers (B2C)' },
          { value: 'developers', label: 'Developers / Technical users' },
          { value: 'freelancers', label: 'Freelancers / Solopreneurs' },
          { value: 'specific_vertical', label: 'Specific vertical / niche' },
        ],
      },
      {
        id: 'productMaturity',
        label: 'Product Maturity',
        type: 'select',
        required: true,
        options: [
          { value: 'concept', label: 'Concept / idea stage' },
          { value: 'mvp', label: 'MVP in development' },
          { value: 'beta', label: 'Beta / early users' },
          { value: 'launched', label: 'Launched and growing' },
          { value: 'scaling', label: 'Scaling' },
        ],
      },
      {
        id: 'platformType',
        label: 'Platform Type',
        type: 'select',
        options: [
          { value: 'web_app', label: 'Web application' },
          { value: 'api_platform', label: 'API / developer platform' },
          { value: 'mobile_web', label: 'Mobile + web' },
          { value: 'desktop', label: 'Desktop application' },
          { value: 'embedded', label: 'Embedded / white-label' },
        ],
      },
    ],
  },
  operatingModel: {
    title: 'Operating Model',
    description: 'Describe how your product is built and delivered.',
    fields: [
      {
        id: 'developmentApproach',
        label: 'Development Approach',
        type: 'select',
        options: [
          { value: 'in_house', label: 'In-house engineering team' },
          { value: 'outsourced', label: 'Outsourced / agency' },
          { value: 'solo_founder', label: 'Solo technical founder' },
          { value: 'no_code', label: 'No-code / low-code' },
        ],
      },
      {
        id: 'deploymentModel',
        label: 'Deployment / Hosting Model',
        type: 'select',
        options: [
          { value: 'cloud_saas', label: 'Cloud SaaS (multi-tenant)' },
          { value: 'self_hosted', label: 'Self-hosted option' },
          { value: 'on_premise', label: 'On-premise enterprise' },
        ],
      },
      {
        id: 'acquisitionChannel',
        label: 'Primary Acquisition Channel',
        type: 'select',
        options: [
          { value: 'seo_content', label: 'SEO / content marketing' },
          { value: 'product_led', label: 'Product-led growth (PLG)' },
          { value: 'sales_led', label: 'Sales-led / outbound' },
          { value: 'partnerships', label: 'Partnerships / integrations' },
          { value: 'paid_ads', label: 'Paid advertising' },
          { value: 'community', label: 'Community / word of mouth' },
        ],
      },
    ],
  },
  revenueModel: {
    title: 'Revenue Model',
    description: 'Define your pricing and subscription structure.',
    fields: [
      {
        id: 'pricingModel',
        label: 'Pricing Model',
        type: 'select',
        required: true,
        options: [
          { value: 'per_seat', label: 'Per seat / user' },
          { value: 'flat_subscription', label: 'Flat subscription tiers' },
          { value: 'usage_based', label: 'Usage-based / metered' },
          { value: 'freemium', label: 'Freemium + paid upgrade' },
          { value: 'one_time', label: 'One-time purchase' },
          { value: 'custom_enterprise', label: 'Custom / enterprise contracts' },
        ],
      },
      {
        id: 'subscriptionTiers',
        label: 'Subscription Tiers',
        type: 'multiselect',
        options: [
          { value: 'free', label: 'Free tier' },
          { value: 'starter', label: 'Starter' },
          { value: 'pro', label: 'Pro / Growth' },
          { value: 'business', label: 'Business' },
          { value: 'enterprise', label: 'Enterprise' },
        ],
      },
      {
        id: 'targetMRR',
        label: 'Target Monthly Recurring Revenue (MRR)',
        type: 'select',
        options: [
          { value: 'under_5k', label: 'Under $5k' },
          { value: '5k_20k', label: '$5k – $20k' },
          { value: '20k_100k', label: '$20k – $100k' },
          { value: 'over_100k', label: '$100k+' },
        ],
      },
    ],
  },
  teamResources: {
    title: 'Team & Resources',
    description: 'Define your team structure and hiring needs.',
    fields: [
      {
        id: 'teamComposition',
        label: 'Current Team Composition',
        type: 'multiselect',
        options: [
          { value: 'technical_founder', label: 'Technical founder(s)' },
          { value: 'product_designer', label: 'Product / designer' },
          { value: 'sales_marketing', label: 'Sales / marketing' },
          { value: 'customer_success', label: 'Customer success' },
          { value: 'advisors', label: 'Advisors / investors' },
        ],
      },
      {
        id: 'hiringPriority',
        label: 'Next Hiring Priority',
        type: 'select',
        options: [
          { value: 'engineering', label: 'Engineering' },
          { value: 'sales', label: 'Sales' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'product', label: 'Product / design' },
          { value: 'customer_success', label: 'Customer success' },
          { value: 'not_hiring', label: 'Not hiring yet' },
        ],
      },
      {
        id: 'fundingStage',
        label: 'Funding Stage',
        type: 'select',
        options: [
          { value: 'bootstrapped', label: 'Bootstrapped' },
          { value: 'pre_seed', label: 'Pre-seed / friends & family' },
          { value: 'seed', label: 'Seed round' },
          { value: 'series_a', label: 'Series A+' },
          { value: 'revenue_funded', label: 'Revenue-funded' },
        ],
      },
    ],
  },
};

// ─── Retail Store ─────────────────────────────────────────────────────────────

const retailStoreSteps: CategoryStepConfig = {
  categoryProfile: {
    title: 'Category Profile',
    description: 'Tell us about your retail store type and products.',
    fields: [
      {
        id: 'storeType',
        label: 'Store Type',
        type: 'select',
        required: true,
        options: [
          { value: 'boutique', label: 'Boutique / specialty store' },
          { value: 'general', label: 'General retail' },
          { value: 'convenience', label: 'Convenience store' },
          { value: 'outlet', label: 'Outlet / discount store' },
          { value: 'pop_up', label: 'Pop-up / market stall' },
        ],
      },
      {
        id: 'productCategories',
        label: 'Product Categories',
        type: 'multiselect',
        options: [
          { value: 'apparel', label: 'Apparel & fashion' },
          { value: 'home_decor', label: 'Home & decor' },
          { value: 'electronics', label: 'Electronics & tech' },
          { value: 'food_grocery', label: 'Food & grocery' },
          { value: 'beauty_health', label: 'Beauty & health' },
          { value: 'sports_outdoor', label: 'Sports & outdoor' },
          { value: 'books_gifts', label: 'Books & gifts' },
          { value: 'kids_toys', label: 'Kids & toys' },
        ],
      },
      {
        id: 'channelType',
        label: 'Sales Channels',
        type: 'multiselect',
        options: [
          { value: 'physical', label: 'Physical store only' },
          { value: 'online', label: 'Online store' },
          { value: 'hybrid', label: 'Physical + online (hybrid)' },
          { value: 'marketplace', label: 'Third-party marketplaces' },
        ],
      },
    ],
  },
  operatingModel: {
    title: 'Operating Model',
    description: 'Define how your store operates and manages inventory.',
    fields: [
      {
        id: 'supplierSetup',
        label: 'Supplier / Sourcing Model',
        type: 'select',
        options: [
          { value: 'own_brand', label: 'Own brand / private label' },
          { value: 'wholesale', label: 'Wholesale from suppliers' },
          { value: 'dropshipping', label: 'Dropshipping' },
          { value: 'consignment', label: 'Consignment / mixed' },
          { value: 'artisan', label: 'Artisan / handmade producers' },
        ],
      },
      {
        id: 'inventoryModel',
        label: 'Inventory Management',
        type: 'select',
        options: [
          { value: 'in_house', label: 'In-house storage' },
          { value: 'third_party', label: 'Third-party warehouse / 3PL' },
          { value: 'just_in_time', label: 'Just-in-time ordering' },
          { value: 'dropshipping', label: 'No inventory (dropshipping)' },
        ],
      },
      {
        id: 'storeSize',
        label: 'Store / Warehouse Size',
        type: 'select',
        options: [
          { value: 'micro', label: 'Micro (under 500 sq ft)' },
          { value: 'small', label: 'Small (500–2,000 sq ft)' },
          { value: 'medium', label: 'Medium (2,000–10,000 sq ft)' },
          { value: 'large', label: 'Large (10,000+ sq ft)' },
        ],
      },
    ],
  },
  revenueModel: {
    title: 'Revenue Model',
    description: 'Define your pricing and sales targets.',
    fields: [
      {
        id: 'averageBasketSize',
        label: 'Average Transaction / Basket Size',
        type: 'select',
        options: [
          { value: 'under_25', label: 'Under $25' },
          { value: '25_75', label: '$25 – $75' },
          { value: '75_200', label: '$75 – $200' },
          { value: 'over_200', label: 'Over $200' },
        ],
      },
      {
        id: 'marginRange',
        label: 'Target Gross Margin',
        type: 'select',
        options: [
          { value: 'low', label: 'Low (10–30%)' },
          { value: 'medium', label: 'Medium (30–50%)' },
          { value: 'high', label: 'High (50–70%)' },
          { value: 'premium', label: 'Premium (70%+)' },
        ],
      },
      {
        id: 'loyaltyProgram',
        label: 'Customer Loyalty Strategy',
        type: 'select',
        options: [
          { value: 'none', label: 'No loyalty program' },
          { value: 'points', label: 'Points / rewards card' },
          { value: 'subscription', label: 'Subscription membership' },
          { value: 'vip_tiers', label: 'VIP tiers' },
        ],
      },
    ],
  },
  teamResources: {
    title: 'Team & Resources',
    description: 'Define your staffing and store technology needs.',
    fields: [
      {
        id: 'staffCount',
        label: 'Staff Count',
        type: 'select',
        options: [
          { value: 'solo', label: 'Solo owner-operator' },
          { value: '2_5', label: '2–5 employees' },
          { value: '6_15', label: '6–15 employees' },
          { value: '15_plus', label: '15+ employees' },
        ],
      },
      {
        id: 'posSystem',
        label: 'POS / Tech System',
        type: 'select',
        options: [
          { value: 'none', label: 'None yet' },
          { value: 'simple', label: 'Simple POS (Square, SumUp)' },
          { value: 'full_retail', label: 'Full retail POS (Lightspeed, Shopify)' },
          { value: 'custom', label: 'Custom / enterprise system' },
        ],
      },
      {
        id: 'keyRoles',
        label: 'Key Roles Needed',
        type: 'multiselect',
        options: [
          { value: 'sales_associate', label: 'Sales associate' },
          { value: 'store_manager', label: 'Store manager' },
          { value: 'buyer', label: 'Buyer / merchandiser' },
          { value: 'visual_merchandiser', label: 'Visual merchandiser' },
          { value: 'ecom_manager', label: 'E-commerce manager' },
          { value: 'logistics', label: 'Logistics / warehouse' },
        ],
      },
    ],
  },
};

// ─── Consulting / Agency ──────────────────────────────────────────────────────

const consultingAgencySteps: CategoryStepConfig = {
  categoryProfile: {
    title: 'Category Profile',
    description: 'Define your services and ideal client profile.',
    fields: [
      {
        id: 'serviceLines',
        label: 'Primary Service Lines',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'strategy', label: 'Strategy & consulting' },
          { value: 'marketing', label: 'Marketing & growth' },
          { value: 'digital_marketing', label: 'Digital marketing / SEO / ads' },
          { value: 'design_creative', label: 'Design & creative' },
          { value: 'tech_development', label: 'Technology & development' },
          { value: 'finance_advisory', label: 'Finance & advisory' },
          { value: 'hr_talent', label: 'HR & talent' },
          { value: 'operations', label: 'Operations & process' },
        ],
      },
      {
        id: 'idealClientType',
        label: 'Ideal Client Type',
        type: 'select',
        options: [
          { value: 'smb', label: 'SMBs (small & medium businesses)' },
          { value: 'enterprise', label: 'Enterprise / corporate' },
          { value: 'startups', label: 'Startups & scale-ups' },
          { value: 'nonprofits', label: 'Non-profits & government' },
          { value: 'consumers', label: 'Individual consumers' },
        ],
      },
      {
        id: 'specialization',
        label: 'Industry Specialization',
        type: 'select',
        options: [
          { value: 'generalist', label: 'Generalist (multiple industries)' },
          { value: 'tech', label: 'Technology' },
          { value: 'healthcare', label: 'Healthcare' },
          { value: 'retail', label: 'Retail & consumer' },
          { value: 'finance', label: 'Finance & fintech' },
          { value: 'real_estate', label: 'Real estate' },
          { value: 'hospitality', label: 'Hospitality & travel' },
        ],
      },
    ],
  },
  operatingModel: {
    title: 'Operating Model',
    description: 'Describe how you deliver services to clients.',
    fields: [
      {
        id: 'deliveryModel',
        label: 'Service Delivery Model',
        type: 'select',
        options: [
          { value: 'remote', label: 'Fully remote' },
          { value: 'on_site', label: 'On-site / in-person' },
          { value: 'hybrid', label: 'Hybrid' },
        ],
      },
      {
        id: 'projectType',
        label: 'Engagement Type',
        type: 'multiselect',
        options: [
          { value: 'retainer', label: 'Monthly retainer' },
          { value: 'project_based', label: 'Project-based' },
          { value: 'advisory', label: 'Advisory / fractional' },
          { value: 'training', label: 'Training & workshops' },
          { value: 'productized', label: 'Productized services' },
        ],
      },
      {
        id: 'leadSources',
        label: 'Primary Lead Sources',
        type: 'multiselect',
        options: [
          { value: 'referrals', label: 'Referrals' },
          { value: 'linkedin', label: 'LinkedIn / outbound' },
          { value: 'content', label: 'Content marketing / SEO' },
          { value: 'events', label: 'Events & networking' },
          { value: 'partnerships', label: 'Partnerships' },
          { value: 'paid_ads', label: 'Paid advertising' },
        ],
      },
    ],
  },
  revenueModel: {
    title: 'Revenue Model',
    description: 'Define your pricing and billing approach.',
    fields: [
      {
        id: 'pricingModel',
        label: 'Pricing Model',
        type: 'select',
        required: true,
        options: [
          { value: 'hourly', label: 'Hourly rate' },
          { value: 'daily_rate', label: 'Day rate' },
          { value: 'monthly_retainer', label: 'Monthly retainer' },
          { value: 'project_fixed', label: 'Fixed project price' },
          { value: 'value_based', label: 'Value-based pricing' },
          { value: 'subscription', label: 'Subscription (productized)' },
        ],
      },
      {
        id: 'averageProjectSize',
        label: 'Average Project / Client Value',
        type: 'select',
        options: [
          { value: 'under_5k', label: 'Under $5,000' },
          { value: '5k_20k', label: '$5,000 – $20,000' },
          { value: '20k_100k', label: '$20,000 – $100,000' },
          { value: 'over_100k', label: 'Over $100,000' },
        ],
      },
      {
        id: 'billingCycle',
        label: 'Billing Cycle',
        type: 'select',
        options: [
          { value: 'monthly', label: 'Monthly' },
          { value: 'milestone', label: 'Milestone-based' },
          { value: 'upfront', label: 'Upfront payment' },
          { value: 'on_completion', label: 'On completion' },
        ],
      },
    ],
  },
  teamResources: {
    title: 'Team & Resources',
    description: 'Define your team and growth plans.',
    fields: [
      {
        id: 'teamSize',
        label: 'Current Team Size',
        type: 'select',
        options: [
          { value: 'solo', label: 'Solo consultant' },
          { value: '2_5', label: '2–5 people' },
          { value: '6_15', label: '6–15 people' },
          { value: '15_plus', label: '15+ people' },
        ],
      },
      {
        id: 'subcontractors',
        label: 'Use of Subcontractors / Freelancers',
        type: 'select',
        options: [
          { value: 'none', label: 'None' },
          { value: 'occasional', label: 'Occasionally for overflow' },
          { value: 'regular', label: 'Regularly for delivery' },
          { value: 'core_model', label: 'Core of our delivery model' },
        ],
      },
      {
        id: 'hiringPlan',
        label: 'Hiring Plan (12 months)',
        type: 'select',
        options: [
          { value: 'no_hire', label: 'Staying lean, no hires' },
          { value: 'one_two', label: '1–2 new hires' },
          { value: 'team_build', label: 'Building a small team (3–8)' },
          { value: 'scale_team', label: 'Scaling team aggressively' },
        ],
      },
    ],
  },
};

// ─── Fitness Studio / Gym ──────────────────────────────────────────────────────

const fitnessStudioSteps: CategoryStepConfig = {
  categoryProfile: {
    title: 'Category Profile',
    description: 'Tell us about your fitness offering and target members.',
    fields: [
      {
        id: 'classTypes',
        label: 'Classes / Services Offered',
        type: 'multiselect',
        options: [
          { value: 'yoga', label: 'Yoga' },
          { value: 'pilates', label: 'Pilates' },
          { value: 'crossfit', label: 'CrossFit / functional fitness' },
          { value: 'martial_arts', label: 'Martial arts / boxing' },
          { value: 'dance', label: 'Dance' },
          { value: 'cycling', label: 'Cycling / spin' },
          { value: 'strength', label: 'Strength & conditioning' },
          { value: 'personal_training', label: 'Personal training' },
          { value: 'open_gym', label: 'Open gym access' },
        ],
      },
      {
        id: 'targetDemographic',
        label: 'Target Member Demographic',
        type: 'select',
        options: [
          { value: 'general', label: 'General / mixed age' },
          { value: 'young_adults', label: 'Young adults (18–35)' },
          { value: 'families', label: 'Families & parents' },
          { value: 'seniors', label: 'Seniors & wellness-focused' },
          { value: 'athletes', label: 'Athletes & competitors' },
          { value: 'corporate', label: 'Corporate wellness' },
        ],
      },
      {
        id: 'locationType',
        label: 'Facility Type',
        type: 'select',
        options: [
          { value: 'dedicated_studio', label: 'Dedicated studio / gym' },
          { value: 'shared_space', label: 'Shared / rented space' },
          { value: 'online', label: 'Online / virtual only' },
          { value: 'hybrid', label: 'Physical + online' },
          { value: 'outdoor', label: 'Outdoor / mobile' },
        ],
      },
    ],
  },
  operatingModel: {
    title: 'Operating Model',
    description: 'Define how your studio is structured operationally.',
    fields: [
      {
        id: 'membershipModel',
        label: 'Membership / Access Model',
        type: 'select',
        options: [
          { value: 'monthly_unlimited', label: 'Monthly unlimited membership' },
          { value: 'class_packs', label: 'Class packs / punch cards' },
          { value: 'drop_in', label: 'Drop-in only' },
          { value: 'tiered', label: 'Tiered memberships' },
          { value: 'hybrid', label: 'Mixed model' },
        ],
      },
      {
        id: 'scheduleComplexity',
        label: 'Schedule Complexity',
        type: 'select',
        options: [
          { value: 'simple', label: 'Simple (1–5 classes/day)' },
          { value: 'moderate', label: 'Moderate (6–15 classes/day)' },
          { value: 'complex', label: 'Complex (15+ classes, multiple rooms)' },
        ],
      },
      {
        id: 'facilitySize',
        label: 'Facility Size',
        type: 'select',
        options: [
          { value: 'micro', label: 'Micro studio (under 1,000 sq ft)' },
          { value: 'small', label: 'Small studio (1,000–3,000 sq ft)' },
          { value: 'medium', label: 'Medium gym (3,000–8,000 sq ft)' },
          { value: 'large', label: 'Large facility (8,000+ sq ft)' },
        ],
      },
    ],
  },
  revenueModel: {
    title: 'Revenue Model',
    description: 'Outline your pricing strategy and revenue diversification.',
    fields: [
      {
        id: 'pricingStructure',
        label: 'Core Pricing',
        type: 'select',
        options: [
          { value: 'budget', label: 'Budget ($10–$30/month)' },
          { value: 'mid_tier', label: 'Mid-tier ($30–$80/month)' },
          { value: 'premium', label: 'Premium ($80–$200/month)' },
          { value: 'luxury', label: 'Luxury ($200+/month)' },
        ],
      },
      {
        id: 'additionalRevenue',
        label: 'Additional Revenue Streams',
        type: 'multiselect',
        options: [
          { value: 'personal_training', label: 'Personal training (upsell)' },
          { value: 'retail', label: 'Apparel / equipment retail' },
          { value: 'nutrition', label: 'Nutrition / supplements' },
          { value: 'workshops', label: 'Workshops & events' },
          { value: 'online_content', label: 'Online classes / content' },
          { value: 'corporate_wellness', label: 'Corporate wellness contracts' },
        ],
      },
      {
        id: 'retentionStrategy',
        label: 'Member Retention Strategy',
        type: 'select',
        options: [
          { value: 'community', label: 'Community & social' },
          { value: 'results', label: 'Results & transformation focus' },
          { value: 'variety', label: 'Class variety & novelty' },
          { value: 'loyalty', label: 'Loyalty rewards & perks' },
          { value: 'convenience', label: 'Convenience & flexibility' },
        ],
      },
    ],
  },
  teamResources: {
    title: 'Team & Resources',
    description: 'Define your instructors, staff, and equipment needs.',
    fields: [
      {
        id: 'trainerCount',
        label: 'Trainer / Instructor Count',
        type: 'select',
        options: [
          { value: '1', label: '1 (solo owner-instructor)' },
          { value: '2_4', label: '2–4 instructors' },
          { value: '5_10', label: '5–10 instructors' },
          { value: '10_plus', label: '10+ instructors' },
        ],
      },
      {
        id: 'staffRoles',
        label: 'Staff Roles Needed',
        type: 'multiselect',
        options: [
          { value: 'front_desk', label: 'Front desk / reception' },
          { value: 'manager', label: 'Studio manager' },
          { value: 'personal_trainers', label: 'Personal trainers' },
          { value: 'class_instructors', label: 'Class instructors' },
          { value: 'marketing', label: 'Marketing / social media' },
          { value: 'cleaning', label: 'Cleaning / facilities' },
        ],
      },
      {
        id: 'equipmentNeeds',
        label: 'Equipment Investment Level',
        type: 'select',
        options: [
          { value: 'minimal', label: 'Minimal (mats, bands, bodyweight)' },
          { value: 'moderate', label: 'Moderate (some cardio, free weights)' },
          { value: 'full', label: 'Full gym setup' },
          { value: 'specialized', label: 'Specialized equipment (cycling, etc.)' },
        ],
      },
    ],
  },
};

// ─── Manufacturing ────────────────────────────────────────────────────────────

const manufacturingSteps: CategoryStepConfig = {
  categoryProfile: {
    title: 'Category Profile',
    description: 'Describe what you manufacture and for which markets.',
    fields: [
      {
        id: 'productType',
        label: 'Product Type',
        type: 'text',
        placeholder: 'e.g. Furniture, electronics components, packaged food',
        required: true,
      },
      {
        id: 'productionModel',
        label: 'Production Model',
        type: 'select',
        required: true,
        options: [
          { value: 'make_to_order', label: 'Make-to-order (custom)' },
          { value: 'make_to_stock', label: 'Make-to-stock (batch)' },
          { value: 'continuous', label: 'Continuous / high-volume' },
          { value: 'job_shop', label: 'Job shop (varied batches)' },
          { value: 'assembly', label: 'Assembly / integration' },
        ],
      },
      {
        id: 'targetMarket',
        label: 'Target Market',
        type: 'select',
        options: [
          { value: 'b2b', label: 'B2B (sell to businesses)' },
          { value: 'b2c', label: 'B2C (sell to consumers)' },
          { value: 'both', label: 'Both B2B and B2C' },
          { value: 'oem', label: 'OEM / contract manufacturing' },
          { value: 'government', label: 'Government / institutional' },
        ],
      },
    ],
  },
  operatingModel: {
    title: 'Operating Model',
    description: 'Describe your facility and supply chain.',
    fields: [
      {
        id: 'facilityType',
        label: 'Facility Type',
        type: 'select',
        options: [
          { value: 'home_workshop', label: 'Home / garage workshop' },
          { value: 'small_unit', label: 'Small industrial unit' },
          { value: 'factory', label: 'Dedicated factory' },
          { value: 'shared', label: 'Shared manufacturing space' },
          { value: 'contract', label: 'Contract manufacturer (outsourced)' },
        ],
      },
      {
        id: 'supplyChainComplexity',
        label: 'Supply Chain Complexity',
        type: 'select',
        options: [
          { value: 'simple', label: 'Simple (1–3 suppliers)' },
          { value: 'moderate', label: 'Moderate (4–10 suppliers)' },
          { value: 'complex', label: 'Complex (10+ suppliers, global)' },
        ],
      },
      {
        id: 'productionCapacity',
        label: 'Production Capacity (monthly units)',
        type: 'select',
        options: [
          { value: 'micro', label: 'Micro (under 100 units)' },
          { value: 'small', label: 'Small (100–1,000 units)' },
          { value: 'medium', label: 'Medium (1,000–10,000 units)' },
          { value: 'large', label: 'Large (10,000+ units)' },
        ],
      },
    ],
  },
  revenueModel: {
    title: 'Revenue Model',
    description: 'Define your sales channels and pricing approach.',
    fields: [
      {
        id: 'salesChannels',
        label: 'Sales Channels',
        type: 'multiselect',
        options: [
          { value: 'direct_sales', label: 'Direct sales team' },
          { value: 'distributors', label: 'Distributors / wholesalers' },
          { value: 'own_website', label: 'Own website / e-commerce' },
          { value: 'retail', label: 'Retail stores' },
          { value: 'marketplaces', label: 'Online marketplaces' },
          { value: 'contract', label: 'Long-term contracts / tenders' },
        ],
      },
      {
        id: 'minimumOrderQty',
        label: 'Minimum Order Quantity (MOQ)',
        type: 'select',
        options: [
          { value: 'no_moq', label: 'No minimum (custom one-offs)' },
          { value: 'small', label: 'Small batches (1–50 units)' },
          { value: 'medium', label: 'Medium batches (50–500 units)' },
          { value: 'large', label: 'Large batches (500+ units)' },
        ],
      },
      {
        id: 'marginRange',
        label: 'Target Gross Margin',
        type: 'select',
        options: [
          { value: 'low', label: 'Low (5–20%)' },
          { value: 'medium', label: 'Medium (20–40%)' },
          { value: 'high', label: 'High (40–60%)' },
          { value: 'premium', label: 'Premium (60%+)' },
        ],
      },
    ],
  },
  teamResources: {
    title: 'Team & Resources',
    description: 'Describe your workforce and equipment needs.',
    fields: [
      {
        id: 'workforceSize',
        label: 'Workforce Size',
        type: 'select',
        options: [
          { value: 'solo', label: 'Solo / micro (1–2 people)' },
          { value: 'small', label: 'Small (3–15 workers)' },
          { value: 'medium', label: 'Medium (15–100 workers)' },
          { value: 'large', label: 'Large (100+ workers)' },
        ],
      },
      {
        id: 'keyRoles',
        label: 'Key Operational Roles',
        type: 'multiselect',
        options: [
          { value: 'production_manager', label: 'Production manager' },
          { value: 'quality_control', label: 'Quality control / QA' },
          { value: 'procurement', label: 'Procurement / supply chain' },
          { value: 'machine_operators', label: 'Machine operators / skilled labor' },
          { value: 'logistics', label: 'Logistics & dispatch' },
          { value: 'r_and_d', label: 'R&D / product development' },
        ],
      },
      {
        id: 'equipmentIntensity',
        label: 'Equipment & Capital Intensity',
        type: 'select',
        options: [
          { value: 'low', label: 'Low (hand tools, minimal machinery)' },
          { value: 'medium', label: 'Medium (standard industrial equipment)' },
          { value: 'high', label: 'High (specialized heavy machinery)' },
          { value: 'very_high', label: 'Very high (automated production lines)' },
        ],
      },
    ],
  },
};

// ─── Generic fallback ──────────────────────────────────────────────────────────

const genericSteps: CategoryStepConfig = {
  categoryProfile: {
    title: 'Category Profile',
    description: 'Tell us more about your business concept.',
    fields: [
      {
        id: 'businessModel',
        label: 'Business Model',
        type: 'select',
        required: true,
        options: [
          { value: 'product', label: 'Product-based' },
          { value: 'service', label: 'Service-based' },
          { value: 'marketplace', label: 'Marketplace / platform' },
          { value: 'subscription', label: 'Subscription' },
          { value: 'hybrid', label: 'Hybrid' },
        ],
      },
      {
        id: 'targetMarket',
        label: 'Target Market',
        type: 'select',
        options: [
          { value: 'consumers', label: 'Consumers (B2C)' },
          { value: 'businesses', label: 'Businesses (B2B)' },
          { value: 'both', label: 'Both consumers and businesses' },
          { value: 'government', label: 'Government / institutions' },
        ],
      },
      {
        id: 'primaryOffering',
        label: 'Primary Offering Description',
        type: 'textarea',
        placeholder: 'Briefly describe your main product or service...',
      },
    ],
  },
  operatingModel: {
    title: 'Operating Model',
    description: 'Describe how your business operates.',
    fields: [
      {
        id: 'deliveryModel',
        label: 'How do you deliver value to customers?',
        type: 'select',
        options: [
          { value: 'physical', label: 'Physical / in-person' },
          { value: 'digital', label: 'Digital / online' },
          { value: 'hybrid', label: 'Hybrid' },
          { value: 'automated', label: 'Automated / self-service' },
        ],
      },
      {
        id: 'keyProcesses',
        label: 'Key Operational Processes',
        type: 'multiselect',
        options: [
          { value: 'production', label: 'Production / creation' },
          { value: 'sales', label: 'Sales & marketing' },
          { value: 'customer_service', label: 'Customer service' },
          { value: 'logistics', label: 'Logistics & delivery' },
          { value: 'finance', label: 'Finance & admin' },
          { value: 'tech', label: 'Technology & systems' },
        ],
      },
      {
        id: 'location',
        label: 'Primary Operating Location',
        type: 'select',
        options: [
          { value: 'local', label: 'Local / city-based' },
          { value: 'regional', label: 'Regional' },
          { value: 'national', label: 'National' },
          { value: 'international', label: 'International' },
          { value: 'remote', label: 'Fully remote / online' },
        ],
      },
    ],
  },
  revenueModel: {
    title: 'Revenue Model',
    description: 'How does your business generate revenue?',
    fields: [
      {
        id: 'pricingApproach',
        label: 'Pricing Approach',
        type: 'select',
        required: true,
        options: [
          { value: 'one_time', label: 'One-time transactions' },
          { value: 'subscription', label: 'Recurring / subscription' },
          { value: 'project_based', label: 'Project-based' },
          { value: 'usage_based', label: 'Usage-based' },
          { value: 'freemium', label: 'Freemium + upsell' },
          { value: 'mixed', label: 'Mixed model' },
        ],
      },
      {
        id: 'revenueChannels',
        label: 'Revenue Channels',
        type: 'multiselect',
        options: [
          { value: 'direct', label: 'Direct sales' },
          { value: 'online', label: 'Online / e-commerce' },
          { value: 'partners', label: 'Partners / resellers' },
          { value: 'marketplace', label: 'Marketplace' },
          { value: 'advertising', label: 'Advertising' },
          { value: 'licensing', label: 'Licensing' },
        ],
      },
      {
        id: 'expectedMonthlyRevenue',
        label: 'Expected Monthly Revenue (at maturity)',
        type: 'select',
        options: [
          { value: 'under_5k', label: 'Under $5,000' },
          { value: '5k_20k', label: '$5,000 – $20,000' },
          { value: '20k_100k', label: '$20,000 – $100,000' },
          { value: 'over_100k', label: 'Over $100,000' },
        ],
      },
    ],
  },
  teamResources: {
    title: 'Team & Resources',
    description: 'Tell us about your team and resource needs.',
    fields: [
      {
        id: 'teamSize',
        label: 'Current / Initial Team Size',
        type: 'select',
        options: [
          { value: 'solo', label: 'Solo founder' },
          { value: '2_5', label: '2–5 people' },
          { value: '6_15', label: '6–15 people' },
          { value: '15_plus', label: '15+ people' },
        ],
      },
      {
        id: 'keyRoles',
        label: 'Key Roles Needed',
        type: 'multiselect',
        options: [
          { value: 'operations', label: 'Operations' },
          { value: 'sales', label: 'Sales & business development' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'technology', label: 'Technology' },
          { value: 'finance', label: 'Finance & admin' },
          { value: 'customer_success', label: 'Customer success' },
        ],
      },
      {
        id: 'resourceNeeds',
        label: 'Primary Resource Requirements',
        type: 'multiselect',
        options: [
          { value: 'physical_space', label: 'Physical space / office' },
          { value: 'equipment', label: 'Equipment / machinery' },
          { value: 'software', label: 'Software & tools' },
          { value: 'capital', label: 'Capital / funding' },
          { value: 'talent', label: 'Specialized talent' },
          { value: 'licenses', label: 'Licenses & permits' },
        ],
      },
    ],
  },
};

// ─── Config map ───────────────────────────────────────────────────────────────

const categoryStepConfigs: Partial<Record<BusinessCategoryKey, CategoryStepConfig>> = {
  restaurant_cafe: restaurantCafeSteps,
  saas: saasSteps,
  retail_store: retailStoreSteps,
  consulting_agency: consultingAgencySteps,
  fitness_studio: fitnessStudioSteps,
  manufacturing: manufacturingSteps,
};

export function getStepsForCategory(category: BusinessCategoryKey): CategoryStepConfig {
  return categoryStepConfigs[category] ?? genericSteps;
}

export const ONBOARDING_STEP_LABELS = [
  'Business Basics',
  'Category Profile',
  'Operating Model',
  'Revenue Model',
  'Team & Resources',
  'Review & Complete',
];

export type { CategoryStepConfig };
export { genericSteps };

export function getCategoryStepConfig(
  category: BusinessCategoryKey,
  stepIndex: number
): OnboardingStepConfig | null {
  const config = getStepsForCategory(category);
  const stepMap: OnboardingStepConfig[] = [
    config.categoryProfile,
    config.operatingModel,
    config.revenueModel,
    config.teamResources,
  ];
  return stepMap[stepIndex - 1] ?? null;
}

export type { OnboardingField };
