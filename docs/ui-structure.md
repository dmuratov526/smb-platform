# UI Structure

## General UI Philosophy

The interface should feel like a structured business workspace.

The product is centered around **building and testing businesses**, not just monitoring them.

Because of this, two modules represent the core identity of the product:

1. Business Builder
2. Business Simulator

The Dashboard is important but secondary.

Users should first structure and test a business before relying on dashboards and monitoring tools.

---

# Main Layout

The application layout consists of three persistent layers:

1. Left Sidebar Navigation
2. Top Navigation Bar
3. Central Workspace

This layout should remain consistent across the entire application.

The central workspace is where all pages and modules render their content.

---

# Sidebar Navigation

The left sidebar is the primary navigation structure of the product.

Navigation order reflects the logical lifecycle of a business.

Sidebar modules:

1. Business Builder
2. Business Simulator
3. Launch Planner
4. Dashboard
5. Businesses
6. Finance
7. Operations
8. Marketing
9. Team
10. Analytics
11. AI Assistant
12. Settings

Business Builder and Business Simulator should be visually emphasized because they represent the core value of the product.

---

# Top Navigation Bar

The top bar provides global context and quick actions.

It should contain:

- active business selector
- global search
- notifications
- user profile menu

Depending on the page, the top bar may also include contextual actions.

Examples:

Business Builder:
- save configuration
- duplicate configuration

Business Simulator:
- run scenario
- compare scenarios
- save scenario

Finance:
- add transaction
- export summary

The top bar should remain lightweight and avoid unnecessary clutter.

---

# Workspace Structure

Each page should follow a consistent internal layout.

Typical page structure:

1. Page header
2. Controls or filters
3. Main content area

The page header should include:

- page title
- short description
- main page actions

The controls section may include:

- filters
- tabs
- selectors
- scenario parameters
- configuration controls

The main content area should contain:

- forms
- cards
- tables
- charts
- timelines
- builder interfaces
- simulation panels

---



# Core Pages

## Business Builder

Business Builder is the primary creation environment of the platform.

This page allows users to structure a business.

Key sections may include:

- business profile
- industry template selection
- financial assumptions
- revenue streams
- cost categories
- staffing structure
- marketing channels
- operational structure

The page should feel like a **guided business design workspace**, not a simple form.

AI assistance should help users structure the business model.

---

## Business Simulator

Business Simulator allows users to test business assumptions.

This page should feel analytical and interactive.

Typical layout:

Left side:
- adjustable parameters
- scenario inputs

Right side:
- simulation outputs
- metrics
- charts
- break-even analysis
- cost composition
- scenario comparison

The page should provide immediate feedback when parameters change.

---

## Business Builder expectations

Business Builder should feel like a guided business design environment, not a plain form.

It should support areas such as:
- business profile
- industry template selection
- location
- budget
- revenue streams
- cost categories
- staffing structure
- marketing channels
- operational structure
- AI guidance

It should help users structure a business idea progressively.

---

## Business Simulator expectations

Business Simulator is one of the core product surfaces.

It should support:
- editing assumptions
- scenario-based changes
- dynamic result summaries
- revenue and cost projections
- profit and margin views
- break-even logic
- scenario comparison

The simulator should feel analytical, interactive, and decision-oriented.

---

## Launch Planner expectations

Launch Planner should convert business structure into execution.

It should support:
- tasks
- milestones
- dependencies
- timelines
- launch readiness visibility

It should feel like a business launch workspace, not a generic task app.

---

## Dashboard expectations

Dashboard is important but secondary.

It should summarize:
- revenue
- expenses
- profit
- cash visibility
- operational alerts
- marketing performance
- pending tasks
- business health

Dashboard should not dominate the product identity.

---

## AI Assistant expectations

AI Assistant should exist as:
- a dedicated page
- a contextual assistant across the interface

Its role is to help users:
- interpret simulation outputs
- structure business setup
- understand launch steps
- receive diagnostics and recommendations
- think through operational logic
- plan physical space and workflow zones when relevant

AI should remain advisory.
It should not silently replace deterministic business logic.

---

## Launch Planner

Launch Planner converts a validated business model into a launch roadmap.

It should display:

- tasks
- dependencies
- milestones
- deadlines
- preparation priorities

The interface should resemble a structured project plan.

---

## Dashboard

The dashboard summarizes the current state of the business.

It may include:

- financial summaries
- alerts
- operational indicators
- marketing performance
- pending tasks

The dashboard is useful for monitoring but should not dominate the product identity.

---

## Businesses

This section allows users to manage multiple businesses.

Users should be able to:

- create businesses
- switch active businesses
- duplicate business configurations
- archive businesses

---

## Finance

The finance module manages financial data.

Typical views:

- transaction tables
- expense categories
- revenue summaries
- financial charts
- budget overview

---

## Operations

Operations represents internal business processes.

Examples:

- inventory tracking
- supplier relationships
- workflow stages
- operational checklists

The exact structure may vary depending on the industry template.

---

## Marketing

Marketing tracks customer acquisition and campaign performance.

Typical data:

- campaign spending
- marketing channels
- performance metrics
- customer acquisition cost
- conversion indicators

---

## Team

The team module manages people and responsibilities.

It may include:

- employee records
- roles
- assigned tasks
- team responsibilities

---

## Analytics

Analytics provides deeper analysis of business performance.

It may include:

- performance trends
- operational efficiency
- financial indicators
- marketing effectiveness

This page should feel like a decision support environment.

---

## AI Assistant

The AI assistant should exist both as a page and as a contextual helper.

It should help users:

- interpret simulation results
- configure business structures
- understand analytics
- receive recommendations

On desktop it may appear as a side drawer.

---

# Design System

The UI should be built on **Material UI**.

The design should emphasize:

- clarity
- structure
- readability
- information density

Avoid overly decorative UI.

The product should feel like a serious operational workspace.

---

# Responsiveness

The application should follow a **desktop-first responsive strategy**.

Desktop is the primary environment.

Tablet and mobile act as companion experiences.

Mobile should prioritize:

- monitoring
- alerts
- quick actions
- summary views

Heavy configuration workflows such as Business Builder and Simulation remain primarily desktop-oriented.