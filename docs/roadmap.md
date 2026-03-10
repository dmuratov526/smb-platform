# Roadmap

## Current Stage

The product is currently in the **early frontend prototype stage**.

The goal of this stage is to build a clear, scalable frontend foundation that represents the core product structure and main user flows.

This stage focuses on interface architecture and user experience rather than backend implementation.

All data should currently use **mock data**.

---

# Phase 1 — Frontend Foundation

The first phase focuses on building the core application shell and navigation structure.

Goals:

- application layout
- sidebar navigation
- top navigation bar
- workspace layout
- routing structure
- placeholder pages for all modules
- responsive layout system
- global design patterns
- shared UI components

Key pages to scaffold:

- Business Builder
- Business Simulator
- Launch Planner
- Dashboard
- Businesses
- Finance
- Operations
- Marketing
- Team
- Analytics
- AI Assistant
- Settings

At this stage the pages may contain placeholder structures and mock data.

---

# Phase 2 — Core Product Surfaces

After the application shell is stable, development should focus on the core product identity.

Primary modules:

## Business Builder

Goals:

- business profile configuration
- industry template selection
- financial assumptions
- revenue streams
- cost categories
- staffing structure
- marketing channels
- operational structure
- AI-assisted configuration suggestions

This page should feel like a **business design environment** rather than a simple form.

---

## Business Simulator

Goals:

- adjustable business assumptions
- scenario configuration
- dynamic simulation outputs
- revenue projections
- cost projections
- break-even analysis
- scenario comparison
- visual analytical views

The simulator should be interactive and analytical.

---

## Launch Planner

Goals:

- launch roadmap
- milestones
- tasks
- dependencies
- progress visibility

The planner should convert the business model into an actionable launch plan.

---

# Phase 3 — Operational Modules

After Builder and Simulator are established, operational modules can be expanded.

Modules:

- Finance
- Operations
- Marketing
- Team
- Analytics

At this stage these modules may still use mock data but should begin to reflect real operational workflows.

Examples:

Finance:
- revenue tracking
- expense tracking
- financial summaries

Operations:
- workflows
- operational tasks
- internal processes

Marketing:
- campaigns
- marketing performance
- channel summaries

Team:
- roles
- people
- responsibilities
- tasks

Analytics:
- business performance indicators
- trend analysis
- insights

---

# Phase 4 — Product Intelligence

Later stages will expand intelligent capabilities.

Examples:

- AI-assisted business setup
- simulation explanations
- automated insights
- business diagnostics
- scenario suggestions
- AI-based summaries

The AI assistant should help users interpret and understand their business.

---

# Phase 5 — Backend and Integrations

Backend systems will be introduced in later stages.

Future areas include:

- ASP.NET Core backend
- MongoDB persistence
- authentication and authorization
- business data APIs
- simulation engine services
- analytics processing
- external integrations

Examples of integrations:

- banking
- payment systems
- accounting software
- advertising platforms
- e-commerce systems

These systems are **not part of the current frontend prototype stage**.

---

# Scope Discipline

During the current development stage:

Do NOT implement:

- authentication systems
- real backend APIs
- payment processing
- external integrations
- production infrastructure
- deployment pipelines
- microservices
- complex backend logic

The focus must remain on:

- frontend structure
- user flows
- UI architecture
- product clarity

---

# Development Philosophy

The prototype should already resemble a real SaaS product.

The frontend should be:

- clean
- modular
- scalable
- typed
- consistent
- maintainable

The goal is to build a strong product foundation that can later connect to backend systems without rewriting the entire frontend.