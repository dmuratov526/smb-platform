# TASK.md

## Current task

Implement the first functional version of the Business Builder.

The application already supports:

- mock user sessions
- user switching
- multiple businesses per user
- category-based business onboarding
- active business context
- application workspace

The next step is to allow users to design and structure their business model.

Business Builder should become the main workspace where a user defines how their business works.

Before implementing, read:

- AGENTS.md
- documentation in docs/

---

# Goal

Create the first working version of the Business Builder workspace.

The Business Builder should allow users to define the core structure of their business.

The builder will consist of several sections representing parts of a business model:

- Offer
- Customer
- Revenue Model
- Acquisition
- Operations
- Financial Snapshot

Users should be able to:

- view the current business model
- edit fields inside each section
- store changes in frontend state
- refine their business configuration over time

This information will later feed the Business Simulator.

---

# Scope

Implement:

- Business Model data structure
- Redux slice for business model state
- Business Builder page
- section-based builder architecture
- editable fields
- integration with the active business

Use mock data only.

---

# Business Model structure

Introduce a new entity:

BusinessModel

Example structure:

BusinessModel
- offer
- customer
- revenue
- acquisition
- operations
- financials

Example TypeScript shape:

type BusinessModel = {
  offer: OfferConfig
  customer: CustomerConfig
  revenue: RevenueModel
  acquisition: AcquisitionModel
  operations: OperationsModel
  financials: FinancialSnapshot
}

Keep this simple for now.

Do not implement complex financial modeling yet.

---

# Builder sections

The Business Builder should contain six sections.

---

## 1. Offer

Defines what the business sells.

Possible fields:

- product or service name
- value proposition
- key features
- pricing approach

---

## 2. Customer

Defines the target audience.

Possible fields:

- target customer segment
- customer problem
- willingness to pay
- geographic focus

---

## 3. Revenue Model

Defines how the business makes money.

Possible fields:

- pricing model
- revenue streams
- average transaction value
- expected sales volume

---

## 4. Acquisition

Defines how customers are acquired.

Possible fields:

- marketing channels
- sales model
- conversion assumptions
- estimated acquisition cost

---

## 5. Operations

Defines how the business operates.

Possible fields:

- team structure
- key resources
- suppliers or partners
- operational complexity
- capacity constraints

---

## 6. Financial Snapshot

Provides a simplified financial overview.

Possible fields:

- expected monthly revenue
- expected monthly costs
- break-even estimate
- margin estimate

Keep financials simple.

The detailed calculations will be implemented later in the Business Simulator.

---

# UX expectations

The Business Builder should feel like a workspace, not a form wizard.

Structure example:

Business Builder

Offer
Customer
Revenue Model
Acquisition
Operations
Financial Snapshot

Each section should appear as a card or block with editable fields.

Users should be able to edit values and see the updated state.

Keep the layout clean and structured.

---

# Category awareness

The Business Builder should remain aware of the business category.

Different categories may have:

- different default values
- hints or recommended fields

For this version:

- keep category customization minimal
- focus on building the core architecture

The system should allow category-specific customization later.

---

# State management

Add a Redux slice responsible for the business model.

Responsibilities:

- load business model for active business
- update section fields
- store updates in state

The model should be tied to the active business.

Avoid complex normalization.

---

# Suggested architecture

Suggested structure:

src/features/

businessModel/
- slice.ts
- types.ts
- selectors.ts

businessBuilder/
- BusinessBuilderPage.tsx

components/
- BuilderSection.tsx
- FieldRow.tsx

sections/
- OfferSection.tsx
- CustomerSection.tsx
- RevenueSection.tsx
- AcquisitionSection.tsx
- OperationsSection.tsx
- FinancialSection.tsx

Keep sections modular.

Avoid large monolithic components.

Separate UI from state logic where possible.

---

# Important constraints

Do NOT implement:

- backend persistence
- API integration
- authentication
- AI features
- business simulation logic
- advanced validation frameworks
- large form libraries

Focus only on the Business Builder structure.

---

# Definition of done

This task is complete when:

- Business Builder page exists
- six builder sections are implemented
- users can edit fields in each section
- values are stored in Redux state
- builder is connected to the active business
- architecture is modular and scalable

The result should feel like the first real business design environment inside the Business Operating System.