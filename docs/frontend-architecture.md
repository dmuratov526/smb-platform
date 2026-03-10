# Frontend Architecture

## Purpose

The frontend should provide a structured, scalable, and responsive interface for a Business Operating System for SMBs.

It must support the full product lifecycle on the interface level:
- business setup
- business configuration
- simulation
- launch planning
- operational monitoring
- finance
- analytics
- AI-assisted interaction

The frontend is currently being built as a prototype and must use mock data.

---

## Core frontend principles

The frontend should be designed around the following principles:

- clarity
- modularity
- scalability
- strong typing
- predictable state management
- responsive behavior
- reusable UI patterns
- production-quality structure

The codebase should feel like the beginning of a real SaaS product, not a throwaway prototype.

---

## Required stack

The frontend must use:
- React
- TypeScript
- Redux Toolkit
- Material UI

All implementation must be in TypeScript.

Do not use plain JavaScript.

Do not introduce alternative UI frameworks.

---

## Architectural direction

The frontend should follow a feature-oriented structure.

Major product areas should remain conceptually separate, such as:
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

Each feature should be able to grow without turning the application into a flat, tangled component tree.

Shared UI, shared utilities, and shared types should remain separate from feature-specific logic.

---

## Page architecture

Pages should be composed from smaller reusable sections rather than large monolithic components.

A page should typically consist of:
- page shell or layout wrapper
- page header
- controls or filters section
- content sections
- contextual actions
- optional side assistance or detail panel

This keeps pages readable and allows deeper modules to evolve over time.

---

## Component design principles

Components should be:
- focused
- reusable where appropriate
- strongly typed
- easy to understand
- easy to move or refactor later

Prefer smaller purpose-driven components over very large all-in-one components.

Do not create excessive micro-components for trivial markup.
Choose practical component boundaries.

Custom components are encouraged when they improve consistency, but they should align with Material UI patterns and the overall design language.

---

## State management

Use Redux Toolkit for shared application state.

Redux should be used for state that matters across pages or features, such as:
- active business context
- selected business
- business-level configuration summaries
- simulation state
- scenario comparison state
- dashboard summaries
- alerts and notifications
- cross-feature derived state

Local React state should be used for:
- temporary UI interactions
- dialog visibility
- local form editing before commit
- component-level toggles
- transient display state

Do not place trivial UI state in Redux.

---

## TypeScript expectations

Strong typing is required.

Important business concepts should have explicit types or interfaces.

Examples include:
- Business
- BusinessTemplate
- BusinessConfiguration
- SimulationScenario
- LaunchPlan
- FinancialTransaction
- FinancialCategory
- OperationalProcess
- Task
- Employee
- MarketingCampaign
- AnalyticsMetric
- Alert
- DashboardSummary

Avoid `any` unless there is a strong reason.

Use typed props, typed selectors, typed mock data, and typed shared models.

---

## Mock data strategy

The prototype uses mock data only.

Mock data should:
- reflect realistic business scenarios
- be consistent with the product model
- support Builder, Simulator, Dashboard, and related modules
- feel close to actual use cases rather than placeholder nonsense

Mock data should not imitate real APIs unnecessarily.
It should support UI and flow development clearly.

---

## UI system

Material UI is the primary UI framework.

The frontend should rely on:
- Material UI patterns
- Material UI theming
- Material UI layout capabilities
- consistent spacing and hierarchy
- a clean SaaS-like interface language

Use the most appropriate Material UI-based solution for each task.

Avoid bringing in Tailwind, Bootstrap, Ant Design, Chakra, or other UI systems.

Custom styling should remain controlled and aligned with the overall Material UI-based design system.

---

## Layout philosophy

The application is desktop-first.

The richest workflows happen on desktop, especially:
- Business Builder
- Business Simulator
- Launch Planner
- Finance
- Analytics

Tablet and mobile should remain usable, but they should simplify density and support lighter workflows where necessary.

The layout must support:
- left navigation
- top-level workspace
- flexible content sections
- information-dense but readable screens

---

## Routing principles

Routing should reflect product structure clearly.

Each major module should have a clear top-level route.

Some modules may later include nested routes or subviews.

Examples:
- Business Builder may later have subviews for profile, financial setup, operations, staffing, and marketing
- Business Simulator may later have subviews or tabs for assumptions, results, charts, and comparisons
- Finance may later have summaries, transactions, and categories

Routing should remain clean and predictable.

---

## Performance principles

The product may become visually and computationally heavy.

Potentially heavy areas include:
- dashboards
- simulation views
- large forms
- tables
- derived summaries
- scenario comparison panels

Therefore:
- avoid unnecessary re-renders
- prefer stable props
- use memoization when helpful
- use selector-based Redux access
- avoid expensive derived calculations directly in large render trees
- keep component boundaries logical

Performance should be considered early, but without premature over-engineering.

---

## Consistency rule

Before introducing a new pattern, component style, or structural approach:
1. inspect the existing codebase
2. reuse established patterns if they are sound
3. preserve architectural consistency

Do not introduce competing patterns inside the same codebase unless clearly justified.

---

## Implementation quality bar

All frontend code should aim to look like production-quality SaaS frontend code.

The expected result is:
- clean
- typed
- modular
- scalable
- readable
- consistent
- practical

The frontend should be easy to continue, not just easy to generate once.