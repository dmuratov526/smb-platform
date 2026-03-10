# TASK.md

## Current task

Implement the next frontend milestone for the Business Operating System prototype.

Before implementing, read:

- AGENTS.md
- the documentation in the docs directory

Assume the frontend foundation from Task 1 already exists.

Do not rebuild the existing layout, navigation, or placeholder pages unless needed for this task.

---

# Goal

Introduce a user-centered entry flow and business creation flow.

The application should no longer feel like a static prototype tied to one preselected business.

Instead, the product should support this experience:

1. start with a selected mock user
2. allow switching users
3. allow logging out of the current user session
4. allow a user to create one or more businesses
5. guide a new business through a structured onboarding flow
6. customize onboarding inputs based on business category

This should make the product feel like a real business workspace rather than a generic dashboard.

---

# Product direction

The product lifecycle remains:

idea → business setup → simulation → launch planning → operations → analytics

This task focuses on the transition from:

user selection → business creation → business onboarding → ready workspace

Business Builder should become the main entry point for setting up a new business.

Business Simulator is still a core surface, but should only become useful after a business has been configured.

---

# Scope

Implement the frontend structure and mock logic for:

- user session selection
- user switching
- business creation
- category-based business onboarding
- routing/flow into the main workspace after onboarding

Use mock data only.

No backend, no authentication, no APIs.

---

# Functional requirements

## 1. Mock user session layer

Add a simple mock session system.

The application should support:

- a current active user
- a way to log out / exit the current user
- a way to choose another mock user
- separate businesses per mock user

At minimum, include 3 realistic mock users with different profiles.

Example directions:
- solo founder
- small agency owner
- retail entrepreneur

Each user should have:
- id
- name
- role/title
- avatar/initials placeholder
- list of businesses
- onboarding progress state if relevant

This is not real authentication.
It is only a frontend session simulation layer.

---

## 2. Entry experience

When the app starts, it should not assume only one business forever.

Design a lightweight entry flow:

- if a user is selected, open the app in that user’s workspace
- if no user is selected, show a user selection / welcome screen
- from the active session, allow “Switch User” or “Exit Session”

This flow should feel product-like, not like a developer test screen.

---

## 3. Business creation flow

Allow the active user to create a new business.

This should start a guided business onboarding flow.

At minimum, the create business entry point should ask for:

- business name
- business category
- short description or concept
- stage (idea / early / operating), if useful
- optional location
- optional team size

The new business should be added to that user’s business list in mock frontend state.

---

## 4. Category-based onboarding

This is the core of the task.

After creating a business, the user should enter a structured onboarding flow.

The onboarding should adapt based on business category.

Add many business categories so the system feels broad and flexible.

Suggested category groups:

### Local and service businesses
- Restaurant / Cafe
- Salon / Barbershop
- Fitness Studio / Gym
- Cleaning Service
- Repair Service
- Healthcare Clinic
- Education / Tutoring
- Consulting / Agency

### Commerce businesses
- E-commerce Brand
- Retail Store
- Wholesale / Distribution
- Marketplace

### Digital and product businesses
- SaaS
- Mobile App
- Media / Content Business
- AI Tool
- Design Studio
- Software Agency

### Industrial and operational businesses
- Manufacturing
- Logistics / Delivery
- Construction
- Agriculture
- Energy / Infrastructure

### Hospitality and events
- Hotel / Accommodation
- Event Business
- Travel Service

You may refine this structure if needed, but the category system should be extensive enough to make onboarding logic meaningful.

---

## 5. Category-specific onboarding structure

Different business categories should ask for different onboarding information.

Do not implement extremely deep business logic yet, but create a scalable structure for it.

Examples:

### Restaurant / Cafe
- format (cafe, restaurant, cloud kitchen, etc.)
- cuisine type
- service model (dine-in, takeaway, delivery)
- seating capacity
- opening hours
- expected average order value

### SaaS
- target customer
- pricing model
- subscription tiers
- acquisition channels
- product maturity
- team composition

### Retail Store
- store type
- product categories
- offline / online / hybrid
- average basket size
- supplier setup
- store size

### Consulting / Agency
- service lines
- ideal client type
- pricing model
- delivery model
- team size
- lead sources

### Manufacturing
- product type
- production model
- supply chain complexity
- facility needs
- equipment intensity
- quality/operations priorities

### Fitness Studio
- class types / service offer
- membership model
- trainer count
- schedule complexity
- location type
- retention priorities

The exact fields can be mock-level, but the onboarding must clearly differ by category.

---

## 6. Onboarding UX

The onboarding experience should feel guided and structured.

Implement it as a multi-step flow.

Suggested high-level steps:

1. Business Basics
2. Category Profile
3. Operating Model
4. Revenue Model
5. Team & Resources
6. Review / Complete

Not every category must use identical labels internally, but the overall experience should feel consistent.

Requirements:
- visible progress indicator / stepper
- next/back navigation
- draft-like state in Redux
- ability to review before completion
- clean form layout
- category-specific sections rendered dynamically

Do not overdesign with advanced validation libraries unless already available.
Keep the implementation clean and scalable.

---

## 7. Post-onboarding result

Once onboarding is completed:

- create the business in frontend state
- mark it as active business
- route the user into the main workspace
- make the Business Builder page reflect the configured business
- make the Dashboard feel tied to the active business

At this stage, simple summaries are enough.

Examples:
- business category
- onboarding completion status
- selected operating model
- selected revenue model
- key assumptions snapshot

---

# UX expectations

The new flow should communicate:

- this platform helps users shape a business from scratch
- different businesses require different setup logic
- onboarding is not just data entry, but structured business design
- Business Builder is the primary setup workspace

Avoid making this look like a generic signup wizard.

It should feel like:
- a founder workflow
- a business configuration studio
- a guided setup experience for an operating system

---

# Technical expectations

Use the required stack:

- React
- TypeScript
- Redux Toolkit
- Material UI

Follow AGENTS.md.

Prefer scalable frontend patterns.

Recommended implementation direction:

- introduce a dedicated session slice
- introduce a businesses slice
- introduce onboarding config and schemas in a dedicated module
- keep category definitions centralized
- use typed config-driven rendering where possible
- keep page-level containers thin
- keep reusable onboarding form components modular

Avoid:
- hardcoding everything inside one giant component
- duplicating onboarding code per category
- adding unnecessary dependencies
- premature backend-style abstractions

---

# Suggested architecture direction

This is guidance, not a rigid prescription.

Possible additions:

- src/features/session/
- src/features/businesses/
- src/features/onboarding/
- src/features/onboarding/config/
- src/features/onboarding/components/
- src/features/onboarding/types/
- src/features/onboarding/utils/

Potential concepts:
- business category registry
- onboarding step config by category
- dynamic field renderer for simple field types
- active user selector
- active business selector
- onboarding draft state

Keep this practical and not overengineered.

---

# Out of scope

Do NOT implement:

- real authentication
- backend persistence
- API integration
- multi-user collaboration
- permissions model
- advanced validation infrastructure
- real AI logic
- simulator calculations
- database models
- production-grade form engine

This is still a frontend prototype.

---

# Definition of done

This task is complete when:

- the app supports mock user selection
- the current user can exit and switch users
- each user has separate business data
- the current user can create a new business
- new business creation launches a guided onboarding flow
- onboarding adapts based on business category
- onboarding is multi-step and clearly structured
- completing onboarding creates an active business in state
- the app routes into the workspace for that business
- the structure is clean and scalable for future Business Builder and Simulator work

The result should feel like the beginning of a real founder workflow inside a Business Operating System.