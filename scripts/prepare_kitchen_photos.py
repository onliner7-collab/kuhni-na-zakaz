from __future__ import annotations

import csv
import hashlib
import math
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, UnidentifiedImageError


SOURCE_DIR = Path(r"E:\фото кухни 3")
WORK_DIR = Path.cwd()
OUTPUT_DIR = WORK_DIR / "prepared-images"
REPORT_DIR = OUTPUT_DIR / "reports"
CONTACT_DIR = OUTPUT_DIR / "contact-sheets"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


@dataclass
class Photo:
    index: int
    original_path: Path
    original_file_name: str
    format: str
    file_size: int
    width: int = 0
    height: int = 0
    orientation: str = "unknown"
    quality: str = "poor"
    status: str = "needs_review"
    duplicate_of: str = ""
    reason: str = ""
    sha256: str = ""
    dhash: int | None = None
    blur_score: float = 0.0
    project_group_id: str = ""
    new_file_name: str = ""
    prepared_path: str = ""
    layout_type: str = "unknown"
    style: str = "unknown"
    color: str = "unknown"
    material: str = "unknown"
    visible_features: list[str] = field(default_factory=list)
    confidence: str = "low"
    needs_review: bool = True
    alt: str = ""
    role: str = "extra-01"
    small_source: bool = False


def ensure_dirs() -> None:
    for path in [
        OUTPUT_DIR / "catalog",
        OUTPUT_DIR / "portfolio",
        OUTPUT_DIR / "styles",
        OUTPUT_DIR / "materials",
        OUTPUT_DIR / "rejected",
        OUTPUT_DIR / "needs-review",
        REPORT_DIR,
        CONTACT_DIR,
    ]:
        path.mkdir(parents=True, exist_ok=True)


def iter_images(source: Path) -> Iterable[Path]:
    return sorted(
        (p for p in source.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTENSIONS),
        key=lambda p: str(p).lower(),
    )


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def dhash(image: Image.Image, hash_size: int = 8) -> int:
    gray = ImageOps.grayscale(image)
    small = gray.resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(small.getdata())
    value = 0
    for row in range(hash_size):
        for col in range(hash_size):
            left = pixels[row * (hash_size + 1) + col]
            right = pixels[row * (hash_size + 1) + col + 1]
            value = (value << 1) | int(left > right)
    return value


