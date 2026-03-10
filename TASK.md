# TASK.md

## Current task

Implement the first real version of the Dashboard for the Business Operating System.

Before implementing, read:

- AGENTS.md
- documentation in docs/

Assume the application already supports:

- mock user sessions
- multiple users
- multiple businesses
- category-based onboarding
- active business context
- Business Builder
- Business Simulator
- Launch Planner
- Operations Workspace

Do NOT rebuild those modules.

This task focuses on implementing the Dashboard as the business control center.

---

# Goal

Create the first functional version of the Dashboard.

The Dashboard should act as a central overview of the active business and connect all major modules together.

Users should be able to quickly understand:

- what business is active
- what stage the business is in
- how the business model currently looks
- projected performance from simulation
- launch readiness
- operational health
- what needs attention right now

The Dashboard should feel like a founder control center, not a generic KPI dashboard.

---

# Scope

Implement:

- Dashboard page
- dashboard summary components
- derived dashboard selectors
- cross-module summary widgets
- priority / attention list
- recommended next step section
- integration with the active business

Use only existing frontend state and mock data.

No backend.
No APIs.
No authentication changes.
No persistence.

---

# Core dashboard concept

The Dashboard aggregates information from the core modules:

- Business Builder
- Business Simulator
- Launch Planner
- Operations

The Dashboard should NOT duplicate full functionality from those modules.

Instead it should:

- summarize
- highlight
- prioritize
- guide the founder to the next action

---

# Dashboard sections

The Dashboard should contain the following sections.

---

## 1. Business overview header

Show basic information about the active business.

Include at minimum:

- business name
- business category
- business stage
- short description
- location if available
- team size if available

This section should make the page clearly tied to a real business.

---

## 2. Business health summary

Provide a high-level overview of the business condition.

Include summary cards such as:

- builder completeness
- simulation viability
- launch readiness
- operations health

These values can be derived from existing state.

Examples:
- percentage of builder fields completed
- projected profit status
- launch tasks completion percentage
- open operations issues

---

## 3. Business model snapshot

Provide a compact summary of the Business Builder configuration.

Show short summaries of:

- offer
- target customer
- revenue model
- acquisition strategy
- operations structure
- financial snapshot

Include a clear action to open the Business Builder.

---

## 4. Simulation snapshot

Provide a compact summary of the Business Simulator.

Show:

- active scenario
- projected monthly revenue
- projected monthly costs
- operating profit
- break-even estimate
- margin

Include a link or action to open the Business Simulator.

---

## 5. Launch progress summary

Provide a summary of Launch Planner progress.

Show:

- launch readiness percentage
- completed tasks
- remaining tasks
- current launch phase
- next milestone

Include navigation to the Launch Planner.

---

## 6. Operations summary

Provide a quick overview of operations.

Include:

- operations health indicator
- number of open issues
- recurring tasks due soon
- completed recurring tasks

Include navigation to the Operations module.

---

## 7. Priority / attention list

Show what requires immediate attention.

Examples:

- launch tasks due soon
- open operational issues
- missing builder sections
- weak simulation results
- recurring tasks due today

This should be a simple prioritized list.

---

## 8. Recommended next step

Provide a simple recommendation for what the founder should do next.

Examples:

- complete Business Builder sections
- review simulation scenarios
- finish launch preparation
- resolve operational issue
- add recurring operational tasks

This logic can be simple rule-based.

---

# Stage awareness

The Dashboard should reflect the business lifecycle:

idea → business setup → simulation → launch planning → operations → analytics

Examples:

Early stage:
- highlight builder progress
- encourage simulation

Pre-launch stage:
- highlight launch readiness
- show pending setup tasks

Operational stage:
- highlight operations health
- show issues and recurring work

The logic does not need to be complex.

---

# Category awareness

The Dashboard should be aware of the business category.

Different categories may slightly influence the emphasis of sections.

Examples:

Restaurant:
- inventory readiness
- staffing readiness

SaaS:
- acquisition assumptions
- conversion metrics

Agency:
- client pipeline
- delivery capacity

This can remain lightweight in v1.

---

# UX expectations

The Dashboard should feel like:

- a founder command center
- a business control panel
- a cross-module overview

Avoid:

- generic KPI dashboards
- too many widgets
- chart overload
- duplicated module screens

Focus on clarity and usefulness.

---

# State management

Prefer derived state.

Use selectors to compute dashboard summaries from existing slices:

- businesses
- businessModel
- businessSimulator
- launchPlanner
- operations

Avoid duplicating data in a new slice unless necessary.

---

# Suggested architecture

Suggested structure:

src/features/dashboard/

- DashboardPage.tsx
- selectors.ts
- utils.ts
- types.ts

components:

- BusinessOverviewHeader.tsx
- HealthSummary.tsx
- BusinessModelSnapshot.tsx
- SimulationSnapshot.tsx
- LaunchProgressSummary.tsx
- OperationsSummary.tsx
- PriorityList.tsx
- RecommendedNextStep.tsx
- DashboardSection.tsx

Keep components modular.

Avoid large monolithic components.

---

# Important constraints

Do NOT implement:

- backend persistence
- API integration
- real-time updates
- complex analytics engines
- heavy chart frameworks
- AI recommendations
- new dependencies unless necessary

Focus on a clear Dashboard v1.

---

# Definition of done

This task is complete when:

- Dashboard page exists
- dashboard integrates active business context
- business overview header exists
- business health summary exists
- business model snapshot exists
- simulation snapshot exists
- launch progress summary exists
- operations summary exists
- priority list exists
- recommended next step exists
- dashboard links to deeper modules
- architecture is modular and scalable

The result should feel like a real business control center inside the Business Operating System.