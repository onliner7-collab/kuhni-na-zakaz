"""
Пересборка подготовленных webp по photo-classification.csv:
- исходник: originalPath (если есть на диске), иначе уже лежащий webp в portfolio/needs-review;
- вывод: тот же каталог и имя newFileName (перезапись);
- ресайз: max ширина 1920 px, WebP quality 82 (как в prepare_kitchen_photos.webp_copy, но шире для экранов до 1920).
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
CLASSIFICATION = ROOT / "prepared-images" / "reports" / "photo-classification.csv"
REPORT_JSON = ROOT / "prepared-images" / "reports" / "webp-rebuild-report.json"

MAX_WIDTH = 1920
WEBP_QUALITY = 82


def resolve_destination(prepared_path: str, new_name: str) -> Path:
    norm = prepared_path.replace("\\", "/").lower()
    name = new_name.strip()
    if "/portfolio/" in norm:
        return ROOT / "prepared-images" / "portfolio" / name
    if "/needs-review/" in norm:
        return ROOT / "prepared-images" / "needs-review" / name
    if "/styles/" in norm:
        return ROOT / "prepared-images" / "styles" / name
    if "/catalog/" in norm:
        return ROOT / "prepared-images" / "catalog" / name
    # fallback: рядом с подготовленным абсолютным путём
    p = Path(prepared_path)
    if p.parent.name in ("portfolio", "needs-review", "styles", "catalog"):
        return ROOT / "prepared-images" / p.parent.name / name
    raise ValueError(f"Не удалось определить папку назначения: {prepared_path}")


def resolve_source(original_path: str, new_name: str) -> Path | None:
    o = Path(original_path.strip())
    if o.is_file():
        return o
    name = new_name.strip()
    for folder in ("portfolio", "needs-review", "styles", "catalog"):
        cand = ROOT / "prepared-images" / folder / name
        if cand.is_file():
            return cand
    return None


def webp_copy(source: Path, target: Path, max_width: int = MAX_WIDTH) -> tuple[int, int]:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("RGBA", "LA"):
            rgb = Image.new("RGB", im.size, (255, 255, 255))
            rgb.paste(im, mask=im.split()[-1])
            im = rgb
        elif im.mode != "RGB":
            im = im.convert("RGB")
        if im.width > max_width:
            ratio = max_width / im.width
            im = im.resize((max_width, round(im.height * ratio)), Image.Resampling.LANCZOS)
        im.save(target, "WEBP", quality=WEBP_QUALITY, method=6)
        return im.width, im.height


def main() -> int:
    if not CLASSIFICATION.is_file():
        print(f"Нет файла {CLASSIFICATION}", file=sys.stderr)
        return 1

    rows_out: list[dict[str, str]] = []
    ok = 0
    skipped = 0
    errors: list[str] = []

    with CLASSIFICATION.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            orig = (row.get("originalPath") or "").strip()
            prep = (row.get("preparedPath") or "").strip()
            new_name = (row.get("newFileName") or "").strip()
            if not prep or not new_name:
                skipped += 1
                continue
            try:
                dest = resolve_destination(prep, new_name)
            except ValueError as e:
                errors.append(f"{new_name}: {e}")
                continue
            src = resolve_source(orig, new_name)
            if src is None:
                errors.append(f"{new_name}: нет исходника и файла в prepared-images")
                skipped += 1
                continue
            try:
                w, h = webp_copy(src, dest)
                ok += 1
                rows_out.append({"file": new_name, "source": str(src), "dest": str(dest), "width": str(w), "height": str(h)})
            except (UnidentifiedImageError, OSError, ValueError) as e:
                errors.append(f"{new_name}: {e}")

    REPORT_JSON.parent.mkdir(parents=True, exist_ok=True)
    REPORT_JSON.write_text(
        json.dumps(
            {"maxWidth": MAX_WIDTH, "quality": WEBP_QUALITY, "ok": ok, "skipped": skipped, "errors": errors, "files": rows_out},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"WEBP rebuild: ok={ok}, skipped={skipped}, errors={len(errors)}")
    print(f"Report: {REPORT_JSON}")
    if errors:
        for line in errors[:20]:
            print(line, file=sys.stderr)
        if len(errors) > 20:
            print(f"... и ещё {len(errors) - 20}", file=sys.stderr)
        return 1 if ok == 0 else 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
