---
name: admin-route-surface-mapper
description: Scan admin pages and admin API routes to classify risky surfaces for later routing and review decisions.
---

# Admin Route Surface Mapper

Use this skill when orchestration needs a trusted inventory of admin pages and admin API routes, especially for detecting high-risk surfaces before any content or write flow.

## Purpose

- Scan admin pages and admin API route files.
- Flag likely high-risk surfaces using project hints.
- Produce a surface map for registry-based routing and review.

## Supported Entities

- none

## Allowed Modes

- `read_only`

## Required Inputs

- `artifacts/kuhni-na-zakaz/app/admin/**`
- `artifacts/kuhni-na-zakaz/app/kapi/admin/**`

## Outputs

- `ai/reports/admin-surface-map.json`

## Forbidden Actions

- No DB writes
- No admin API writes
- No publish
- No pricing/auth/settings changes
