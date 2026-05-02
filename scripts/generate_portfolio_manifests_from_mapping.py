from __future__ import annotations

import csv
import json
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAPPING = ROOT / "prepared-images" / "reports" / "portfolio-draft-mapping.csv"
CLASSIFICATION = ROOT / "prepared-images" / "reports" / "photo-classification.csv"
OUT_ROOT = ROOT / "prepared-images" / "portfolio-projects"


def caption_from_filename(filename: str) -> str:
    lower = filename.lower()
    if "detail" in lower:
        return "Деталь кухни"
    if "extra" in lower:
        return "Дополнительный ракурс"
    if "side" in lower:
        return "Ракурс сбоку"
    if "main" in lower:
        return "Общий вид"
    return "Фото проекта"


def load_classification_alts() -> dict[str, str]:
    path = CLASSIFICATION
    if not path.is_file():
        return {}
    alts: dict[str, str] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            prepared = (row.get("preparedPath") or "").strip()
            alt = (row.get("alt") or "").strip()
            if prepared:
                alts[Path(prepared).name.lower()] = alt
            nf = (row.get("newFileName") or "").strip()
            if nf and nf.lower() not in alts:
                alts[nf.lower()] = alt
    return alts


def norm_main(path_str: str) -> str:
    return path_str.replace("\\", "/")


def write_manifest_for_row(row: dict[str, str], alts: dict[str, str]) -> tuple[str, list[str]]:
    slug = row["suggestedSlug"].strip()
    external_id = row["projectGroupId"].strip()
    title = row["suggestedTitle"].strip()
    layout_type = row["layoutType"].strip()
    style = row["style"].strip()
    color = (row.get("color") or "").strip()

    main_raw = row["mainImage"].strip()
    images_raw = row["images"].strip()
    paths = [p.strip() for p in images_raw.split("|") if p.strip()]
    if not paths:
        raise RuntimeError(f"{slug}: нет images")

    dest_dir = OUT_ROOT / slug
    dest_dir.mkdir(parents=True, exist_ok=True)

    images_manifest: list[dict[str, str]] = []
    errors: list[str] = []

    for idx, src_str in enumerate(paths):
        src = Path(src_str)
        if not src.is_file():
            errors.append(f"{slug}: нет файла {src}")
            continue
        ext = src.suffix.lower() or ".webp"
        safe = re.sub(r"[^a-zA-Z0-9._-]+", "-", src.stem)[:80]
        dest_name = f"{idx + 1:02d}-{safe}{ext}"
        dest_path = dest_dir / dest_name
        shutil.copy2(src, dest_path)

        bn = src.name.lower()
        alt = alts.get(bn) or title
        cap = caption_from_filename(src.name)

        images_manifest.append({"file": dest_name, "alt": alt, "caption": cap})

    if errors:
        raise RuntimeError("; ".join(errors))

    main_norm = norm_main(main_raw).lower()
    main_idx = 0
    for i, p in enumerate(paths):
        if norm_main(p).lower() == main_norm:
            main_idx = i
            break

    manifest = {
        "externalId": external_id,
        "slug": slug,
        "title": title,
        "shortTitle": "",
        "layoutType": layout_type,
        "style": style,
        "color": color,
        "material": "",
        "materials": [],
        "city": "",
        "region": "",
        "district": "",
        "size": "",
        "workDuration": "",
        "priceFrom": 0,
        "priceTo": 0,
        "priceNote": "Стоимость зависит от размеров, материалов и комплектации.",
        "relatedLocationSlugs": [],
        "description": "",
        "task": "",
        "constraints": "",
        "solution": "",
        "result": "",
        "features": [],
        "scenarioSlugs": [],
        "published": True,
        "featured": False,
        "mainImageIndex": main_idx,
        "images": images_manifest,
    }

    manifest_path = dest_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return slug, errors


def main() -> None:
    alts = load_classification_alts()
    if not MAPPING.is_file():
        raise SystemExit(f"Нет файла {MAPPING}")

    with MAPPING.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    # Убираем старые auto-сгенерированные каталоги кроме _template
    if OUT_ROOT.is_dir():
        for child in OUT_ROOT.iterdir():
            if child.is_dir() and not child.name.startswith("_"):
                shutil.rmtree(child, ignore_errors=True)

    ok: list[str] = []
    for row in rows:
        slug = row.get("suggestedSlug", "").strip()
        if not slug:
            continue
        s, _ = write_manifest_for_row(row, alts)
        ok.append(s)

    print(f"Generated {len(ok)} projects under {OUT_ROOT}")
    for s in ok:
        print(f"  - {s}")


if __name__ == "__main__":
    main()