def hamming(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def edge_score(image: Image.Image) -> float:
    gray = ImageOps.grayscale(image).resize((256, 256), Image.Resampling.LANCZOS)
    edges = gray.filter(ImageFilter.FIND_EDGES)
    hist = edges.histogram()
    total = sum(v * i for i, v in enumerate(hist))
    return total / (256 * 256)


def analyze_photo(index: int, path: Path) -> Photo:
    photo = Photo(
        index=index,
        original_path=path,
        original_file_name=path.name,
        format=path.suffix.lower().lstrip("."),
        file_size=path.stat().st_size,
    )
    try:
        with Image.open(path) as im:
            im = ImageOps.exif_transpose(im)
            photo.width, photo.height = im.size
            if photo.width == photo.height:
                photo.orientation = "square"
            elif photo.width > photo.height:
                photo.orientation = "horizontal"
            else:
                photo.orientation = "vertical"
            photo.sha256 = file_sha256(path)
            photo.dhash = dhash(im)
            photo.blur_score = edge_score(im)
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        photo.status = "rejected"
        photo.quality = "poor"
        photo.reason = f"Файл не удалось открыть: {exc}"
        photo.needs_review = True
        return photo

    megapixels = photo.width * photo.height / 1_000_000
    if photo.width < 700 or photo.height < 500:
        photo.quality = "poor"
        photo.status = "needs_review"
        photo.reason = "Маленькое исходное изображение, нужна ручная проверка."
        photo.small_source = True
    elif megapixels >= 2 and photo.file_size >= 700_000 and photo.blur_score >= 7:
        photo.quality = "good"
        photo.status = "accepted"
        photo.reason = "Технически пригодное фото кухни."
    elif megapixels >= 1 and photo.blur_score >= 4:
        photo.quality = "medium"
        photo.status = "needs_review"
        photo.reason = "Среднее техническое качество, нужна визуальная проверка."
    else:
        photo.quality = "poor"
        photo.status = "needs_review"
        photo.reason = "Низкое техническое качество или возможная размытость."

    return photo


def mark_duplicates(photos: list[Photo]) -> None:
    by_sha: dict[str, Photo] = {}
    for photo in photos:
        if photo.status == "rejected" or not photo.sha256:
            continue
        if photo.sha256 in by_sha:
            photo.status = "rejected"
            photo.duplicate_of = str(by_sha[photo.sha256].original_path)
            photo.reason = "Полный дубль файла; сохранён более ранний экземпляр."
            photo.needs_review = False
        else:
            by_sha[photo.sha256] = photo

    usable = [p for p in photos if p.status != "rejected" and p.dhash is not None]
    for i, photo in enumerate(usable):
        if photo.duplicate_of:
            continue
        for other in usable[i + 1 :]:
            if other.duplicate_of:
                continue
            if hamming(photo.dhash or 0, other.dhash or 0) <= 3:
                keep, duplicate = (photo, other)
                if (other.width * other.height, other.file_size) > (photo.width * photo.height, photo.file_size):
                    keep, duplicate = other, photo
                duplicate.status = "rejected"
                duplicate.duplicate_of = str(keep.original_path)
                duplicate.reason = "Почти дубль по perceptual hash; оставлено фото с лучшим разрешением/размером."
                duplicate.needs_review = False


def load_font(size: int) -> ImageFont.ImageFont:
    for name in ["arial.ttf", "DejaVuSans.ttf"]:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def make_contact_sheets(photos: list[Photo], per_sheet: int = 30) -> None:
    font = load_font(18)
    small_font = load_font(14)
    thumb_w, thumb_h = 360, 270
    label_h = 74
    cols = 3
    rows = math.ceil(per_sheet / cols)
    sheet_w = cols * thumb_w
    sheet_h = rows * (thumb_h + label_h)
    candidates = [p for p in photos if p.status != "rejected"]
    for sheet_index, start in enumerate(range(0, len(candidates), per_sheet), start=1):
        sheet = Image.new("RGB", (sheet_w, sheet_h), "white")
        draw = ImageDraw.Draw(sheet)
        for offset, photo in enumerate(candidates[start : start + per_sheet]):
            row, col = divmod(offset, cols)
            x, y = col * thumb_w, row * (thumb_h + label_h)
            try:
                with Image.open(photo.original_path) as im:
                    im = ImageOps.exif_transpose(im).convert("RGB")
                    im.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
                    tx = x + (thumb_w - im.width) // 2
                    ty = y + (thumb_h - im.height) // 2
                    sheet.paste(im, (tx, ty))
            except Exception:
                draw.rectangle([x, y, x + thumb_w, y + thumb_h], fill="#ddd")
            label = f"{photo.index:03d} | {photo.original_file_name}"
            meta = f"{photo.width}x{photo.height} | {photo.quality} | {photo.status}"
            draw.rectangle([x, y + thumb_h, x + thumb_w, y + thumb_h + label_h], fill="#f3f3f3")
            draw.text((x + 8, y + thumb_h + 8), label[:42], fill="#111", font=font)
            draw.text((x + 8, y + thumb_h + 38), meta, fill="#333", font=small_font)
        sheet.save(CONTACT_DIR / f"contact-sheet-{sheet_index:02d}.jpg", quality=90)


def slug_parts(*parts: str) -> str:
    text = "-".join(p for p in parts if p and p != "unknown")
    text = re.sub(r"[^a-z0-9-]+", "-", text.lower())
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "kuhnya-unknown"


def webp_copy(source: Path, target: Path, max_width: int = 1600) -> tuple[int, int, bool]:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        small_source = im.width < 1200
        if im.width > max_width:
            ratio = max_width / im.width
            new_size = (max_width, round(im.height * ratio))
            im = im.resize(new_size, Image.Resampling.LANCZOS)
        im.save(target, "WEBP", quality=82, method=6)
        return im.width, im.height, small_source


def write_csv(path: Path, rows: list[dict], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fields})


