# TASK.md

## Task
Redesign the product direction so that the app no longer feels like a generic business management dashboard.

The new primary goal is to make the experience feel like an **AI-powered business operating system**, where the **main screen becomes the central AI entry point** for the whole product.

This is not a small visual tweak.  
This is a **product and UX restructuring task**.

---

## Core Product Direction

The app should stop feeling like:
- a collection of separate business admin pages
- a traditional SaaS dashboard with many modules
- a generic ERP / CRM / management tool

The app should start feeling like:
- an **AI Business Command Center**
- an **AI-first workspace for business thinking and execution**
- a system where the user starts from **intent**, not from navigation tabs

### Important principle
Do **not** make this a simple chat screen.

The goal is **not**:
- “put a chatbot on top of the dashboard”

The goal is:
- build a **structured AI-first home experience**
- make AI the **main orchestration layer**
- let AI route users into Builder / Simulator / Planner / Finance / Operations

---

## Main Objective

Create a **new Home / Main screen** that becomes the true center of the product.

This screen should:
1. make the product feel modern and differentiated
2. make AI the first interaction point
3. reduce the feeling of “too many modules”
4. reduce excessive vertical scrolling
5. provide a compact, high-value overview of the business
6. connect users naturally to the rest of the product

---

## Main Concept

### New Home Screen = AI Business Command Center

The main screen should include:

#### 1. AI Hero Input
A large, visually strong central input area where the user can type natural requests such as:
- Describe my business idea
- Help me launch my business
- Simulate hiring a new employee
- Build a pricing strategy
- Show key risks in my business
- Help me improve margins

This should feel like the main interaction point of the entire app.

#### 2. Suggested Prompt Actions
Show several compact prompt chips / quick actions under the input.

Examples:
- Build my business model
- Test a pricing scenario
- Create a launch plan
- Identify operational bottlenecks
- Analyze my cost structure

These should look polished, clickable, and compact.

#### 3. Business Health / Snapshot Area
A high-level compact overview of the active business:
- business health score
- readiness level
- top risks
- next recommended actions
- short business summary

This should be concise and scannable.

#### 4. AI-Generated Insight Cards
Below the hero area, show structured cards that feel actionable, such as:
- Key Risks
- Recommended Actions
- Financial Snapshot
- Launch Readiness
- Operational Bottlenecks
- Growth Opportunities

These should not look like random dashboard widgets.
They should feel like AI-generated business intelligence blocks.

#### 5. Quick Access to Core Workspaces
Keep access to major modules, but reposition them as workspaces launched from the AI-centered experience:
- Business Builder
- Simulator
- Launch Planner
- Finance
- Operations

These should be secondary to the AI layer, not the main identity of the product.

---

## UX / Layout Requirements

### Critical UX Goal
The current product has too much vertical stretch in many places.
The redesign must reduce unnecessary scrolling and make screens feel denser, cleaner, and more modern.

### Required UX principles
- prioritize compactness
- avoid long stacked sections
- prefer grid-based layouts on desktop
- use cards intelligently
- use progressive disclosure
- use tabs / segmented controls / collapsible sections where helpful
- make important information visible above the fold
- reduce oversized spacing where it hurts usability
- create strong visual hierarchy

### The UI should feel:
- modern
- premium
- clean
- structured
- compact
- AI-native
- useful, not decorative

---

## Important Design Direction

### The product should no longer feel like:
“dashboard with many pages”

### It should feel more like:
“AI interface with business workspaces around it”

This is a major conceptual shift.

---

## Scope of Work

### Phase 1 — Main Screen Redesign
Create or fully redesign the Home screen into the AI Business Command Center.

This is the highest priority.

### Phase 2 — Improve module entry experience
Make sure the main screen connects naturally to:
- Builder
- Simulator
- Launch Planner
- Finance
- Operations

These modules should feel like deeper workspaces opened from the command center.

### Phase 3 — Reduce layout bloat across product
Audit the current layouts and reduce unnecessary vertical scrolling where possible.

Focus especially on:
- Business Builder
- Launch Planner
- Finance

These should feel cleaner, more compact, and more usable.

---

## Functional Expectations

The new AI-first screen does not need full backend AI implementation if that is not yet available.

However, the UI must be built in a way that clearly supports future AI-driven workflows.

You may use:
- mock AI responses
- placeholder structured insight cards
- simulated prompt interactions
- dummy generated business outputs

But the experience should feel realistic and product-ready.

---

## Do Not

- do not create a generic chatbot page
- do not create a plain empty dashboard with a chat box added
- do not overload the screen with too many widgets
- do not make sections unnecessarily tall
- do not keep the old dashboard logic if it conflicts with this new direction
- do not treat modules as equally primary on the main screen
- do not design this like a standard admin panel template

---

## Product Intent to Preserve

The product still includes these core ideas:
- Business Builder
- Business Simulator
- Launch Planner
- Finance
- Operations

But the presentation must evolve.

The app should now communicate:
- business understanding
- AI guidance
- action-oriented intelligence
- strategic and operational clarity

---

## Expected Output

Implement a polished AI-first main experience that:
- looks materially better than the current version
- feels more differentiated from generic business software
- reduces scroll-heavy layouts
- creates a stronger product identity
- makes the whole app feel more like an intelligent operating system

---

## Technical Context

Existing stack:
- React
- TypeScript
- Redux Toolkit
- Material UI
- Vite

Work inside the existing project.
Do not create a separate project.

Before implementation:
1. Read `AGENTS.md`
2. Read this `TASK.md`
3. Review `docs/`
4. Review `context_project/` for additional frontend and business context

Use the existing architecture and patterns where appropriate, but do not be afraid to rethink the Home screen and surrounding UX structure if needed.

---

## Priority Order

1. AI-first Home / Main screen
2. Strong compact layout and reduced vertical scroll
3. Better UX for Builder / Launch Planner / Finance
4. Better overall product coherence
5. Preserve existing architecture where practical

---

## Final Note

This task is not just about “making the UI prettier”.

It is about shifting the product from:
**generic business management tool**

to:
**AI-powered business operating system**

The redesign should reflect that clearly.