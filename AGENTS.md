# AGENTS.md

Before implementing features, review the documentation in the docs directory to understand product structure and design intentions.


Before implementing features:

- read AGENTS.md
- read TASK.md
- review the documentation in the docs directory
- follow architecture and product rules defined there

Prefer implementation patterns consistent with the latest official documentation of the technologies used in this project.

## Project identity

This project is a frontend prototype of a Business Operating System for small and medium-sized businesses (SMBs).

The platform helps entrepreneurs:
- create and structure a business
- simulate business assumptions and financial outcomes
- plan the launch
- manage ongoing operations
- monitor performance
- receive AI-assisted guidance

This is not a generic admin dashboard.
It is a business design, simulation, launch, and operations platform.

The primary product identity is centered around:
1. Business Builder
2. Business Simulator

The dashboard is secondary and should act as an overview after the business is already configured.

---

## Current scope

We are working on the frontend only.

Current priorities:
- application shell
- layout and navigation
- page structure
- responsive behavior
- reusable UI patterns
- mock data
- Business Builder
- Business Simulator
- Launch Planner

Out of scope for now unless explicitly requested:
- backend integration
- real APIs
- authentication
- infrastructure
- deployment
- external integrations
- production persistence

Use mock data only.

---

## Technology stack

Frontend must use:
- React
- TypeScript
- Redux Toolkit
- Material UI

All code must be written in TypeScript.

Do not use plain JavaScript.

Do not introduce other UI frameworks.

---

## Product positioning

The product should feel like a serious business workspace.

It should help users move through the business lifecycle:
1. idea and setup
2. model configuration
3. simulation and scenario testing
4. launch planning
5. operations and monitoring

Business Builder and Business Simulator must remain the most important surfaces in the product.

Do not design the product as if Dashboard were the main destination.

---

## Core product modules

Main modules:
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

The most important modules for the current prototype are:
- Business Builder
- Business Simulator
- Launch Planner
- Dashboard shell
- Businesses switcher and context

---

## UI strategy

The product follows a desktop-first responsive strategy.

The main layout should include:
- left sidebar navigation
- top bar
- central workspace

The top bar should support:
- active business switcher
- global search
- notifications
- profile or workspace controls
- contextual page actions when useful

The sidebar should prioritize:
1. Business Builder
2. Business Simulator
3. Launch Planner
4. Dashboard
then the rest of the modules

The interface should feel:
- structured
- clear
- modern
- professional
- operational
- scalable

Avoid overly decorative or consumer-style UI.

---

## Responsive behavior

Desktop is the primary experience.

Tablet and mobile should remain usable, but they are secondary and should focus more on:
- monitoring
- alerts
- quick actions
- summaries
- tasks

Do not try to force full desktop density into mobile.

On smaller screens, simplify layout patterns while preserving product logic.

---

## UI framework rule

Use Material UI as the primary UI framework.

Prefer Material UI patterns, theming, layout capabilities, and design consistency.

When implementing UI, choose the most appropriate modern Material UI-based solution for the task.

Custom components are allowed, but they should remain aligned with Material UI and the overall design system.

Avoid unnecessary custom styling when Material UI already provides a clean and scalable approach.

---

## Engineering decision principle

When multiple implementation approaches are possible, choose the one that is:
- clearer
- more maintainable
- more scalable
- more consistent with React + TypeScript + Redux Toolkit + Material UI
- more appropriate for a modern SaaS frontend

Prefer practical and production-like solutions.

Avoid outdated patterns, unnecessary abstractions, and premature complexity.

---

## Architecture expectations

Use a feature-oriented frontend architecture.

Keep concerns separated clearly.

Prefer:
- modular pages
- reusable UI sections
- strongly typed models
- clear boundaries between shared UI and feature logic
- scalable routing
- predictable state management

Do not create a chaotic component structure.

Do not mix unrelated feature logic.

---

## Routing principles

Application routing should reflect the main product modules.

Each major module should have a clear route and predictable navigation structure.

Routes should remain clean and scalable rather than deeply nested and difficult to maintain.

---

## UI consistency

All pages should follow consistent layout patterns, spacing, and interaction rules.

Users should not have to relearn UI behavior when navigating between modules.

