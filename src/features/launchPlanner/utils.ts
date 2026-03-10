import { BusinessIndustry, BusinessCategoryKey } from '../../types';
import {
  PlannerPlan,
  LaunchPhase,
  PlannerTask,
  LaunchReadiness,
  PhaseReadiness,
  TaskTemplate,
  PhaseTaskSet,
  PhaseDefinition,
} from './types';

export const PHASE_DEFINITIONS: PhaseDefinition[] = [
  {
    id: 'phase-foundation',
    name: 'Foundation',
    description: 'Legal setup, business structure, and administrative foundations.',
    order: 1,
  },
  {
    id: 'phase-offer',
    name: 'Offer & Setup',
    description: 'Product or service preparation, pricing, branding, and supply chain.',
    order: 2,
  },
  {
    id: 'phase-operations',
    name: 'Operations Readiness',
    description: 'Tools, systems, processes, and team onboarding.',
    order: 3,
  },
  {
    id: 'phase-marketing',
    name: 'Marketing Readiness',
    description: 'Brand presence, channels, audience building, and pre-launch campaigns.',
    order: 4,
  },
  {
    id: 'phase-launch',
    name: 'Launch Execution',
    description: 'Final preparations, soft launch testing, and go-live activities.',
    order: 5,
  },
];

const FOOD_SERVICE_TASKS: PhaseTaskSet[] = [
  {
    phaseId: 'phase-foundation',
    tasks: [
      { title: 'Register business entity (LLC or sole proprietorship)', description: 'Choose business structure and complete state filing', dueTiming: 'Week 1' },
      { title: 'Obtain food service permit and health department approval', description: 'Apply for all required food handling and safety licenses', dueTiming: 'Week 1–2' },
      { title: 'Open business bank account', description: 'Separate business finances from personal accounts', dueTiming: 'Week 2' },
      { title: 'Secure business insurance policy', description: 'General liability and property coverage in place', dueTiming: 'Week 2–3' },
      { title: 'Sign location lease agreement', description: 'Finalize lease terms and secure the premises', dueTiming: 'Week 2–3' },
    ],
  },
  {
    phaseId: 'phase-offer',
    tasks: [
      { title: 'Finalize menu items and pricing structure', description: 'Confirm recipes, portion sizes, and target food cost margins', dueTiming: 'Week 2–4' },
      { title: 'Source and purchase kitchen equipment', description: 'Commercial appliances, smallwares, and tools ordered', dueTiming: 'Week 3–5' },
      { title: 'Establish supplier accounts', description: 'Coffee, dairy, food ingredients, and packaging suppliers confirmed', dueTiming: 'Week 3–4' },
      { title: 'Design brand identity and printed materials', description: 'Logo, color palette, menus, signage, and packaging', dueTiming: 'Week 4–6' },
      { title: 'Complete interior buildout and design', description: 'Furniture, decor, and customer experience setup finished', dueTiming: 'Week 4–7' },
    ],
  },
  {
    phaseId: 'phase-operations',
    tasks: [
      { title: 'Install and configure POS system', description: 'Payments, tipping, order tracking, and reporting ready', dueTiming: 'Week 6–7' },
      { title: 'Set up inventory tracking and par levels', description: 'Opening stock counts, reorder points, and receiving process', dueTiming: 'Week 6–7' },
      { title: 'Create opening and closing checklists', description: 'Daily operational procedures documented for all staff', dueTiming: 'Week 7' },
      { title: 'Configure accounting and bookkeeping software', description: 'Chart of accounts, expense categories, and sales tracking', dueTiming: 'Week 5–6' },
      { title: 'Set up online ordering or delivery integration', description: 'Connect to DoorDash, Uber Eats, or own ordering platform', dueTiming: 'Week 7–8' },
    ],
  },
  {
    phaseId: 'phase-marketing',
    tasks: [
      { title: 'Create and optimize social media profiles', description: 'Instagram, Facebook, TikTok, and Google Business set up', dueTiming: 'Week 4–5' },
      { title: 'Build pre-launch audience and email list', description: 'Capture interest and follow-through before opening', dueTiming: 'Week 5–7' },
      { title: 'Design grand opening promotion campaign', description: 'Discounts, giveaways, and influencer partnerships planned', dueTiming: 'Week 6–7' },
      { title: 'Create opening day marketing materials', description: 'Posters, flyers, and digital assets ready to publish', dueTiming: 'Week 7' },
      { title: 'Reach out to local press and community groups', description: 'Local bloggers, community boards, and neighborhood organizations', dueTiming: 'Week 7–8' },
    ],
  },
  {
    phaseId: 'phase-launch',
    tasks: [
      { title: 'Complete staff hiring and onboarding', description: 'All positions filled and paperwork completed', dueTiming: 'Week 7–8' },
      { title: 'Conduct full staff training week', description: 'Service standards, recipes, POS workflow, and safety procedures', dueTiming: 'Week 8' },
      { title: 'Run friends and family soft launch', description: 'Test full operations with a controlled group of invited guests', dueTiming: 'Launch –3 days' },
      { title: 'Address soft launch feedback and fix issues', description: 'Close operational gaps identified during the soft launch', dueTiming: 'Launch –1 day' },
      { title: 'Execute grand opening event', description: 'Public opening with full promotion and marketing push activated', dueTiming: 'Launch Day' },
    ],
  },
];

