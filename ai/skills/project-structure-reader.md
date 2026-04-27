---
name: project-structure-reader
description: Read real project files and produce a trusted structure map for later AI routing and task planning.
---

# Project Structure Reader

Use this skill when orchestration needs to confirm where routes, admin surfaces, Prisma schema, or SEO files really live before selecting a narrower skill.

## Purpose

- Scan real project directories and files.
- Confirm source-of-truth paths for app routes, admin routes, Prisma schema, and core SEO files.
- Produce a structure report for downstream routing and task selection.

## Supported Entities

- none

## Allowed Modes

- `read_only`

## Required Inputs

- `artifacts/kuhni-na-zakaz`
- `project-docs`
- `ai`

## Outputs

- `ai/reports/project-structure.json`

## Forbidden Actions

- No DB writes
- No admin API writes
- No publish
- No slug, pricing, auth, settings, or route edits
