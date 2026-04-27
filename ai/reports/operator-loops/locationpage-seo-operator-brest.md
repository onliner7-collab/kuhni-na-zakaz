# LocationPage SEO Operator Loop: locationpage-seo-operator-brest

Entity: `LocationPage` / `brest`
Mode: `draft_safe`
Storage target: `safe_admin_draft_integration`
Review state: `needs_review`
Suggested next action: `manual_review`
QA verdict: `NEEDS_REVIEW`
Risk level: `high`

## Loop Architecture
- Receive task envelope
- Route planner, drafter, and QA skills through the skill registry
- Build a LocationPage SEO plan
- Generate a LocationPage draft packet
- Run publication QA
- Normalize a review packet with merged QA context
- Store the result via local/test safe admin draft integration
- Produce final JSON and Markdown artifacts for human review

## What Changed
- `city`
- `intro`
- `description`
- `localIntro`
- `features`
- `uniquePoints`
- `contentBlocks`
- `faq`
- `ctaHeadline`
- `ctaSubtext`

## What Is Safe
- `intro`
- `description`
- `localIntro`
- `features`
- `uniquePoints`
- `contentBlocks`
- `faq`
- `ctaHeadline`
- `ctaSubtext`

## What Is Blocked
- none

## Artifacts
- Machine report: `ai/reports/operator-loops/locationpage-seo-operator-brest.json`
- Human summary: `ai/reports/operator-loops/locationpage-seo-operator-brest.md`
- Admin operation: `ai/reports/admin-integration/locationpage-seo-operator-brest-store.json`
- Review packet: `ai/reports/review-workflow/locationpage-seo-operator-brest-store.json`
- Review summary: `ai/reports/review-workflow/locationpage-seo-operator-brest-store.md`

## State Transitions
- task_received: Accepted a local/test LocationPage safe-draft SEO task.
- skill_routed: Planner=locationpage-seo-planner, drafter=content-draft-generator, QA=publication-qa-reviewer.
- plan_built: Built plan for slug "brest" with 3 data needs.
- draft_generated: Generated draft packet for "brest" with 3 body sections.
- qa_completed: Publication QA verdict for "brest" is "NEEDS_REVIEW".
- review_packet_created: Normalized review packet created with state "needs_review".
- draft_stored: Stored safe draft operation via "safe_admin_draft_integration" without live admin or DB writes.
- final_summary_ready: Final machine-readable report and human-readable summary were written.

## Reusable Parts
- skill-runtime registry routing for planner/draft/QA stages
- publication-qa-reviewer packets as normalized upstream QA input
- review-workflow packet format and states
- safe admin draft integration pattern for local/test-only storage
- draft-to-safe-field mapping strategy reusable for other entities after field-policy mapping