const RETAIL_TASKS: PhaseTaskSet[] = [
  {
    phaseId: 'phase-foundation',
    tasks: [
      { title: 'Register business entity', description: 'LLC or corporation filing with state authorities', dueTiming: 'Week 1' },
      { title: 'Secure retail location and sign lease', description: 'Negotiate terms, confirm zoning compliance, and take possession', dueTiming: 'Week 1–3' },
      { title: 'Open business bank account', description: 'Business checking account for operations and inventory purchases', dueTiming: 'Week 2' },
      { title: 'Obtain retail business licenses and seller permit', description: 'Local business license and state sales tax permit', dueTiming: 'Week 2–3' },
      { title: 'Set up business insurance', description: 'General liability, property, and product coverage', dueTiming: 'Week 2–3' },
    ],
  },
  {
    phaseId: 'phase-offer',
    tasks: [
      { title: 'Source initial product inventory from suppliers', description: 'First purchase orders placed, confirmed, and in transit', dueTiming: 'Week 3–5' },
      { title: 'Set up product catalog and SKU system', description: 'Product names, barcodes, prices, and categories defined', dueTiming: 'Week 4–5' },
      { title: 'Plan store layout and visual merchandising', description: 'Floor plan, fixture placement, and customer flow strategy', dueTiming: 'Week 4–6' },
      { title: 'Build or configure e-commerce store', description: 'Shopify, WooCommerce, or similar platform live with products', dueTiming: 'Week 4–7' },
      { title: 'Establish vendor payment terms and relationships', description: 'Net terms, credit accounts, and reorder minimums agreed', dueTiming: 'Week 3–5' },
    ],
  },
  {
    phaseId: 'phase-operations',
    tasks: [
      { title: 'Install POS system and payment processing', description: 'Card terminals, receipt printers, and cash handling configured', dueTiming: 'Week 6–7' },
      { title: 'Configure inventory management system', description: 'Stock levels, reorder alerts, and receiving workflow in place', dueTiming: 'Week 6–7' },
      { title: 'Hire and onboard store staff', description: 'Retail associates and manager hired and trained', dueTiming: 'Week 6–8' },
      { title: 'Establish returns, exchange, and refund policy', description: 'Policy documented and communicated to staff and customers', dueTiming: 'Week 7' },
      { title: 'Set up accounting and sales tax software', description: 'Sales tax configuration, expense tracking, and invoicing', dueTiming: 'Week 5–6' },
    ],
  },
  {
    phaseId: 'phase-marketing',
    tasks: [
      { title: 'Create social media presence', description: 'Instagram, Facebook, and Pinterest product pages set up', dueTiming: 'Week 5–6' },
      { title: 'Set up Google Business profile', description: 'Business listing with photos, hours, and location', dueTiming: 'Week 5–6' },
      { title: 'Plan grand opening event and promotions', description: 'Opening discounts, giveaways, and local partnerships organized', dueTiming: 'Week 6–7' },
      { title: 'Build local community and business partnerships', description: 'Neighboring businesses, local influencers, and community orgs', dueTiming: 'Week 6–8' },
      { title: 'Set up customer loyalty program and email capture', description: 'Rewards system and mailing list to retain customers from day one', dueTiming: 'Week 7' },
    ],
  },
  {
    phaseId: 'phase-launch',
    tasks: [
      { title: 'Complete store fitout and visual merchandising', description: 'All products displayed and store fully ready for customers', dueTiming: 'Launch –3 days' },
      { title: 'Run staff training and mock operations', description: 'Full run-through of open and close procedures with team', dueTiming: 'Launch –2 days' },
      { title: 'Conduct soft opening for friends and family', description: 'Test operations and gather feedback before public launch', dueTiming: 'Launch –1 day' },
      { title: 'Launch digital advertising campaigns', description: 'Facebook Ads, Google Local, and Instagram campaigns activated', dueTiming: 'Launch Day' },
      { title: 'Execute grand opening event', description: 'Public opening with promotions and community outreach', dueTiming: 'Launch Day' },
    ],
  },
];