GROUPS = [
    {"n": 1, "ids": [1], "layout": "uglovaya-kuhnya", "style": "sovremennaya", "color": "belaya", "features": ["penal", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Кухня видна хорошо, но стиль и готовность проекта требуют ручной проверки.", "main": 1},
    {"n": 2, "ids": [3, 4], "layout": "uglovaya-kuhnya", "style": "neoklassika", "color": "belaya", "features": ["vstroennaya-tehnika", "derevyannaya-stoleshnica"], "confidence": "high", "review": False, "reason": "Одна угловая белая кухня с филёнчатыми фасадами, два ракурса.", "main": 3},
    {"n": 3, "ids": [5, 6, 7, 8], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "kombinacii", "features": ["matovye-fasady", "bez-ruchek", "vstroennaya-tehnika", "podsvetka", "penal"], "confidence": "medium", "review": True, "reason": "Компактная прямая кухня, часть кадров показывает монтаж/техническую нишу.", "main": 6},
    {"n": 4, "ids": [9], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "belaya", "features": ["matovye-fasady", "bez-ruchek"], "confidence": "medium", "review": True, "reason": "Один вертикальный кадр, кухня видна не полностью.", "main": 9},
    {"n": 5, "ids": [10, 11, 12, 13], "layout": "kuhnya-s-ostrovom", "style": "minimalizm", "color": "belaya", "features": ["bez-ruchek", "ostrov", "vstroennaya-tehnika", "penal"], "confidence": "medium", "review": True, "reason": "Видна островная/полуостровная зона; нужна проверка, является ли это островом.", "main": 10},
    {"n": 6, "ids": [14, 15, 16, 17, 18], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "belaya", "features": ["glyancevye-fasady", "bez-ruchek", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Серия одной прямой кухни, есть детальные кадры столешницы и мойки.", "main": 15},
    {"n": 7, "ids": [19], "layout": "uglovaya-kuhnya", "style": "sovremennaya", "color": "kombinacii", "features": ["derevyannaya-stoleshnica"], "confidence": "low", "review": True, "reason": "Кухня частично видна, один кадр.", "main": 19},
    {"n": 8, "ids": [20], "layout": "pryamaya-kuhnya", "style": "sovremennaya", "color": "kombinacii", "features": ["podsvetka", "derevyannaya-stoleshnica"], "confidence": "medium", "review": True, "reason": "Один кадр небольшой прямой кухни.", "main": 20},
    {"n": 9, "ids": [21, 22, 23, 24], "layout": "kuhnya-s-ostrovom", "style": "sovremennaya", "color": "kombinacii", "features": ["bez-ruchek", "ostrov", "otkrytye-polki", "vstroennaya-tehnika"], "confidence": "high", "review": False, "reason": "Одна кухня с островной/барной зоной и несколькими ракурсами.", "main": 22},
    {"n": 10, "ids": [25, 26], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "zelenaya", "features": ["matovye-fasady", "bez-ruchek", "do-potolka", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Кухня в процессе монтажа, требуется подтверждение финального вида.", "main": 25},
    {"n": 11, "ids": [27, 28, 29, 30, 31], "layout": "kuhnya-s-ostrovom", "style": "minimalizm", "color": "belaya", "features": ["bez-ruchek", "ostrov", "podsvetka", "penal", "vstroennaya-tehnika"], "confidence": "high", "review": False, "reason": "Одна кухня с островом, рифлёными фасадами и встроенной техникой.", "main": 29},
    {"n": 12, "ids": [32, 33, 34, 46], "layout": "uglovaya-kuhnya", "style": "skandinavskaya", "color": "zelenaya", "features": ["matovye-fasady", "otkrytye-polki", "penal", "vstroennaya-tehnika"], "confidence": "high", "review": False, "reason": "Одна зелёная угловая кухня в светлом интерьере, несколько ракурсов.", "main": 46},
    {"n": 13, "ids": [35, 36, 50, 51], "layout": "pryamaya-kuhnya", "style": "sovremennaya", "color": "kombinacii", "features": ["vstroennaya-tehnika", "penal"], "confidence": "medium", "review": True, "reason": "Фасады в защитной плёнке, финальный цвет/стиль нужно подтвердить.", "main": 36},
    {"n": 14, "ids": [37, 38], "layout": "uglovaya-kuhnya", "style": "neoklassika", "color": "bezhevaya", "features": ["penal", "vstroennaya-tehnika", "derevyannaya-stoleshnica"], "confidence": "high", "review": False, "reason": "Угловая бежевая кухня с филёнчатыми фасадами.", "main": 37},
    {"n": 15, "ids": [39, 40, 41], "layout": "uglovaya-kuhnya", "style": "sovremennaya", "color": "kombinacii", "features": ["glyancevye-fasady", "derevyannaya-stoleshnica", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Одна угловая кухня, часть кадров затемнена.", "main": 39},
    {"n": 16, "ids": [42, 43, 44, 45, 49], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "kombinacii", "features": ["bez-ruchek", "podsvetka", "vstroennaya-tehnika"], "confidence": "high", "review": False, "reason": "Одна прямая современная кухня с подсветкой и контрастными элементами.", "main": 49},
    {"n": 17, "ids": [47, 48], "layout": "uglovaya-kuhnya", "style": "minimalizm", "color": "seraya", "features": ["glyancevye-fasady", "bez-ruchek", "do-potolka", "vstroennaya-tehnika", "podsvetka"], "confidence": "high", "review": False, "reason": "Угловая кухня до потолка со встроенной техникой.", "main": 47},
    {"n": 18, "ids": [52, 53], "layout": "uglovaya-kuhnya", "style": "minimalizm", "color": "seraya", "features": ["glyancevye-fasady", "bez-ruchek", "do-potolka", "vstroennaya-tehnika"], "confidence": "high", "review": False, "reason": "Одна угловая кухня до потолка, два ракурса.", "main": 53},
    {"n": 19, "ids": [54, 55], "layout": "pryamaya-kuhnya", "style": "klassika", "color": "derevo", "features": ["podsvetka", "derevyannaya-stoleshnica"], "confidence": "medium", "review": True, "reason": "Деревянный классический внешний вид, материал фасадов не подтверждён.", "main": 54},
    {"n": 20, "ids": [56], "layout": "pryamaya-kuhnya", "style": "neoklassika", "color": "belaya", "features": ["vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Один кадр белой кухни с филёнчатыми фасадами.", "main": 56},
    {"n": 21, "ids": [57], "layout": "uglovaya-kuhnya", "style": "sovremennaya", "color": "belaya", "features": ["bez-ruchek", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Один широкоугольный кадр, кухня видна хорошо, но нужны финальные подтверждения.", "main": 57},
    {"n": 22, "ids": [58, 59], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "kombinacii", "features": ["bez-ruchek", "penal", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Кухня в процессе монтажа, часть помещения не завершена.", "main": 58},
    {"n": 23, "ids": [60, 61, 62], "layout": "uglovaya-kuhnya", "style": "loft", "color": "kombinacii", "features": ["matovye-fasady", "bez-ruchek", "do-potolka", "penal", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Угловая кухня с бетонным потолком и тёмно-деревянными элементами; стиль loft требует подтверждения.", "main": 60},
    {"n": 24, "ids": [63, 64], "layout": "uglovaya-kuhnya", "style": "sovremennaya", "color": "kombinacii", "features": ["matovye-fasady", "vstroennaya-tehnika", "derevyannaya-stoleshnica"], "confidence": "high", "review": False, "reason": "Одна угловая кухня с деревянной столешницей, два ракурса.", "main": 63},
    {"n": 25, "ids": [65, 66], "layout": "kuhnya-s-ostrovom", "style": "minimalizm", "color": "seraya", "features": ["matovye-fasady", "bez-ruchek", "do-potolka", "ostrov", "podsvetka", "vstroennaya-tehnika"], "confidence": "high", "review": False, "reason": "Серая кухня с островом, подсветкой и встроенной техникой.", "main": 66},
    {"n": 26, "ids": [67, 68], "layout": "pryamaya-kuhnya", "style": "sovremennaya", "color": "seraya", "features": ["bez-ruchek", "penal", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Кадры в процессе ремонта, финальный вид нужно подтвердить.", "main": 67},
    {"n": 27, "ids": [69], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "bezhevaya", "features": ["matovye-fasady", "bez-ruchek", "do-potolka", "penal", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Один широкоугольный кадр, планировка требует ручной проверки.", "main": 69},
    {"n": 28, "ids": [70, 71], "layout": "pryamaya-kuhnya", "style": "neoklassika", "color": "belaya", "features": ["vstroennaya-tehnika", "penal"], "confidence": "medium", "review": True, "reason": "Жилой кадр с большим количеством предметов, пригодность для каталога требует отбора.", "main": 70},
    {"n": 29, "ids": [72, 73], "layout": "uglovaya-kuhnya", "style": "minimalizm", "color": "bezhevaya", "features": ["matovye-fasady", "bez-ruchek"], "confidence": "high", "review": False, "reason": "Угловая бежевая кухня, два похожих ракурса.", "main": 73},
    {"n": 30, "ids": [74], "layout": "malenkaya-kuhnya", "style": "sovremennaya", "color": "seraya", "features": ["matovye-fasady", "ostrov"], "confidence": "medium", "review": True, "reason": "Небольшая кухня с барной/островной зоной, категория требует подтверждения.", "main": 74},
    {"n": 31, "ids": [75, 76], "layout": "pryamaya-kuhnya", "style": "sovremennaya", "color": "kombinacii", "features": ["matovye-fasady", "penal", "vstroennaya-tehnika"], "confidence": "medium", "review": True, "reason": "Фасады частично в защитной плёнке, финальный вид нужно подтвердить.", "main": 75},
    {"n": 32, "ids": [77, 78, 79], "layout": "uglovaya-kuhnya", "style": "sovremennaya", "color": "seraya", "features": ["matovye-fasady", "derevyannaya-stoleshnica"], "confidence": "medium", "review": True, "reason": "Небольшая угловая кухня, фото на этапе ремонта.", "main": 78},
    {"n": 33, "ids": [80], "layout": "uglovaya-kuhnya", "style": "minimalizm", "color": "seraya", "features": ["matovye-fasady", "bez-ruchek", "derevyannaya-stoleshnica"], "confidence": "medium", "review": True, "reason": "Один кадр небольшой угловой кухни.", "main": 80},
    {"n": 34, "ids": [81, 82, 83], "layout": "pryamaya-kuhnya", "style": "minimalizm", "color": "seraya", "features": ["glyancevye-fasady", "bez-ruchek"], "confidence": "medium", "review": True, "reason": "Серия фото среднего разрешения, нужна проверка качества.", "main": 83},
    {"n": 35, "ids": [84, 85, 86, 87, 88], "layout": "uglovaya-kuhnya", "style": "neoklassika", "color": "belaya", "features": ["vstroennaya-tehnika", "penal", "podsvetka"], "confidence": "medium", "review": True, "reason": "Среднее разрешение и встроенный штамп камеры на части фото, нужна ручная проверка.", "main": 84},
    {"n": 36, "ids": [89], "layout": "uglovaya-kuhnya", "style": "minimalizm", "color": "seraya", "features": ["glyancevye-fasady", "bez-ruchek"], "confidence": "medium", "review": True, "reason": "Один кадр среднего разрешения, нужно подтвердить пригодность.", "main": 89},
]


def apply_manual_classification(photos: list[Photo]) -> dict[int, dict]:
    by_index = {p.index: p for p in photos}
    group_by_index: dict[int, dict] = {}
    for group in GROUPS:
        clean_ids = [i for i in group["ids"] if i in by_index and by_index[i].status != "rejected"]
        if not clean_ids:
            continue
        slug_base = slug_parts(group["layout"], group["style"], group["color"])
        group_id = f"portfolio-{slug_parts(group['layout'], group['style'] if group['style'] != 'unknown' else group['color'])}-{group['n']:03d}"
        group["groupId"] = group_id
        group["cleanIds"] = clean_ids
        for role_index, photo_id in enumerate(clean_ids):
            photo = by_index[photo_id]
            group_by_index[photo_id] = group
            photo.project_group_id = group_id
            photo.layout_type = group["layout"]
            photo.style = group["style"]
            photo.color = group["color"]
            photo.visible_features = list(group["features"])
            photo.material = "unknown"
            photo.confidence = group["confidence"]
            photo.needs_review = bool(group["review"])
            if photo.needs_review and photo.status == "accepted":
                photo.status = "needs_review"
            photo.reason = group["reason"]
            if photo_id == group["main"]:
                role = "main"
            elif role_index == 1:
                role = "side"
            elif any(word in photo.original_file_name.lower() for word in ["close", "detail"]):
                role = "detail"
            elif photo.orientation == "vertical" and len(clean_ids) > 2:
                role = f"extra-{role_index:02d}"
            else:
                role = "detail" if role_index > 1 else "side"
            photo.role = role
            photo.new_file_name = f"{slug_base}-{group['n']:03d}-{role}.webp"
            if role != "main":
                stem = photo.new_file_name.removesuffix(".webp")
                photo.new_file_name = f"{stem}-{photo.index:03d}.webp"
            photo.alt = build_alt(photo)
    for photo in photos:
        if photo.status == "rejected" and photo.duplicate_of:
            photo.new_file_name = f"rejected-duplicate-{photo.index:03d}.webp"
            photo.prepared_path = str(OUTPUT_DIR / "rejected" / photo.new_file_name)
    return group_by_index


def build_alt(photo: Photo) -> str:
    layout_text = {
        "uglovaya-kuhnya": "Угловая",
        "pryamaya-kuhnya": "Прямая",
        "p-obraznaya-kuhnya": "П-образная",
        "kuhnya-s-ostrovom": "Кухня с островом",
        "malenkaya-kuhnya": "Маленькая",
        "kuhnya-do-potolka": "Кухня до потолка",
        "kuhnya-bez-ruchek": "Кухня без ручек",
    }.get(photo.layout_type, "Кухня")
    color_text = {
        "belaya": "белая",
        "seraya": "серая",
        "bezhevaya": "бежевая",
        "chernaya": "чёрная",
        "derevo": "с деревянными фасадами",
        "zelenaya": "зелёная",
        "sinyaya": "синяя",
        "kombinacii": "комбинированная",
    }.get(photo.color, "")
    style_text = {
        "sovremennaya": "в современном стиле",
        "minimalizm": "в стиле минимализм",
        "klassika": "в классическом стиле",
        "neoklassika": "в стиле неоклассика",
        "loft": "в стиле лофт",
        "skandinavskaya": "в скандинавском стиле",
        "hay-tek": "в стиле хай-тек",
        "provans": "в стиле прованс",
    }.get(photo.style, "")
    feature_text = ""
    if photo.role == "detail":
        if "podsvetka" in photo.visible_features:
            feature_text = " с подсветкой рабочей зоны"
        elif "derevyannaya-stoleshnica" in photo.visible_features:
            feature_text = " с деревянной столешницей"
    elif "do-potolka" in photo.visible_features and photo.layout_type not in ["kuhnya-do-potolka"]:
        feature_text = " до потолка"
    elif "bez-ruchek" in photo.visible_features and photo.layout_type not in ["kuhnya-bez-ruchek"]:
        feature_text = " без ручек"
    pieces = [layout_text, color_text, "кухня", style_text]
    text = " ".join(p for p in pieces if p).replace("Кухня кухня", "Кухня")
    return f"{text}{feature_text}".strip()


def prepare_copies(photos: list[Photo]) -> None:
    for photo in photos:
        if photo.status == "rejected":
            if not photo.new_file_name:
                photo.new_file_name = f"rejected-{photo.index:03d}.webp"
            target = OUTPUT_DIR / "rejected" / photo.new_file_name
        elif photo.needs_review:
            target = OUTPUT_DIR / "needs-review" / photo.new_file_name
        else:
            target = OUTPUT_DIR / "portfolio" / photo.new_file_name
        try:
            _, _, small = webp_copy(photo.original_path, target)
            photo.prepared_path = str(target)
            photo.small_source = photo.small_source or small
        except Exception as exc:
            photo.status = "rejected"
            photo.reason = f"Не удалось подготовить webp-копию: {exc}"
            photo.prepared_path = ""


def copy_selected_to_section(path_text: str, section: str) -> str:
    if not path_text:
        return ""
    source = Path(path_text)
    target = OUTPUT_DIR / section / source.name
    if not target.exists() and source.exists():
        target.write_bytes(source.read_bytes())
    return str(target)


def group_rows(photos: list[Photo]) -> list[dict]:
    by_index = {p.index: p for p in photos}
    rows = []
    for group in GROUPS:
        ids = [i for i in group.get("cleanIds", []) if i in by_index]
        if not ids:
            continue
        main = by_index.get(group["main"], by_index[ids[0]])
        images = [by_index[i].prepared_path for i in ids if by_index[i].prepared_path]
        rows.append(
            {
                "projectGroupId": group["groupId"],
                "mainImage": main.prepared_path,
                "images": "|".join(images),
                "layoutType": group["layout"],
                "style": group["style"],
                "color": group["color"],
                "material": "unknown",
                "confidence": group["confidence"],
                "needs_review": str(bool(group["review"])).lower(),
                "reason": group["reason"],
            }
        )
    return rows


def select_groups(layout: str | None = None, style: str | None = None, feature: str | None = None, limit: int = 6) -> list[dict]:
    matches = []
    for group in GROUPS:
        if not group.get("cleanIds"):
            continue
        if layout and group["layout"] != layout:
            continue
        if style and group["style"] != style:
            continue
        if feature and feature not in group["features"] and group["layout"] != feature:
            continue
        matches.append(group)
    matches.sort(key=lambda g: (g["review"], {"high": 0, "medium": 1, "low": 2}.get(g["confidence"], 3), g["n"]))
    return matches[:limit]


def mapping_rows(photos: list[Photo], kind: str) -> list[dict]:
    by_index = {p.index: p for p in photos}
    if kind == "catalog":
        configs = [
            ("/catalog/uglovye-kuhni", "Угловые кухни", {"layout": "uglovaya-kuhnya"}),
            ("/catalog/pryamye-kuhni", "Прямые кухни", {"layout": "pryamaya-kuhnya"}),
            ("/catalog/p-obraznye-kuhni", "П-образные кухни", {"layout": "p-obraznaya-kuhnya"}),
            ("/catalog/kuhni-s-ostrovom", "Кухни с островом", {"layout": "kuhnya-s-ostrovom"}),
            ("/catalog/malenkie-kuhni", "Маленькие кухни", {"layout": "malenkaya-kuhnya"}),
            ("/catalog/kuhni-do-potolka", "Кухни до потолка", {"feature": "do-potolka"}),
            ("/catalog/kuhni-bez-ruchek", "Кухни без ручек", {"feature": "bez-ruchek"}),
        ]
        url_field, name_field = "categoryUrl", "categoryName"
    elif kind == "style":
        configs = [
            ("/styles/sovremennye", "Современные кухни", {"style": "sovremennaya"}),
            ("/styles/minimalizm", "Кухни в стиле минимализм", {"style": "minimalizm"}),
            ("/styles/klassicheskie", "Классические кухни", {"style": "klassika"}),
            ("/styles/neoklassika", "Кухни в стиле неоклассика", {"style": "neoklassika"}),
            ("/styles/loft", "Кухни в стиле лофт", {"style": "loft"}),
            ("/styles/skandinavskie", "Скандинавские кухни", {"style": "skandinavskaya"}),
        ]
        url_field, name_field = "styleUrl", "styleName"
    else:
        configs = [
            ("/materials/mdf-emal", "Кухни из МДФ эмаль", {}),
            ("/materials/ldsp", "Кухни из ЛДСП", {}),
            ("/materials/plastik-hpl", "Кухни из пластика HPL", {}),
            ("/materials/akril", "Акриловые кухни", {}),
            ("/materials/shpon", "Кухни из шпона", {}),
        ]
        url_field, name_field = "materialUrl", "materialName"

    rows = []
    for url, name, filters in configs:
        groups = [] if kind == "material" else select_groups(**filters, limit=6)
        main = ""
        add = []
        alt = ""
        confidence = "low"
        needs_review = True
        if groups:
            main_photo = by_index[groups[0]["main"]]
            main = copy_selected_to_section(main_photo.prepared_path, kind if kind != "style" else "styles")
            alt = main_photo.alt
            for group in groups[1:6]:
                add_photo = by_index[group["main"]]
                add.append(copy_selected_to_section(add_photo.prepared_path, kind if kind != "style" else "styles"))
            confidence = groups[0]["confidence"]
            needs_review = any(bool(g["review"]) for g in groups)
        rows.append(
            {
                url_field: url,
                name_field: name,
                "mainImage": main,
                "additionalImages": "|".join(a for a in add if a),
                "alt": alt,
                "confidence": confidence,
                "needs_review": str(needs_review).lower(),
            }
        )
    return rows


def portfolio_rows(photos: list[Photo]) -> list[dict]:
    by_index = {p.index: p for p in photos}
    rows = []
    for group in GROUPS:
        ids = group.get("cleanIds", [])
        if not ids:
            continue
        main = by_index[group["main"]]
        slug = group["groupId"].replace("portfolio-", "")
        title = build_title(group)
        rows.append(
            {
                "projectGroupId": group["groupId"],
                "suggestedSlug": slug,
                "suggestedTitle": title,
                "mainImage": main.prepared_path,
                "images": "|".join(by_index[i].prepared_path for i in ids if by_index[i].prepared_path),
                "layoutType": group["layout"],
                "style": group["style"],
                "color": group["color"],
                "material": "unknown",
                "city": "",
                "priceFrom": "",
                "days": "",
                "description": "",
                "task": "",
                "solution": "",
                "result": "",
                "confidence": group["confidence"],
                "needs_review": str(bool(group["review"])).lower(),
            }
        )
    return rows


def build_title(group: dict) -> str:
    layout = {
        "uglovaya-kuhnya": "Угловая кухня",
        "pryamaya-kuhnya": "Прямая кухня",
        "p-obraznaya-kuhnya": "П-образная кухня",
        "kuhnya-s-ostrovom": "Кухня с островом",
        "malenkaya-kuhnya": "Маленькая кухня",
    }.get(group["layout"], "Кухня")
    color = {
        "belaya": "белая",
        "seraya": "серая",
        "bezhevaya": "бежевая",
        "chernaya": "чёрная",
        "derevo": "под дерево",
        "zelenaya": "зелёная",
        "kombinacii": "комбинированная",
    }.get(group["color"], "")
    style = {
        "sovremennaya": "в современном стиле",
        "minimalizm": "в стиле минимализм",
        "klassika": "в классическом стиле",
        "neoklassika": "в стиле неоклассика",
        "loft": "в стиле лофт",
        "skandinavskaya": "в скандинавском стиле",
    }.get(group["style"], "")
    return " ".join(part for part in [layout, color, style] if part)


def write_all_reports(photos: list[Photo]) -> None:
    write_csv(
        REPORT_DIR / "photo-inventory.csv",
        [
            {
                "originalPath": str(p.original_path),
                "originalFileName": p.original_file_name,
                "status": p.status,
                "width": p.width,
                "height": p.height,
                "fileSize": p.file_size,
                "format": p.format,
                "quality": p.quality,
                "duplicateOf": p.duplicate_of,
                "reason": p.reason,
            }
            for p in photos
        ],
        ["originalPath", "originalFileName", "status", "width", "height", "fileSize", "format", "quality", "duplicateOf", "reason"],
    )
    write_csv(
        REPORT_DIR / "photo-classification.csv",
        [
            {
                "originalPath": str(p.original_path),
                "preparedPath": p.prepared_path,
                "newFileName": p.new_file_name,
                "layoutType": p.layout_type,
                "style": p.style,
                "color": p.color,
                "material": p.material,
                "visibleFeatures": "|".join(p.visible_features),
                "confidence": p.confidence,
                "needs_review": str(p.needs_review).lower(),
                "reason": p.reason,
                "alt": p.alt,
            }
            for p in photos
            if p.status != "rejected"
        ],
        ["originalPath", "preparedPath", "newFileName", "layoutType", "style", "color", "material", "visibleFeatures", "confidence", "needs_review", "reason", "alt"],
    )
    write_csv(REPORT_DIR / "project-groups.csv", group_rows(photos), ["projectGroupId", "mainImage", "images", "layoutType", "style", "color", "material", "confidence", "needs_review", "reason"])
    write_csv(REPORT_DIR / "catalog-image-mapping.csv", mapping_rows(photos, "catalog"), ["categoryUrl", "categoryName", "mainImage", "additionalImages", "alt", "confidence", "needs_review"])
    write_csv(REPORT_DIR / "style-image-mapping.csv", mapping_rows(photos, "style"), ["styleUrl", "styleName", "mainImage", "additionalImages", "alt", "confidence", "needs_review"])
    write_csv(REPORT_DIR / "material-image-mapping.csv", mapping_rows(photos, "material"), ["materialUrl", "materialName", "mainImage", "additionalImages", "alt", "confidence", "needs_review"])
    write_csv(REPORT_DIR / "portfolio-draft-mapping.csv", portfolio_rows(photos), ["projectGroupId", "suggestedSlug", "suggestedTitle", "mainImage", "images", "layoutType", "style", "color", "material", "city", "priceFrom", "days", "description", "task", "solution", "result", "confidence", "needs_review"])
    write_report_md(photos)


def write_report_md(photos: list[Photo]) -> None:
    accepted = [p for p in photos if p.status == "accepted"]
    rejected = [p for p in photos if p.status == "rejected"]
    review = [p for p in photos if p.status == "needs_review" or p.needs_review]
    duplicates = [p for p in photos if p.duplicate_of]
    catalog = mapping_rows(photos, "catalog")
    lines = [
        "# Отчёт по подготовке фотографий кухонь",
        "",
        "Этап 4.1 выполнен локально: сайт, база данных, каталог, sitemap, production-страницы и Excel-импорт не изменялись.",
        "",
        "## Итоги",
        f"- Найдено фото: {len(photos)}",
        f"- Принято без обязательной проверки: {len(accepted)}",
        f"- Отклонено: {len(rejected)}",
        f"- Дубли / почти дубли: {len(duplicates)}",
        f"- Групп проектов: {len([g for g in GROUPS if g.get('cleanIds')])}",
        f"- Требует ручной проверки: {len(review)}",
        "",
        "## Выбор для каталога",
    ]
    for row in catalog:
        main = Path(row["mainImage"]).name if row["mainImage"] else "не выбрано"
        lines.append(f"- {row['categoryUrl']}: {main}; confidence={row['confidence']}; needs_review={row['needs_review']}")
    lines.extend(
        [
            "",
            "## Что нельзя определить по фото достоверно",
            "- Материал фасадов: МДФ, ЛДСП, эмаль, акрил, пластик/HPL, шпон или массив без подтверждения владельца не назначались.",
            "- Город, адрес, цена, срок изготовления, дата выполнения и отзывы не определялись по изображениям.",
            "- Для фото в защитной плёнке или на этапе монтажа финальный цвет/стиль нужно подтвердить вручную.",
            "- Часть островных/барных зон помечена `needs_review=true`, если по ракурсу нельзя строго отличить остров от полуострова.",
            "",
            "## Что подтвердить вручную",
            "- Проверить все строки с `needs_review=true` в `photo-classification.csv` и `project-groups.csv`.",
            "- Подтвердить материалы для страниц `/materials/*`; сейчас mapping по материалам оставлен без фото.",
            "- Подтвердить, какие монтажные фото использовать в портфолио, а какие оставить только как внутренний архив.",
            "- Проверить средние по разрешению фото `photo_2026-*` и кадры со штампом камеры перед публикацией.",
        ]
    )
    (REPORT_DIR / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    ensure_dirs()
    photos = [analyze_photo(i, path) for i, path in enumerate(iter_images(SOURCE_DIR), start=1)]
    mark_duplicates(photos)
    apply_manual_classification(photos)
    prepare_copies(photos)
    make_contact_sheets(photos)
    write_all_reports(photos)
    print(f"Analyzed {len(photos)} images")
    print(f"Contact sheets: {CONTACT_DIR}")
    print(f"Reports: {REPORT_DIR}")


if __name__ == "__main__":
    main()
