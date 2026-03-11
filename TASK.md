# TASK.md

## Current task

Implement the next major UX and product refinement milestone for the Business Operating System frontend prototype.

Before implementing, read:

- AGENTS.md
- documentation in docs/

Assume the application already supports:

- application layout
- module pages
- mock user sessions
- user switching
- business creation
- category-based onboarding
- active business context
- Business Builder
- Business Simulator
- Launch Planner
- Operations Workspace
- Dashboard

This task is not about rebuilding the whole application.

This task focuses on improving the product quality, usability, information density, and visual structure of key core modules.

---

# Goal

Refine the product so it feels more like a modern business operating system and less like an early prototype.

The main goals are:

- redesign Business Builder for a better and more polished workspace experience
- improve Launch Planner so it feels cleaner, tighter, and more usable
- turn Finance into a more meaningful and structured product surface
- reduce excessive vertical stretching across pages
- improve layout efficiency, scanning, and navigation
- make the UI feel more modern, compact, and product-like

The application should feel more mature, more intentional, and better suited for real desktop use.

---

# Main product direction

The product should feel like:

- a business design workspace
- a structured founder operating system
- a simulation and execution environment
- a modern SaaS product built for decision-making

It should NOT feel like:

- a generic admin dashboard
- a collection of long stacked cards
- a prototype made of vertically stretched sections
- a loose set of pages without strong layout discipline

A major focus of this task is improving page structure so users do not need to scroll excessively for basic work.

---

# Scope

Implement a UX and layout refinement pass for the following modules:

- Business Builder
- Launch Planner
- Finance

Also improve shared layout patterns where necessary to support a more compact and modern product experience.

Use mock data only.

Do not add backend, APIs, authentication, or persistence.

---

# Primary design objective

Reduce unnecessary vertical scrolling.

The current product likely contains too many long stacked sections and cards that push important information too far down.

The new UX should aim for:

- more compact page composition
- better use of horizontal space on desktop
- clearer grouping of related information
- tabs, side panels, accordions, segmented views, or split layouts where useful
- improved scanability
- fewer oversized blocks
- less repetitive spacing
- more intentional information hierarchy

Do not compress the UI so much that it becomes cluttered.

The goal is compact and modern, not cramped.

---

# 1. Business Builder redesign

Business Builder is one of the most important modules and should feel like a premium core workspace.

The current Business Builder should be redesigned for better usability and visual quality.

## Goals for Business Builder

- improve the layout and visual structure
- reduce long vertical scrolling
- make editing the business model feel smoother and more structured
- improve section navigation
- make the builder feel like a real business design workspace

## Required direction

The page should no longer be just a long vertical list of large sections.

Rework it into a more structured layout.

Possible design directions include:

- left-side section navigation with main editing workspace
- tabbed or segmented section switching
- two-column desktop layout
- summary panel + active editing panel
- progressive disclosure for secondary details
- compact section cards with inline editing
- sticky section navigation if useful

The exact solution is flexible, but the result should clearly reduce excessive page length.

## Builder content

The builder still revolves around:

- Offer
- Customer
- Revenue Model
- Acquisition
- Operations
- Financial Snapshot

But the UX should feel more organized and efficient.

## Expected outcome

The user should be able to move between business model sections quickly without scrolling through a very long page.

The page should feel more like a structured builder workspace than a stacked form page.

---

# 2. Launch Planner refinement

Launch Planner already exists, but it should be improved in usability and layout quality.

## Goals for Launch Planner

- improve visual hierarchy
- improve launch progress readability
- reduce page length and repetitive stacking
- make phases and tasks easier to scan and manage
- make the module feel more polished and product-like

## Required direction

Rework the page so the user can understand launch status faster.

Possible improvements include:

- compact phase summaries
- collapsible phase groups
- better task grouping
- side-by-side readiness and tasks layout on desktop
- denser task cards or rows
- clearer separation between summary and execution views
- improved filtering or task views if useful

The goal is not to add project-management complexity.

The goal is to make the current Launch Planner cleaner, tighter, and easier to use.

## Expected outcome

The page should feel like a founder launch workspace with strong structure and less wasted vertical space.