const DIGITAL_CONSULTING_TASKS: PhaseTaskSet[] = [
  {
    phaseId: 'phase-foundation',
    tasks: [
      { title: 'Register business entity', description: 'LLC or S-Corp filing and EIN registration with the IRS', dueTiming: 'Week 1' },
      { title: 'Set up professional domain and email', description: 'Custom domain with G Suite or Microsoft 365 for business email', dueTiming: 'Week 1' },
      { title: 'Open business bank account', description: 'Separate business checking and savings accounts', dueTiming: 'Week 1–2' },
      { title: 'Prepare master service agreement (MSA) templates', description: 'Legal contracts reviewed and ready for client engagements', dueTiming: 'Week 2–3' },
      { title: 'Secure professional liability (E&O) insurance', description: 'Errors and omissions plus general business coverage', dueTiming: 'Week 2–3' },
    ],
  },
  {
    phaseId: 'phase-offer',
    tasks: [
      { title: 'Define service packages and pricing tiers', description: 'Clearly scoped offerings with fixed-fee or retainer pricing', dueTiming: 'Week 2–3' },
      { title: 'Create client proposal and pitch deck templates', description: 'Reusable templates for new business development', dueTiming: 'Week 3–4' },
      { title: 'Build portfolio and case study materials', description: 'Past work examples, measurable results, and client testimonials', dueTiming: 'Week 3–5' },
      { title: 'Document service delivery methodology', description: 'How work is scoped, executed, reviewed, and delivered', dueTiming: 'Week 4–5' },
      { title: 'Define client onboarding process', description: 'Kickoff agenda, intake forms, tool access, and communication norms', dueTiming: 'Week 4–5' },
    ],
  },
  {
    phaseId: 'phase-operations',
    tasks: [
      { title: 'Set up CRM system for lead and pipeline tracking', description: 'HubSpot, Pipedrive, or similar configured and ready', dueTiming: 'Week 3–4' },
      { title: 'Configure project management tool', description: 'Asana, Notion, or ClickUp for client project delivery', dueTiming: 'Week 3–4' },
      { title: 'Set up invoicing, billing, and payment workflow', description: 'QuickBooks, FreshBooks, or Stripe invoicing configured', dueTiming: 'Week 2–3' },
      { title: 'Define internal communication and meeting standards', description: 'Slack workspace, meeting cadences, and response SLAs', dueTiming: 'Week 4' },
      { title: 'Set up client reporting templates', description: 'Standard reporting formats and dashboards for ongoing clients', dueTiming: 'Week 4–5' },
    ],
  },
  {
    phaseId: 'phase-marketing',
    tasks: [
      { title: 'Build and launch professional website', description: 'Services, case studies, team, contact, and lead capture form', dueTiming: 'Week 4–6' },
      { title: 'Optimize LinkedIn company and personal profiles', description: 'Founder and company presence fully built out on LinkedIn', dueTiming: 'Week 3–4' },
      { title: 'Define content marketing strategy', description: 'Blog posts, LinkedIn content calendar, and case study publishing plan', dueTiming: 'Week 4–5' },
      { title: 'Set up referral and partner program', description: 'Incentivize referrals from existing network and past colleagues', dueTiming: 'Week 5–6' },
      { title: 'Launch outbound prospecting campaign', description: 'Cold email, LinkedIn outreach, or warm introductions strategy', dueTiming: 'Week 5–6' },
    ],
  },
  {
    phaseId: 'phase-launch',
    tasks: [
      { title: 'Conduct first round of discovery calls', description: 'Qualify 5–10 target prospects with introductory calls', dueTiming: 'Week 6–7' },
      { title: 'Send first proposals to qualified prospects', description: 'Customized proposals based on discovery call findings', dueTiming: 'Week 7' },
      { title: 'Close first 1–3 client engagements', description: 'Signed contracts and deposit payments received', dueTiming: 'Week 7–8' },
      { title: 'Publish launch announcement across channels', description: 'LinkedIn post, email blast, and website news section', dueTiming: 'Launch Day' },
      { title: 'Activate referral network with launch message', description: 'Personal outreach to existing contacts about your new services', dueTiming: 'Launch Day' },
    ],
  },
];

