# TASK.md

## Current task

Implement the first functional version of the Business Simulator.

The application already supports:

- mock user sessions
- multiple users
- business creation
- category-based onboarding
- active business context
- Business Builder with editable business model sections

Now the next step is to let users simulate how the business may perform based on key assumptions.

Before implementing, read:

- AGENTS.md
- documentation in docs/

---

# Goal

Create the first working version of the Business Simulator.

The Business Simulator should allow users to:

- adjust core business assumptions
- instantly see calculated outcome metrics
- compare simple business scenarios
- understand how changes affect revenue, costs, and profit

This should feel like a business simulation workspace, not a spreadsheet clone.

The simulator should use the active business and its existing Business Builder data as the starting point.

---

# Scope

Implement:

- simulator data structure
- Redux state for simulation inputs and scenarios
- Business Simulator page
- editable assumptions panel
- calculated output cards
- simple scenario switching or comparison
- integration with the active business and business model

Use mock data only.

---

# Product behavior

The simulator should take a business model and let the user test assumptions such as:

- price
- sales volume
- conversion rate
- customer acquisition cost
- fixed monthly costs
- variable cost level
- team cost / operating cost
- retention or repeat purchase assumptions where relevant

The simulator should calculate simplified business outputs.

Do not implement advanced financial modeling yet.

This is version 1.

---

# Core simulator concept

The simulator should support a simple input → calculation → output flow.

Example logic:

inputs
- average order value or subscription price
- number of customers or monthly sales
- conversion rate
- CAC
- fixed costs
- variable costs
- team/operating costs

outputs
- projected monthly revenue
- projected monthly costs
- gross profit
- operating profit
- break-even estimate
- simple margin estimate

Calculations can remain simplified and transparent.

---

# Simulator sections

The Business Simulator page should contain at least these sections.

---

## 1. Scenario selector

Allow the user to work with scenarios.

At minimum support:

- Base Case
- Best Case
- Worst Case

The user should be able to switch between them.

Optional:
- allow duplicating a scenario later
- but this is not required for v1

---

## 2. Assumptions panel

This is where the user edits simulation inputs.

Possible assumption groups:

### Revenue assumptions
- pricing
- sales volume
- number of customers
- repeat purchases
- utilization or capacity rate if relevant

### Acquisition assumptions
- traffic or lead volume
- conversion rate
- CAC
- lead-to-sale assumptions

### Cost assumptions
- fixed monthly costs
- variable cost percentage or amount
- payroll / team cost
- marketing spend
- other operating costs

Keep the assumptions practical and limited.

---

## 3. Results / output panel

Display calculated business outcomes.

At minimum include:

- monthly revenue
- monthly costs
- gross profit
- operating profit
- break-even point
- margin

These should be shown clearly using cards or a structured summary layout.

---

## 4. Sensitivity / impact cues

The simulator should help users understand what changed.

At minimum:

- when assumptions change, outputs update immediately
- clearly show whether a result improved or worsened relative to the base case or current saved scenario

Do not overbuild analytics yet.

Simple visual cues are enough.

---

# Calculation model

Keep calculations simple and deterministic.

You may implement a simplified formula structure such as:

Revenue:
- price × number of sales
or
- customers × average revenue per customer

Gross Profit:
- revenue - variable costs

Operating Profit:
- gross profit - fixed costs - payroll - marketing - other operating costs

Break-even:
- estimated based on fixed costs and contribution margin

Margin:
- operating profit / revenue

Exact structure may vary, but the formulas should remain understandable and easy to maintain.

No advanced finance engine is needed.

---

# Integration with Business Builder

The simulator should be seeded from the business model where possible.

Examples:

- pricing defaults from Revenue Model
- expected sales defaults from Revenue Model
- acquisition defaults from Acquisition section
- cost structure hints from Operations / Financial Snapshot

If some fields are missing, use reasonable mock defaults.

The architecture should support tighter Builder → Simulator integration later.

---

# UX expectations

The Business Simulator should feel like an interactive decision tool.

It should not look like:

- a raw spreadsheet
- a finance admin page
- a generic dashboard

It should feel like:

- a scenario lab
- a founder planning workspace
- a business assumptions simulator

Preferred layout:

- top area with scenario selector and summary
- left or upper assumptions area
- right or lower results area

Keep the interface clear, structured, and product-like.

---

# Scenario behavior

For v1, support at least 3 predefined scenarios:

- Base Case
- Best Case
- Worst Case

Each scenario should store its own assumptions.

The user should be able to:

- switch between scenarios
- edit assumptions inside a scenario
- see recalculated outputs for that scenario

You may keep this entirely in Redux state.

No persistence is required beyond frontend state.

---

# State management

Add state for simulation.

Responsibilities may include:

- active scenario
- scenario assumptions
- calculated outputs
- relation to active business

Keep this practical.

Avoid overengineering a generic simulation engine.

---

# Suggested architecture

Suggested structure:

src/features/

businessSimulator/
- BusinessSimulatorPage.tsx
- slice.ts
- types.ts
- selectors.ts
- calculations.ts

components/
- ScenarioSelector.tsx
- AssumptionsPanel.tsx
- ResultsPanel.tsx
- MetricCard.tsx

Keep calculation logic separate from UI.

Keep UI modular.

Avoid large monolithic components.

---

# Important constraints

Do NOT implement:

- backend persistence
- API integration
- authentication
- advanced forecasting
- time-series modeling
- Monte Carlo simulation
- AI recommendations
- charts-heavy analytics frameworks
- unnecessary libraries

Focus on a clear v1 simulator.

---

# Definition of done

This task is complete when:

- Business Simulator page exists
- the simulator is connected to the active business
- there are editable assumptions
- outputs are calculated from those assumptions
- at least 3 scenarios exist
- switching scenarios works
- results update correctly
- architecture is modular and scalable

The result should feel like the first real simulation workspace inside the Business Operating System.