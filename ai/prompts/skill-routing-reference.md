# Skill Routing Reference

This file describes the registry-driven routing model for the AI layer.

## Source Of Truth

- Skill definitions: `ai/skills/registry.json`
- Human-readable skill specs: `ai/skills/*.md`
- Runtime router and executor: `scripts/src/ai/skill-runtime.ts`
- Unified CLI entrypoint: `scripts/src/ai/run-skill-runtime.ts`

## Routing Order

1. If a task explicitly names a valid skill, runtime validates that the skill supports the requested mode and entity.
2. Otherwise runtime evaluates registry routing rules by descending `priority`.
3. Protected fields or protected intents route to `pricing-risk-guard` before any writer-capable skill.
4. If no rule matches, execution stops with a routing error instead of guessing.

## Protected Surfaces

These must not auto-route into draft writing or live-affecting flows:

- pricing fields
- `slug`
- `published` / `publishedAt`
- auth
- settings
- middleware
- protected SEO metadata fields

## Task Envelope

Registry execution expects a task envelope like:

```json
{
  "taskId": "task-001",
  "taskType": "seo_planning",
  "entity": "LocationPage",
  "mode": "read_only",
  "intent": "audit location page SEO coverage"
}
```

For write-oriented review flows, add skill-specific payload such as `requestedPatch`, `identifier`, `qaOutcome`, and `currentState`.

## Execution Modes

- `route`: resolve the skill from registry rules and return a routing decision
- `execute`: route then invoke the concrete skill binding

## Non-Negotiable Restrictions

- No DB writes
- No admin live writes
- No publish
- No slug changes
- No pricing apply
- No auth/settings changes