const SAAS_TASKS: PhaseTaskSet[] = [
  {
    phaseId: 'phase-foundation',
    tasks: [
      { title: 'Incorporate company and define legal structure', description: 'Delaware C-Corp or LLC with co-founder and IP agreements signed', dueTiming: 'Week 1' },
      { title: 'Set up development environment and CI/CD pipeline', description: 'GitHub, deployment pipeline, and dev/staging/prod environments', dueTiming: 'Week 1–2' },
      { title: 'Open business bank account and Stripe account', description: 'Business banking and payment processing infrastructure ready', dueTiming: 'Week 2' },
      { title: 'Define MVP feature scope and product roadmap', description: 'Core features for launch locked, backlog documented for post-launch', dueTiming: 'Week 1–2' },
      { title: 'Complete IP assignment agreements for all contributors', description: 'All team members have signed IP and contractor agreements', dueTiming: 'Week 2' },
    ],
  },
  {
    phaseId: 'phase-offer',
    tasks: [
      { title: 'Build core product features to MVP standard', description: 'All required MVP functionality implemented and tested', dueTiming: 'Week 3–8' },
      { title: 'Implement user authentication and account management', description: 'Sign up, login, password reset, and profile management working', dueTiming: 'Week 3–5' },
      { title: 'Build customer onboarding flow', description: 'In-app guidance from sign-up to first value moment', dueTiming: 'Week 6–8' },
      { title: 'Define and implement pricing tiers', description: 'Free, starter, and pro plans configured with feature gating', dueTiming: 'Week 6–7' },
      { title: 'Set up billing and subscription management', description: 'Stripe billing, plan upgrades/downgrades, and invoice emails', dueTiming: 'Week 7–8' },
    ],
  },
  {
    phaseId: 'phase-operations',
    tasks: [
      { title: 'Set up error monitoring and production logging', description: 'Sentry, Datadog, or similar for production issue tracking', dueTiming: 'Week 6' },
      { title: 'Configure in-app analytics and event tracking', description: 'Mixpanel, Amplitude, or PostHog for feature usage tracking', dueTiming: 'Week 6–7' },
      { title: 'Set up customer support workflow', description: 'Intercom, Zendesk, or email support process with response SLA', dueTiming: 'Week 7' },
      { title: 'Create onboarding documentation and help center', description: 'Getting started guides and feature documentation published', dueTiming: 'Week 7–8' },
      { title: 'Implement security review and data compliance basics', description: 'GDPR/CCPA compliance, privacy policy, and terms of service live', dueTiming: 'Week 7–8' },
    ],
  },
  {
    phaseId: 'phase-marketing',
    tasks: [
      { title: 'Build marketing landing page', description: 'Value proposition, features, pricing, and sign-up CTA live', dueTiming: 'Week 6–7' },
      { title: 'Set up SEO fundamentals and content strategy', description: 'Meta tags, sitemap, schema, and first blog posts targeting keywords', dueTiming: 'Week 7–8' },
      { title: 'Create product demo or explainer video', description: 'Walkthrough of core value and key features', dueTiming: 'Week 8' },
      { title: 'Set up email marketing and drip sequences', description: 'Welcome email, onboarding sequence, and re-engagement flows', dueTiming: 'Week 7–8' },
      { title: 'Define acquisition channels and experiment plan', description: 'SEO, paid ads, content, and community strategy defined', dueTiming: 'Week 7–8' },
    ],
  },
  {
    phaseId: 'phase-launch',
    tasks: [
      { title: 'Run closed beta with target users', description: 'Invite 20–50 beta testers for real usage feedback', dueTiming: 'Week 8–10' },
      { title: 'Iterate on beta feedback and fix critical issues', description: 'Address bugs and UX improvements from beta insights', dueTiming: 'Week 10–11' },
      { title: 'Prepare Product Hunt launch page and materials', description: 'Screenshots, tagline, and hunter coordination finalized', dueTiming: 'Launch –1 week' },
      { title: 'Activate paid acquisition campaigns at launch', description: 'Google Ads and LinkedIn Ads configured and ready to run', dueTiming: 'Launch Day' },
      { title: 'Execute launch day campaign across all channels', description: 'PH launch, email blast, social posts, and community announcements', dueTiming: 'Launch Day' },
    ],
  },
];

