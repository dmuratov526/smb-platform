# TASK.md

## Current task

Implement the first functional version of the Launch Planner.

The application already supports:

- mock user sessions
- multiple users
- business creation
- category-based onboarding
- active business context
- Business Builder
- Business Simulator

Now the next step is to help users turn a business concept into an executable launch plan.

Before implementing, read:

- AGENTS.md
- documentation in docs/

---

# Goal

Create the first working version of the Launch Planner.

The Launch Planner should help users organize the steps required to launch a business.

Users should be able to:

- view a launch plan
- track launch readiness
- manage launch tasks and milestones
- see progress across major launch areas

This should feel like a launch preparation workspace, not a generic to-do list.

The Launch Planner should use the active business and its existing business category and business model as the starting point.

---

# Scope

Implement:

- launch planner data structure
- Redux state for launch planning
- Launch Planner page
- launch phases or milestone groups
- launch task list with statuses
- readiness summary
- integration with the active business

Use mock data only.

---

# Product behavior

The Launch Planner should help users prepare for launch across several business areas.

The planner should support practical launch planning, such as:

- business setup
- legal and administrative readiness
- product or service readiness
- operations readiness
- marketing readiness
- launch execution readiness

The exact task content may vary by business category.

Do not implement project management complexity yet.

This is version 1.

---

# Core planner concept

The Launch Planner should organize launch preparation into structured areas.

Suggested model:

- phases or milestone groups
- tasks inside each phase
- status per task
- readiness summary based on task completion

At minimum, task statuses should support:

- not started
- in progress
- completed

Optional:
- blocked

This is not required if it complicates v1 too much.

---

# Planner sections

The Launch Planner page should contain at least these sections.

---

## 1. Launch readiness summary

A top-level summary of progress.

At minimum include:

- overall readiness percentage
- number of completed tasks
- number of remaining tasks
- current phase or nearest milestone
- category or business type reference

This should help the user quickly understand launch status.

---

## 2. Milestone groups or phases

Group launch work into a small number of structured phases.

Suggested phases:

- Foundation
- Offer & Setup
- Operations Readiness
- Marketing Readiness
- Launch Execution

You may rename these if needed, but the structure should feel practical and product-like.

Each phase should contain a set of tasks.

---

## 3. Task management view

Users should be able to view and update launch tasks.

Each task should support at least:

- title
- short description
- status
- optional owner
- optional due timing label
- related phase

Users should be able to change task status in the UI.

At minimum, support updating status only.

No need for deep project management logic.

---

## 4. Milestone or timeline cues

The planner should show progression toward launch.

At minimum:

- show phases in order
- show progress per phase
- make it clear what is upcoming vs complete

This does not need to be a full calendar or Gantt chart.

Simple timeline or milestone cues are enough.

---

# Category awareness

The Launch Planner should be aware of business category.

Different business categories should have different default launch tasks.

Examples:

### Restaurant / Cafe
- finalize menu
- source suppliers
- configure POS
- hire staff
- prepare opening promotion

### SaaS
- finalize MVP scope
- complete onboarding flow
- prepare pricing page
- set up support workflow
- launch acquisition campaign

### Consulting / Agency
- define service packages
- prepare proposal templates
- create lead pipeline
- set up invoicing
- prepare website or portfolio

### Retail Store
- source inventory
- prepare store layout
- set up payments
- launch local promotion
- train staff

Category variation does not need to be extremely deep in v1, but the system should clearly feel category-aware.

---

# Readiness logic

The Launch Planner should calculate simple readiness indicators.

Examples:

- overall completion percentage
- phase completion percentage
- completed vs remaining tasks

This logic can remain simple:

completed tasks / total tasks

You may also surface a simple “launch confidence” summary if useful, but this is optional.

---

# Integration with existing product areas

The Launch Planner should connect conceptually to earlier product surfaces.

Examples:

- business category informs default tasks
- builder data may inform launch priorities
- simulator insights may later inform launch timing

For this version, integration can remain light.

The important thing is that the planner feels connected to the active business rather than standalone.

---

# UX expectations

The Launch Planner should feel like a structured launch workspace.

It should not feel like:

- a plain checklist app
- a generic task board
- an enterprise PM tool

It should feel like:

- a founder launch roadmap
- a business readiness planner
- an execution preparation workspace

Preferred layout:

- top summary / readiness section
- milestone or phase overview
- task list grouped by phase
- ability to update task status easily

Keep the interface structured and product-like.

---

# State management

Add state for launch planning.

Responsibilities may include:

- launch plan per business
- phases
- tasks
- readiness summary
- active business relationship

Keep this practical.

Avoid overengineering a full task platform.

---

# Suggested architecture

Suggested structure:

src/features/

launchPlanner/
- LaunchPlannerPage.tsx
- slice.ts
- types.ts
- selectors.ts
- utils.ts

components/
- ReadinessSummary.tsx
- PhaseProgress.tsx
- LaunchTaskList.tsx
- LaunchTaskCard.tsx

Keep logic modular.

Keep UI separate from state logic where possible.

Avoid large monolithic components.

---

# Important constraints

Do NOT implement:

- backend persistence
- API integration
- authentication
- calendars
- notifications
- drag and drop boards
- team collaboration logic
- dependencies engine
- full project management features
- unnecessary libraries

Focus on a clear v1 Launch Planner.

---

# Definition of done

This task is complete when:

- Launch Planner page exists
- planner is connected to the active business
- launch phases or milestone groups exist
- tasks are shown and grouped clearly
- task statuses can be updated
- readiness summary is calculated and displayed
- category-aware default tasks exist
- architecture is modular and scalable

The result should feel like the first real launch execution workspace inside the Business Operating System.