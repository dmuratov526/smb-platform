# TASK.md

## Current task

Rebuild the Operations page from scratch and implement the first real version of the Operations Workspace.

The current Operations page should be treated as temporary and should be fully replaced.

The application already supports:

- mock user sessions
- multiple users
- business creation
- category-based onboarding
- active business context
- Business Builder
- Business Simulator
- Launch Planner with task creation, editing, deletion, and phase collapsing

Now the next step is to create a real workspace for managing day-to-day business operations.

Before implementing, read:

- AGENTS.md
- documentation in docs/

---

# Goal

Create the first functional version of the Operations Workspace.

This page should help the user manage the ongoing operational side of a business after launch planning.

The Operations page should feel like:

- a business operating center
- a day-to-day execution workspace
- a place to monitor recurring work, operational issues, and process health

It should NOT feel like:

- a generic admin dashboard
- a simple to-do list
- a project management clone
- a leftover placeholder page

The current Operations page should be replaced with a cleaner, more product-like, more structured implementation.

---

# Core product purpose

The Operations Workspace should help a business answer questions such as:

- What needs to happen today or this week to keep the business running?
- Which recurring operational tasks are coming up?
- Which operational areas are healthy and which are at risk?
- What issues or bottlenecks need attention?
- Which processes are currently active or overloaded?

This is not a full ERP or project management system.

This is version 1 of an SMB operations workspace.

---

# Scope

Implement:

- a complete redesign of the Operations page
- operations data structure
- Redux state for operations
- operations overview section
- recurring tasks section
- process groups / operational areas
- issues / bottlenecks section
- integration with the active business
- category-aware default operations content

Use mock data only.

---

# Important reset requirement

The existing Operations page should be cleaned up and rebuilt from scratch.

Requirements:

- remove the current placeholder-style structure
- remove any temporary layout that does not fit the new operations workspace
- design the page around the actual product purpose
- keep reusable pieces only if they clearly fit the new architecture

Do not just patch the existing page.
Do not simply add more cards onto the old version.
Re-approach the page as a real product surface.

---

# Product behavior

The Operations Workspace should represent how a business runs after setup and launch.

It should support operational management across a few core dimensions:

- recurring work
- process visibility
- issue tracking
- operational status
- short-term execution priorities

The page should use the active business and its category as context.

Different business categories may have different operational structures and default tasks.

---

# Main sections

The Operations page should contain at least these sections.

---

## 1. Operations Overview

Top summary area for the active business.

This section should quickly communicate the current operational state.

At minimum include:

- operational health summary
- number of open issues
- number of recurring tasks due soon
- number of completed recurring tasks in the current period
- key focus area or attention-needed area

This section should feel like an execution summary, not a financial dashboard.

---

## 2. Operational Areas / Process Groups

Represent the main areas of ongoing operations.

Examples:

- Sales Operations
- Service Delivery
- Inventory / Supply
- Customer Support
- Team Coordination
- Finance Admin

The exact process groups can vary by category, but the structure should feel relevant to the active business.

Each operational area should include useful lightweight information such as:

- area name
- short purpose
- status or health indicator
- task count or issue count
- optional owner or responsibility label

This should help the user understand where work is happening.

---

## 3. Recurring Tasks

This is one of the most important parts of the page.

Users should be able to manage recurring operational work.

Examples:

- daily opening checklist
- weekly inventory check
- supplier follow-up
- payroll preparation
- customer follow-up review
- equipment inspection
- weekly performance review

Each recurring task should support at least:

- title
- short description
- frequency
- status
- due label or next due label
- related operational area

Support at minimum:

- viewing recurring tasks
- updating task status
- creating recurring tasks
- editing recurring tasks
- deleting recurring tasks

Keep this practical and lightweight.

Do not implement advanced scheduling logic.

---

## 4. Issues / Bottlenecks

The page should support tracking operational problems.

This is not a bug tracker.
It is a business operations issue list.

Each issue should support at least:

- title
- short description
- severity
- status
- related operational area
- optional owner

Examples:

- delayed supplier shipments
- low customer response rate
- insufficient staffing on weekends
- unstable fulfillment turnaround
- too many missed follow-ups

Support:

- viewing issues
- creating issues
- editing issues
- deleting issues
- changing status

Keep the structure simple.

---

## 5. Near-term focus

Include a section that helps the user understand immediate execution priorities.

This can be a lightweight section showing things such as:

- due today
- due this week
- blocked items
- highest-priority issues

This does not need a complex prioritization engine.

Simple derived summaries are enough.

---

# Category awareness

The Operations Workspace should be category-aware.

Different business categories should have different default operational areas and tasks.

Examples:

### Restaurant / Cafe
Operational areas:
- Front of House
- Kitchen
- Inventory
- Staffing
- Supplier Coordination

Recurring tasks:
- opening checklist
- stock check
- supplier order review
- cleaning verification

Issues:
- ingredient shortage
- staffing gaps
- order delays

### SaaS
Operational areas:
- Customer Support
- Product Operations
- Sales Ops
- Marketing Ops
- Finance Admin

Recurring tasks:
- support queue review
- product analytics review
- lead pipeline review
- churn check

Issues:
- trial-to-paid conversion drop
- support backlog
- onboarding friction

### Consulting / Agency
Operational areas:
- Client Delivery
- Sales Pipeline
- Team Scheduling
- Finance Admin

Recurring tasks:
- client check-ins
- proposal follow-up
- invoice tracking
- team capacity review

Issues:
- delayed deliverables
- pipeline slowdown
- overload on key team members

Category adaptation does not need to be deeply complex in v1, but it should clearly exist.

---

# UX expectations

The Operations page must feel intentional and structured.

Preferred UX direction:

- clean top-level summary
- clear separation between recurring work, operations areas, and issues
- easy scanning
- practical editing flows
- no clutter
- no excessive enterprise complexity

The experience should feel like a founder/operator control center.

The page should be significantly better than a placeholder page and should look like a real core module of the product.

---

# Interaction expectations

At minimum, support interactions for:

- creating recurring tasks
- editing recurring tasks
- deleting recurring tasks
- updating recurring task status
- creating issues
- editing issues
- deleting issues
- updating issue status

If useful, support collapsing sections or grouping, but only if it improves clarity.

Do not add unnecessary interaction complexity.

---

# State management

Add Redux state for operations.

The state should support:

- operations data per business
- operational areas
- recurring tasks
- issues
- derived summary values
- active business integration

Keep it practical.

Avoid building a full workflow engine.

---

# Suggested architecture

Suggested structure:

src/features/

operations/
- OperationsPage.tsx
- slice.ts
- types.ts
- selectors.ts
- utils.ts
- mock.ts

components/
- OperationsOverview.tsx
- OperationalAreaCard.tsx
- RecurringTasksSection.tsx
- RecurringTaskCard.tsx
- IssuesSection.tsx
- IssueCard.tsx
- FocusSummary.tsx

Keep logic separate from presentation where possible.

Avoid one large page component doing everything.

---

# Design direction

The page should be visually calmer and more operational than the Dashboard.

It should feel like:

- structured
- practical
- execution-focused
- readable
- modular

Avoid:

- overly flashy UI
- too many small meaningless widgets
- excessive charts
- generic KPI spam

Prioritize clarity and usefulness.

---

# Important constraints

Do NOT implement:

- backend persistence
- APIs
- authentication
- notifications
- calendars
- advanced automation rules
- drag and drop workflow builders
- dependency engines
- team permissions
- enterprise ERP complexity
- unnecessary libraries

Focus on a strong Operations Workspace v1.

---

# Definition of done

This task is complete when:

- the existing Operations page has been replaced with a new implementation
- the new page feels like a real operations workspace
- operations overview exists
- operational areas are shown
- recurring tasks are manageable
- issues / bottlenecks are manageable
- the page is connected to the active business
- category-aware default operations content exists
- architecture is modular and scalable

The result should feel like the first real operational control center inside the Business Operating System.