const GENERIC_TASKS: PhaseTaskSet[] = [
  {
    phaseId: 'phase-foundation',
    tasks: [
      { title: 'Register business entity', description: 'LLC or sole proprietorship filing with state or local authorities', dueTiming: 'Week 1' },
      { title: 'Open business bank account', description: 'Separate business finances from personal accounts', dueTiming: 'Week 1–2' },
      { title: 'Obtain required licenses and permits', description: 'Industry-specific licensing from local and state authorities', dueTiming: 'Week 2–3' },
      { title: 'Set up business insurance', description: 'General liability and relevant business coverage', dueTiming: 'Week 2–3' },
      { title: 'Define business structure and ownership agreements', description: 'Operating agreement or partnership terms documented', dueTiming: 'Week 1–2' },
    ],
  },
  {
    phaseId: 'phase-offer',
    tasks: [
      { title: 'Finalize product or service offering', description: 'Define scope, pricing tiers, and delivery model', dueTiming: 'Week 2–4' },
      { title: 'Develop product samples or service documentation', description: 'Tangible materials, prototypes, or service spec sheets', dueTiming: 'Week 3–5' },
      { title: 'Establish supplier or vendor relationships', description: 'Source materials, tools, or partners needed for delivery', dueTiming: 'Week 3–5' },
      { title: 'Set pricing strategy and structure', description: 'Competitive analysis, margin targets, and pricing tiers finalized', dueTiming: 'Week 3–4' },
      { title: 'Create brand identity', description: 'Name, logo, colors, and basic visual identity completed', dueTiming: 'Week 4–6' },
    ],
  },
  {
    phaseId: 'phase-operations',
    tasks: [
      { title: 'Set up core business tools and software', description: 'CRM, accounting, and project management essentials configured', dueTiming: 'Week 4–5' },
      { title: 'Configure payment processing', description: 'Stripe, PayPal, or POS terminal set up and tested', dueTiming: 'Week 5–6' },
      { title: 'Establish core operational processes and checklists', description: 'Key workflows documented and ready for team use', dueTiming: 'Week 5–6' },
      { title: 'Build or hire initial team', description: 'Core staff or contractors recruited and onboarded', dueTiming: 'Week 5–7' },
      { title: 'Set up accounting and financial tracking', description: 'Chart of accounts, expense categories, and invoicing configured', dueTiming: 'Week 4–5' },
    ],
  },
  {
    phaseId: 'phase-marketing',
    tasks: [
      { title: 'Build website or online presence', description: 'Landing page or full website live with contact information', dueTiming: 'Week 4–6' },
      { title: 'Set up social media profiles', description: 'Relevant platforms for your target audience created and branded', dueTiming: 'Week 4–5' },
      { title: 'Define go-to-market strategy', description: 'Target customer, key messages, and acquisition channels decided', dueTiming: 'Week 5–6' },
      { title: 'Prepare launch marketing materials', description: 'Announcements, promotions, and launch content ready to publish', dueTiming: 'Week 6–7' },
      { title: 'Build initial audience or prospect list', description: 'Email list, social followers, or warm prospect list growing', dueTiming: 'Week 5–7' },
    ],
  },
  {
    phaseId: 'phase-launch',
    tasks: [
      { title: 'Conduct final readiness review', description: 'Confirm all systems, staff, and materials are fully ready', dueTiming: 'Launch –2 days' },
      { title: 'Run soft launch with limited audience', description: 'Test operations with a small invited group before full launch', dueTiming: 'Launch –1 day' },
      { title: 'Address soft launch feedback and issues', description: 'Fix any problems identified before full public launch', dueTiming: 'Launch –1 day' },
      { title: 'Execute launch day activities', description: 'Full marketing push and business operations open to the public', dueTiming: 'Launch Day' },
      { title: 'Monitor and respond to launch day feedback', description: 'Track issues, respond to customers, and note improvements', dueTiming: 'Launch Day +1' },
    ],
  },
];