---

# 3. Finance module refinement

Finance should be upgraded from a weaker or placeholder-like module into a more real and useful business surface.

## Goals for Finance

- make Finance feel like a real product module
- improve structure and visual clarity
- reduce excessive scrolling
- introduce a better overview of financial information
- create a stronger connection between projected and operating finance

## Required direction

Finance should support a more structured layout such as:

- top financial summary
- compact KPI or metric row
- transaction or category area
- breakdown views
- simple financial organization panels
- better grouping of data instead of long stacked cards

Possible useful sections:

- revenue summary
- expense summary
- monthly result / net result
- category breakdown
- recent transactions or mock records
- budget / cost structure summary
- financial health snapshot

This does not need to become a full accounting tool.

But it should feel like a meaningful operating module.

## Expected outcome

Finance should look and feel like an important business control surface rather than a placeholder page.

---

# 4. Shared UX and layout improvements

This task is also a product-wide refinement pass for layout behavior and page composition patterns.

Where appropriate, improve shared patterns used across the refined pages.

## Focus areas

- reduce oversized paddings and empty space where they hurt usability
- improve page headers
- improve section spacing
- improve card sizing and density
- improve desktop information layout
- use grids more effectively
- improve consistency across modules
- reduce repetitive full-width stacked blocks
- improve action placement
- improve scanability of important information

You may introduce reusable layout primitives if helpful.

Examples:
- section shell
- compact metric row
- sticky sub-navigation
- split workspace layout
- side summary panel
- dense list row component

Keep this practical and not overengineered.

---

# 5. Responsive behavior

The product is desktop-first, but pages must still work well responsively.

The main UX improvement should target desktop efficiency.

Requirements:

- better use of horizontal space on desktop
- clean fallback behavior on tablet
- acceptable stacked behavior on smaller screens
- no broken or overcrowded mobile layouts

Do not design only for mobile.
Do not keep everything single-column on desktop if that creates unnecessary page length.

---

# UX expectations

The refined modules should feel:

- modern
- cleaner
- denser in a good way
- easier to scan
- more structured
- more intentional
- closer to a real SaaS product

Avoid:

- giant cards stacked forever
- oversized empty spacing
- excessively stretched forms
- purely decorative redesigns without UX improvement
- unnecessary visual complexity
- too many nested containers
- overuse of tabs if they reduce clarity

Use good product judgment.

---

# Technical expectations

Use the required stack:

- React
- TypeScript
- Redux Toolkit
- Material UI
- Vite

Follow AGENTS.md.

Use clean modular architecture.

Prefer:

- reusable layout components where appropriate
- feature-level organization
- small composable UI components
- selectors for derived state
- minimal logic inside page containers

Avoid:

- one giant page component
- massive duplicated markup
- hardcoded layout hacks
- unnecessary dependencies
- overengineering a design system from scratch

---

# Suggested implementation direction

This is guidance, not a rigid prescription.

Possible directions:

- redesign Business Builder around section navigation + focused editing area
- restructure Launch Planner into summary + grouped execution workspace
- rebuild Finance page into summary + records + breakdown structure
- create shared UI pieces for:
  - page section shell
  - compact metric cards
  - structured panel headers
  - dense list/table-like rows
  - workspace split layouts

You may refactor existing module-level components where needed.

Do not rewrite unrelated modules.

---

# Out of scope

Do NOT implement:

- backend persistence
- APIs
- authentication
- real accounting logic
- advanced financial engine
- external integrations
- charts-heavy analytics overhaul across the whole app
- new design libraries
- complete rebrand of the application

This task is about product UX refinement and module quality improvement.

---

# Definition of done

This task is complete when:

- Business Builder has been redesigned into a more modern and efficient workspace
- Business Builder requires less excessive scrolling
- Launch Planner is cleaner, tighter, and easier to scan
- Finance feels like a real structured module
- all three modules use space more effectively on desktop
- vertical stretching is reduced significantly
- the UI feels more modern and product-like
- architecture remains modular and scalable

The result should feel like a substantial product-quality upgrade for the Business Operating System frontend.