from __future__ import annotations

import csv
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = ROOT / "prepared-images" / "reports"
SOURCE_MAPPING = REPORTS_DIR / "portfolio-draft-mapping.csv"
SOURCE_CLASSIFICATION = REPORTS_DIR / "photo-classification.csv"
OUTPUT_MAPPING = REPORTS_DIR / "portfolio-vetted-mapping.csv"
OUTPUT_SUMMARY = REPORTS_DIR / "portfolio-audit-summary.md"
STAGE_MAPPING = ROOT / "artifacts" / "kuhni-na-zakaz" / "project-docs" / "stage-4-2-photo-import" / "portfolio-draft-mapping.csv"


@dataclass
class AuditResult:
    row: dict[str, str]
    ok: bool
    reason: str


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def normalize_bool(value: str) -> bool:
    return value.strip().lower() == "true"


def expected_slug_prefix(layout_type: str) -> str:
    mapping = {
        "uglovaya-kuhnya": "uglovaya-kuhnya-",
        "pryamaya-kuhnya": "pryamaya-kuhnya-",
        "kuhnya-s-ostrovom": "kuhnya-s-ostrovom-",
        "malenkaya-kuhnya": "malenkaya-kuhnya-",
        "p-obraznaya-kuhnya": "p-obraznaya-kuhnya-",
        "kuhnya-do-potolka": "kuhnya-do-potolka-",
        "kuhnya-bez-ruchek": "kuhnya-bez-ruchek-",
    }
    return mapping.get(layout_type, "")


def is_portfolio_image_path(path_value: str) -> bool:
    normalized = path_value.replace("\\", "/").lower()
    return "/prepared-images/portfolio/" in normalized


def audit_rows(rows: list[dict[str, str]]) -> list[AuditResult]:
    results: list[AuditResult] = []
    for row in rows:
        slug = row.get("suggestedSlug", "").strip()
        layout_type = row.get("layoutType", "").strip()
        confidence = row.get("confidence", "").strip().lower()
        needs_review = normalize_bool(row.get("needs_review", ""))
        main_image = row.get("mainImage", "").strip()
        images = [item.strip() for item in row.get("images", "").split("|") if item.strip()]

        if not slug:
            results.append(AuditResult(row=row, ok=False, reason="Пустой slug"))
            continue

        if confidence not in {"high", "medium"}:
            results.append(AuditResult(row=row, ok=False, reason=f"Низкая уверенность: {confidence or 'n/a'}"))
            continue

        if needs_review:
            results.append(AuditResult(row=row, ok=False, reason="needs_review=true"))
            continue

        expected_prefix = expected_slug_prefix(layout_type)
        if expected_prefix and not slug.startswith(expected_prefix):
            results.append(AuditResult(row=row, ok=False, reason=f"Slug не совпадает с типом планировки: {layout_type}"))
            continue

        if not main_image or not is_portfolio_image_path(main_image):
            results.append(AuditResult(row=row, ok=False, reason="mainImage не из prepared-images/portfolio"))
            continue

        if not images:
            results.append(AuditResult(row=row, ok=False, reason="Нет изображений в группе"))
            continue

        non_portfolio_images = [img for img in images if not is_portfolio_image_path(img)]
        if non_portfolio_images:
            results.append(AuditResult(row=row, ok=False, reason="В группе есть фото из needs-review"))
            continue

        results.append(AuditResult(row=row, ok=True, reason="OK"))

    return results


def load_features_by_slug() -> dict[str, set[str]]:
    rows = read_csv(SOURCE_CLASSIFICATION)
    features_by_slug: dict[str, set[str]] = defaultdict(set)
    for row in rows:
        file_name = (row.get("newFileName") or "").strip()
        visible = (row.get("visibleFeatures") or "").strip()
        if not file_name:
            continue
        slug = file_name.rsplit("-", 2)[0]
        if not slug:
            continue
        for feature in [item.strip() for item in visible.split("|") if item.strip()]:
            features_by_slug[slug].add(feature)
    return features_by_slug


def write_mapping(rows: list[dict[str, str]], path: Path) -> None:
    if not rows:
        raise RuntimeError("Нет строк для сохранения vetted mapping.")
    fieldnames = list(rows[0].keys())
    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_summary(results: list[AuditResult], accepted_rows: list[dict[str, str]], features_by_slug: dict[str, set[str]]) -> None:
    accepted_by_layout: dict[str, list[str]] = defaultdict(list)
    for row in accepted_rows:
        accepted_by_layout[row["layoutType"]].append(row["suggestedSlug"])

    rejected_stats: dict[str, int] = defaultdict(int)
    for result in results:
        if not result.ok:
            rejected_stats[result.reason] += 1

    lines: list[str] = []
    lines.append("# Audit: распределение фото для портфолио")
    lines.append("")
    lines.append(f"- Источник: `{SOURCE_MAPPING}`")
    lines.append(f"- Проверено групп: **{len(results)}**")
    lines.append(f"- Принято к внедрению: **{len(accepted_rows)}**")
    lines.append(f"- Отклонено: **{len(results) - len(accepted_rows)}**")
    lines.append("")
    lines.append("## Принятые группы (по планировке)")
    for layout_type in sorted(accepted_by_layout.keys()):
        slugs = ", ".join(sorted(accepted_by_layout[layout_type]))
        lines.append(f"- `{layout_type}`: {slugs}")
    lines.append("")
    lines.append("## Отклонённые группы (причины)")
    for reason, count in sorted(rejected_stats.items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"- {reason}: {count}")
    lines.append("")
    lines.append("## Контроль признака 'до потолка'")
    with_do_potolka = [slug for slug in sorted(features_by_slug.keys()) if "do-potolka" in features_by_slug[slug]]
    accepted_do_potolka = [slug for slug in with_do_potolka if any(row["suggestedSlug"] == slug for row in accepted_rows)]
    lines.append(f"- Найдено групп с признаком `do-potolka`: {len(with_do_potolka)}")
    lines.append(f"- Из них принято: {len(accepted_do_potolka)}")
    if accepted_do_potolka:
        lines.append(f"- Принятые с `do-potolka`: {', '.join(accepted_do_potolka)}")

    OUTPUT_SUMMARY.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    rows = read_csv(SOURCE_MAPPING)
    results = audit_rows(rows)
    accepted_rows = [result.row for result in results if result.ok]
    features_by_slug = load_features_by_slug()

    write_mapping(accepted_rows, OUTPUT_MAPPING)
    write_mapping(accepted_rows, STAGE_MAPPING)
    write_summary(results, accepted_rows, features_by_slug)

    print(f"Accepted: {len(accepted_rows)} / {len(results)}")
    print(f"Wrote: {OUTPUT_MAPPING}")
    print(f"Updated stage mapping: {STAGE_MAPPING}")
    print(f"Summary: {OUTPUT_SUMMARY}")


if __name__ == "__main__":
    main()