function getTaskTemplates(
  industry: BusinessIndustry,
  category?: BusinessCategoryKey
): PhaseTaskSet[] {
  if (industry === 'food_service') return FOOD_SERVICE_TASKS;
  if (industry === 'retail') return RETAIL_TASKS;
  if (
    industry === 'digital' ||
    category === 'consulting_agency' ||
    category === 'design_studio' ||
    category === 'software_agency'
  ) {
    return DIGITAL_CONSULTING_TASKS;
  }
  if (category === 'saas' || category === 'mobile_app') return SAAS_TASKS;
  if (industry === 'services') return DIGITAL_CONSULTING_TASKS;
  return GENERIC_TASKS;
}

export function buildDefaultPlan(
  businessId: string,
  industry: BusinessIndustry,
  category?: BusinessCategoryKey,
  targetLaunchDate?: string
): PlannerPlan {
  const templates = getTaskTemplates(industry, category);

  const phases: LaunchPhase[] = PHASE_DEFINITIONS.map((phaseDef) => {
    const phaseTemplate = templates.find((t) => t.phaseId === phaseDef.id);
    const tasks: PlannerTask[] = (phaseTemplate?.tasks ?? []).map(
      (taskTmpl: TaskTemplate, idx: number) => ({
        id: `${businessId}-${phaseDef.id}-task-${idx + 1}`,
        phaseId: phaseDef.id,
        title: taskTmpl.title,
        description: taskTmpl.description,
        status: 'not_started' as const,
        dueTiming: taskTmpl.dueTiming,
      })
    );

    return {
      id: phaseDef.id,
      name: phaseDef.name,
      description: phaseDef.description,
      order: phaseDef.order,
      tasks,
    };
  });

  return {
    businessId,
    phases,
    targetLaunchDate: targetLaunchDate ?? '',
  };
}

export function computeReadiness(plan: PlannerPlan): LaunchReadiness {
  const allTasks = plan.phases.flatMap((p) => p.tasks);
  const completed = allTasks.filter((t) => t.status === 'completed').length;
  const inProgress = allTasks.filter((t) => t.status === 'in_progress').length;
  const blocked = allTasks.filter((t) => t.status === 'blocked').length;
  const remaining = allTasks.filter((t) => t.status === 'not_started').length;
  const total = allTasks.length;
  const overallPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const phaseReadiness: PhaseReadiness[] = plan.phases.map((phase) => {
    const pCompleted = phase.tasks.filter((t) => t.status === 'completed').length;
    const pInProgress = phase.tasks.filter((t) => t.status === 'in_progress').length;
    const pTotal = phase.tasks.length;
    const pPercent = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;
    return {
      phaseId: phase.id,
      name: phase.name,
      completedTasks: pCompleted,
      inProgressTasks: pInProgress,
      totalTasks: pTotal,
      percent: pPercent,
    };
  });

  const activePhaseIndex = phaseReadiness.findIndex((p) => p.percent < 100);

  return {
    overallPercent,
    completedTasks: completed,
    inProgressTasks: inProgress,
    blockedTasks: blocked,
    remainingTasks: remaining,
    totalTasks: total,
    phaseReadiness,
    activePhaseIndex: activePhaseIndex === -1 ? plan.phases.length - 1 : activePhaseIndex,
  };
}
