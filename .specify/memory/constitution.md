<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles:
  - Placeholder Principle 1 -> I. Mobile UX & Performance First (NON-NEGOTIABLE)
  - Placeholder Principle 2 -> II. Clear Server State vs Client State Boundaries
  - Placeholder Principle 3 -> III. Type Safety Across Navigation, Data, and UI
  - Placeholder Principle 4 -> IV. Risk-Based Testing Gates
  - Placeholder Principle 5 -> V. Accessibility, Localization, and Failure Resilience by Default
- Added sections:
  - Technical Constraints & Standards
  - Workflow & Quality Gates
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check placeholder already compatible)
  - ✅ .specify/templates/spec-template.md (mandatory scenarios/requirements already compatible)
  - ✅ .specify/templates/tasks-template.md (test tasks optional wording compatible)
  - ⚠ pending .specify/templates/commands/*.md (directory not present in repository)
- Follow-up TODOs:
  - None
-->
# RN Movies App Constitution

## Core Principles

### I. Mobile UX & Performance First (NON-NEGOTIABLE)
Every feature MUST protect smooth interactions and perceived speed on mobile.
Changes to list rendering, animations, navigation transitions, and media-heavy
screens MUST avoid avoidable re-renders and unnecessary work on the JS thread.
Any change that risks frame drops MUST include a mitigation plan and validation.

### II. Clear Server State vs Client State Boundaries
Remote data MUST be fetched and managed through React Query in feature services
and controllers, with consistent loading, error, and empty-state behavior.
UI-only and device-local state MUST remain in local state or Zustand stores.
Duplicating the same domain data across independent stores is prohibited unless
there is a documented synchronization strategy.

### III. Type Safety Across Navigation, Data, and UI
TypeScript types MUST define API responses, domain models, component contracts,
and typed routes. Use of `any` is prohibited unless explicitly justified in the
feature artifacts and constrained to integration boundaries. Runtime transforms
from API payload to UI-facing models MUST be explicit and type-safe.

### IV. Risk-Based Testing Gates
Unit tests MUST cover non-trivial business logic, parsing/mapping logic, and
state transitions. E2E coverage with Maestro MUST be added or updated whenever
critical user journeys are impacted (discovery, details, favorites/watchlist,
search, and playback-related flows). Features are not complete until relevant
tests pass for the declared risk level of the change.

### V. Accessibility, Localization, and Failure Resilience by Default
User-facing text MUST come from localization resources, and new screens MUST
ship with at least `pt-BR` and `en` parity for introduced copy. Interactive
elements MUST expose accessible labels/roles where applicable. Network-driven
screens MUST provide graceful behavior for loading, offline, error, and empty
states instead of silent failures.

## Technical Constraints & Standards

- Expo and React Native are the source of truth for runtime architecture.
- Routing MUST use Expo Router conventions with typed routes enabled.
- HTTP integration MUST live in dedicated service/repository layers rather than
  direct request calls from view components.
- Persistent user data (for example watchlist/favorites/history preferences)
  MUST use established repository/helper abstractions for consistency.
- Linting MUST pass before merge; unresolved lint violations are not allowed.
- Platform plugins and native capabilities MUST be introduced through explicit
  Expo config updates and documented feature rationale.

## Workflow & Quality Gates

- Every feature starts from `/speckit-specify` with independent, prioritized
  user stories and measurable acceptance scenarios.
- `/speckit-plan` MUST include a Constitution Check with explicit evidence for
  how each applicable principle is satisfied.
- `/speckit-tasks` MUST map tasks to user stories and include test work when
  required by risk, requirements, or regression surface.
- Pull requests MUST include: scope summary, test evidence (`npm run lint`,
  relevant unit tests, and Maestro runs when journey-critical paths change),
  and explicit notes on localization and failure-state handling when applicable.
- Any intentional exception to this constitution MUST be documented in the
  feature plan and approved during review with a defined follow-up.

## Governance

This constitution overrides informal development habits for this repository.
All feature artifacts (`spec.md`, `plan.md`, `tasks.md`) and pull requests MUST
demonstrate compliance.

Amendment process:
- Propose amendment with rationale and impacted principles/sections.
- Classify version bump using semantic versioning for governance documents.
- Update dependent templates and guidance artifacts in `.specify/templates/`.
- Record migration or adoption steps for in-flight work when required.

Versioning policy:
- MAJOR: Incompatible governance changes or principle removals/redefinitions.
- MINOR: New principle/section or materially expanded required practices.
- PATCH: Clarifications, wording improvements, or non-semantic refinements.

Compliance review expectations:
- Reviewers MUST verify constitution compliance before approving implementation.
- If non-compliance is intentional, the review MUST capture explicit exception
  rationale, risk, owner, and follow-up timeline.

**Version**: 1.0.0 | **Ratified**: 2026-04-25 | **Last Amended**: 2026-04-25
