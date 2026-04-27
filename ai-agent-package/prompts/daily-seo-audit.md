# Daily SEO Audit Prompt

Run a safe `audit_only` SEO review for `https://www.kuhni.minsk.by`.

## Check list

- Indexation signals:
  - robots directives
  - sitemap consistency
  - canonical consistency
- Metadata quality:
  - missing or duplicate `title`
  - missing or duplicate `meta description`
  - H1 alignment with search intent
- Content quality:
  - thin commercial pages
  - weak local pages
  - missing FAQ/CTA where commercially needed
- Internal linking:
  - orphan pages
  - weak context links
  - anchor diversity
- Media:
  - meaningful image usage
  - alt coverage where field support exists

## Output

- `P0`, `P1`, `P2` issues list
- impacted URLs/entities
- suggested fix for each issue
- estimated effort (`low`/`medium`/`high`)
- recommended next 3 actions for tomorrow

