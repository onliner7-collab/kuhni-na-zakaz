---
name: entity-draft-writer
description: Validate a pipeline-reviewed draft writing task, enforce QA and policy gates, and call the existing draft-safe writer only for approved draft-safe fields.
---

# Entity Draft Writer

Use this skill when the orchestration pipeline has already produced a reviewed writing task and the project needs a safe draft artifact, not a production write.

## Purpose

- Accept a pipeline-reviewed task for `draft_writing`.
- Validate mode, entity, identifier, and requested fields against real project policies.
- Enforce QA gate before any write step.
- Call the existing `draft-safe-writer` only for allowed `draft_safe` fields.
- Return a unified structured result plus explicit logs and review artifacts.

## Supported Entities

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

## Allowed Fields By Entity

### `LocationPage`

- `intro`
- `description`
- `localIntro`
- `uniquePoints`
- `contentBlocks`
- `faq`
- `features`
- `ctaHeadline`
- `ctaSubtext`

### `Kitchen`

- `title`
- `description`
- `features`

### `BlogPost`

- `title`
- `excerpt`
- `content`
- `category`
- `tags`
- `readTime`

### `PortfolioCase`

- `description`
- `task`
- `constraints`
- `solution`
- `result`

## Allowed Modes

- `draft_safe`
- `read_only`
- `review_required`

## Invokes Writer

- Yes

## Requires QA

- Yes

## Mode Behavior

- `draft_safe`: may call the existing safe writer, but only after QA and policy checks pass.
- `read_only`: must not call the writer; return inspection-style result only.
- `review_required`: must not apply changes; return proposal or review packet only.

## QA Gate

Do not apply any write when:

- QA packet is missing
- QA verdict is `FAIL`
- mode is not `draft_safe`
- entity is unsupported
- requested fields are forbidden or review-only

Allowed partial path:

- `qaOutcome.verdict = NEEDS_REVIEW`
- only truly `draft_safe` fields are forwarded to the existing writer
- result must stay `partial`
- review artifact must clearly say review is still required

## Hard Blocks

Always block:

- `PriceRule`
- pricing logic
- settings
- auth
- middleware
- publish controls
- `slug`

Also block review-only or sensitive fields such as publish flags and protected SEO metadata.

## Input Contract

```json
{
  "taskId": "draft-task-001",
  "mode": "draft_safe",
  "entity": "LocationPage",
  "identifier": "minsk-test-draft",
  "requestedPatch": {
    "intro": "Updated draft intro",
    "faq": [{ "question": "Q", "answer": "A" }]
  },
  "qaOutcome": {
    "verdict": "PASS",
    "sourceReport": "ai/reports/reviews/publication-qa-review.json",
    "riskLevel": "medium",
    "summary": "Packet is structurally sound for human review."
  },
  "reviewPacketReference": "ai/reports/reviews/publication-qa-review.json",
  "currentState": {
    "intro": "Existing intro"
  }
}
```

## Output Contract

```json
{
  "taskId": "draft-task-001",
  "timestamp": "2026-04-13T10:00:00.000Z",
  "status": "applied",
  "appliedFields": ["intro", "faq"],
  "blockedFields": [],
  "entity": "LocationPage",
  "identifier": "minsk-test-draft",
  "mode": "draft_safe",
  "artifactPath": "ai/reports/writes/state/LocationPage/minsk-test-draft.draft.json",
  "logPath": "ai/logs/entity-draft-writer.jsonl",
  "reviewPacketPath": "ai/reports/reviews/entity-draft-writer-review-...json",
  "reasons": []
}
```

## Outputs

- `ai/reports/reviews/entity-draft-writer-review-*.json`
- `ai/reports/writes/attempts/entity-draft-writer-attempt-*.json`
- `ai/logs/entity-draft-writer.jsonl`
- existing writer artifacts under `ai/reports/writes/state/...` when a safe draft artifact is actually written

## Forbidden Actions

- No DB writes
- No admin API writes
- No publish
- No slug change
- No pricing change
- No settings/auth/middleware changes
- No production business route edits