Consistency across modules is more important than experimenting with different UI styles.

---

## State management

Use Redux Toolkit for shared application state.

Redux is appropriate for:
- active business context
- business-level shared state
- simulation inputs and outputs
- alerts and notifications
- dashboard summaries
- cross-page state that multiple modules depend on

Use local React state for temporary UI concerns.

Do not put trivial component-level state into Redux.

---

## TypeScript rules

Use strong TypeScript typing.

Avoid `any` unless there is a strong reason.

Important business concepts should have explicit types or interfaces, such as:
- Business
- BusinessTemplate
- BusinessConfiguration
- SimulationScenario
- LaunchPlan
- FinancialTransaction
- OperationalProcess
- Task
- Employee
- MarketingCampaign
- AnalyticsMetric
- Alert

Prefer explicit typing for props, shared models, selectors, and mock data.

---

## Performance expectations

The product may become data-heavy.

Prefer:
- efficient rendering
- logical component boundaries
- memoization where useful
- stable props
- selector-based Redux access
- avoiding unnecessary re-renders

Do not optimize prematurely in a complicated way, but do avoid obviously wasteful patterns.

---

## Implementation behavior

When working on a task:
1. inspect the existing structure first
2. preserve consistency
3. reuse established patterns
4. avoid unrelated refactors
5. keep output practical and focused
6. implement the simplest scalable version
7. use mock data where real data is unavailable

Do not invent backend behavior.
Do not fake production integration flows unless explicitly requested.

---

## Product behavior rules

The product should be stage-aware.

Examples:
- if no business exists yet, the experience should guide the user into Business Builder
- if a business exists but assumptions are not yet validated, the product should guide the user into Business Simulator
- if a business is already active, Dashboard and operations become more useful

The UX should reflect the user’s current business stage rather than showing a generic dashboard by default.

---

## What to avoid

Do not introduce:
- unrelated libraries
- additional UI frameworks
- unnecessary design systems
- backend-first patterns
- mock APIs pretending to be fully real backend integrations
- microfrontend or microservice thinking
- over-engineered abstractions

This project is currently a frontend prototype and should stay focused.

---

## Quality bar

All code should look like production-quality SaaS frontend code.

The result should be:
- clean
- typed
- consistent
- reusable
- scalable
- understandable


For full product documentation see the docs directory.

## Agent initiative

The agent is allowed to introduce small improvements and missing pieces when they are clearly useful for the project.

Examples may include:
- additional helper utilities
- small reusable components
- types and interfaces
- simple architectural adjustments
- better naming or structure
- minor refactoring for clarity

However, these additions must follow several rules:

- they must be clearly justified
- they must improve clarity or maintainability
- they must remain consistent with the existing architecture
- they must not introduce unnecessary complexity

Do not add large frameworks, major libraries, or architectural changes unless explicitly requested.

Prefer minimal, practical, and production-quality solutions.

When something important is missing, the agent may implement the simplest reasonable solution instead of blocking progress.

## Code quality principles

Prefer clear and maintainable code over clever or overly abstract solutions.

When implementing features:
- keep components focused and reasonably small
- avoid deeply nested logic
- avoid unnecessary abstractions
- prefer explicit and readable code

If a simpler solution works well, prefer it over a more complex architecture.

The code should resemble production-quality SaaS frontend code.

## React implementation principles

Follow modern React best practices.

Prefer:
- functional components
- hooks
- predictable state flow
- clear component boundaries

Avoid:
- very large monolithic components
- unnecessary prop drilling
- unstable props that cause unnecessary re-renders


## Consistency rule

Before introducing new patterns or structures:

1. inspect the existing code
2. reuse established patterns
3. maintain architectural consistency

Do not introduce competing patterns inside the same codebase unless clearly justified.

## Engineering decisions

If multiple implementation approaches are possible, choose the solution that is:

- simpler
- clearer
- easier to maintain
- consistent with React + TypeScript + Redux Toolkit + Material UI
- appropriate for a modern SaaS application

Prefer patterns consistent with the latest official documentation of React, Redux Toolkit, Material UI, and TypeScript.

## Final rule

All generated code should look like production-quality SaaS code written by an experienced frontend engineer.