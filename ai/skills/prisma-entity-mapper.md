---
name: prisma-entity-mapper
description: Read Prisma schema and entity policies to build a safe field map for first-wave entities and their write boundaries.
---

# Prisma Entity Mapper

Use this skill when orchestration needs a trusted entity map, field inventory, relation list, or safety classification from the real Prisma schema.

## Purpose

- Parse Prisma models from the live schema.
- Mark field safety using project entity policies.
- Produce a focused map for first-wave entities and high-risk models.

## Supported Entities

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`
- `PriceRule`

## Allowed Modes

- `read_only`

## Required Inputs

- `artifacts/kuhni-na-zakaz/prisma/schema.prisma`
- `ai/policies/entities.json`

## Outputs

- `ai/reports/prisma-entity-map.json`

## Forbidden Actions

- No DB writes
- No schema writes
- No admin API writes
- No publish
