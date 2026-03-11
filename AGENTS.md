# AGENTS.md

## Project Context

This project is building an **AI-powered Business Operating System**.

The goal is NOT to build another:
- ERP
- CRM
- admin dashboard
- project management tool

The goal is to build a system that helps users **understand, design, and run a business** with the help of AI.

This product should feel closer to:
- a **business command center**
- a **thinking system for entrepreneurs**
- an **AI-assisted decision environment**

rather than a traditional SaaS dashboard.

---

# Product Philosophy

Most business software today focuses on:

- task tracking
- data storage
- workflow management

Examples include tools like:
- Notion
- Airtable
- ClickUp
- Monday
- Asana

These tools help users **organize work**.

This product should help users **understand and operate their business**.

That means the product must prioritize:

- clarity
- decision support
- strategic insight
- operational guidance

---

# AI-First Product Principle

AI is not a feature.

AI is the **primary interface layer**.

Users should interact with the system primarily through **intent**, not through complex navigation.

Example user intent:

- “Help me launch my business”
- “Show risks in my pricing model”
- “Simulate hiring a new employee”
- “Improve my margins”
- “Build a launch plan”

The system interprets intent and routes the user to the correct workspace or generates structured insights.

---

# Main Screen Philosophy

The **Home screen is the brain of the product**.

It should feel like a **Business Command Center**.

The home screen should:

1. allow users to interact with AI immediately
2. show high-value business insights
3. highlight risks and priorities
4. recommend next actions
5. connect to deeper workspaces

The home screen should **not feel like a generic SaaS dashboard**.

---

# Avoid Generic Dashboard Design

Avoid patterns like:

- large vertical stacks of widgets
- endless scrolling dashboards
- admin panel layouts
- overly spaced sections
- redundant cards
- data-heavy tables with no context

These patterns make the product feel like generic business software.

---

# Design Philosophy

The interface should feel:

- modern
- compact
- intelligent
- structured
- purposeful

The UI should prioritize **information density with clarity**.

Good patterns include:

- card-based grids
- compact insight blocks
- progressive disclosure
- collapsible sections
- contextual actions
- side panels
- tabs for deeper detail

---

# AI Interaction Model

The AI interface should produce **structured outputs**, not just chat messages.

Instead of:

Chat-only responses like:

> Here are some risks in your business.

Prefer structured responses such as:

Risk Analysis  
• high rent cost  
• weak differentiation  

Financial Snapshot  
• break-even: 8 months  
• expected margin: 18%

Recommended Actions  
1. adjust pricing  
2. reduce fixed costs  
3. validate demand

These outputs should appear as **interactive cards or insight blocks**.

---

# Product Architecture

The application includes the following workspaces:

- Business Builder
- Simulator
- Launch Planner
- Finance
- Operations
- Marketing
- Team

However:

These modules are **workspaces**, not the core identity of the product.

The **AI layer orchestrates these workspaces**.

Example:

User request → AI interprets → opens Builder or Simulator with context.

---

# UX Principles

## Reduce Vertical Scroll

Many traditional dashboards create very long pages.

Avoid this.

Prefer:

- grids
- compact layouts
- panels
- tabs
- collapsible blocks
- grouped information

The user should quickly understand the state of their business **without excessive scrolling**.

---

## Show Insights, Not Raw Data

The UI should prioritize:

- interpretation
- recommendations
- risks
- opportunities

over raw metrics and raw tables.

Data should always support **a decision or action**.

---

# Implementation Principles

- follow the existing project architecture
- keep code modular
- avoid unnecessary complexity
- reuse components when possible
- ensure layouts work well on desktop and tablet

Mobile support is welcome but desktop should be the primary experience for now.

---

# Visual Direction

The product should feel:

- premium
- clean
- focused
- professional
- intelligent

Avoid:

- clutter
- noisy dashboards
- overly decorative UI
- unnecessary animations
- excessive whitespace

---

# AI Integration Note

The full AI backend may not exist yet.

The UI must still be designed in a way that **clearly supports AI-driven workflows**.

You may use:

- mock AI outputs
- placeholder responses
- simulated prompts

But the design should feel **AI-native**, not “AI added later”.

---

# Engineering Expectations

The codebase uses:

- React
- TypeScript
- Redux Toolkit
- Material UI
- Vite

Maintain compatibility with the existing architecture.

Do not create a separate project.

Work inside the existing repository.

---

# What Success Looks Like

The final result should feel like:

**an intelligent business command center**

not:

**another business management dashboard**.