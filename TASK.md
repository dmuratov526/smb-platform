# TASK.md

## Current task

Create the initial frontend foundation for the Business Operating System prototype.

Before implementing, read:

- AGENTS.md
- the documentation in the docs directory

Use those documents to understand the product, UX expectations, and technical constraints.

---

# Goal

Build the first working version of the application's interface.

This stage should establish:

- the main application layout
- navigation structure
- placeholder pages for core modules
- mock business context

The goal is to create a clean and scalable starting point for future development.

Do not overbuild features yet.

---

# Scope

Implement the basic user interface structure of the application.

## Application layout

Create the main layout of the product.

The interface should include:

- left sidebar navigation
- top navigation bar
- central workspace where pages are displayed

The layout should work well on desktop screens.

---

## Navigation

The sidebar should contain the main product modules in this order:

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

Business Builder and Business Simulator should be visually prioritized.

---

## Top bar

The top bar should include placeholders for:

- active business selector
- search
- notifications
- user/profile area

Functionality can remain minimal for now.

---

## Pages

Create placeholder pages for the main modules.

Each placeholder page should include:

- page title
- short description
- simple layout content

Pages should not be empty.

---

## Mock data

Use mock data only.

Provide mock data for:

- active business
- business switcher
- simple dashboard summaries

Mock data should represent realistic small business scenarios.

---

# UX expectations

The interface should clearly communicate that this product is:

- a business design platform
- a simulation platform
- a launch and operations workspace

The UI should not feel like a generic admin dashboard.

Business Builder and Business Simulator should appear as the core product surfaces.

---

# Technical requirements

Use the required stack:

- React
- TypeScript
- Redux Toolkit
- Material UI

Follow the rules defined in AGENTS.md.

Use modern patterns and good engineering practices.

---

# Important constraints

Do NOT implement:

- backend integration
- authentication
- real APIs
- external integrations
- complex business logic
- unnecessary libraries

Focus only on the frontend foundation.

---

# Definition of done

This task is complete when:

- the main application layout exists
- sidebar navigation works
- top bar exists
- placeholder pages exist for the modules
- mock business context is available

The result should resemble the foundation of a real SaaS application rather than a temporary prototype.