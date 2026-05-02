"""Проверка: у каждого slug в portfolio-projects есть manifest.json и все file из images существуют."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PP = ROOT / "prepared-images" / "portfolio-projects"


def main() -> int:
    bad: list[str] = []
    for d in sorted(PP.iterdir()):
        if not d.is_dir() or d.name.startswith("_"):
            continue
        m = d / "manifest.json"
        if not m.is_file():
            bad.append(f"{d.name}: нет manifest.json")
            continue
        try:
            data = json.loads(m.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            bad.append(f"{d.name}: JSON {e}")
            continue
        for im in data.get("images") or []:
            fn = im.get("file") or ""
            if not fn:
                bad.append(f"{d.name}: пустой file в images")
                continue
            if not (d / fn).is_file():
                bad.append(f"{d.name}: нет файла {fn}")
    if bad:
        for line in bad:
            print(line, file=sys.stderr)
        print(f"FAIL: {len(bad)} проблем", file=sys.stderr)
        return 1
    print(f"OK: все проекты в {PP} согласованы с manifest")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
