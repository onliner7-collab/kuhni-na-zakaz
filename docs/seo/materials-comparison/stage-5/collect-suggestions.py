"""Public autocomplete evidence; no accounts, cookies or search-console data."""
import concurrent.futures
import datetime
import json
from pathlib import Path
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent
SEEDS = ['кухни из пластика', 'кухни HPL', 'фасады HPL', 'пластиковые фасады для кухни', 'пластик или акрил кухня', 'кухни из пластика Минск', 'кухня HPL кромка', 'кухня из пластика для дачи']

def fetch(pair):
    engine, seed = pair
    query = urllib.parse.urlencode({'client': 'firefox', 'hl': 'ru', 'q': seed})
    url = 'https://suggestqueries.google.com/complete/search?' + query if engine == 'Google' else 'https://suggest.yandex.ru/suggest-ya.cgi?' + urllib.parse.urlencode({'v': 4, 'part': seed, 'lr': 157})
    record = {'engine': engine, 'seed': seed, 'url': url, 'checkedAt': '2026-10-20', 'region': 'Google: hl=ru, регион не задан; Yandex: lr=157 запрошен, применение не подтверждено', 'device': 'HTTP autocomplete, не SERP устройства'}
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=18) as response:
            payload = json.loads(response.read().decode('utf-8'))
        record['rawResponse'] = payload
        record['suggestions'] = [x if isinstance(x, str) else x[1] for x in payload[1]] if isinstance(payload, list) and len(payload) > 1 else []
        record['status'] = 'ok'
    except Exception as exc:
        record.update(status='error', error=str(exc), suggestions=[])
    return record

if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        records = list(pool.map(fetch, [(e, s) for e in ['Google', 'Yandex'] for s in SEEDS]))
    (ROOT / 'suggestions-evidence.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps([{'engine': r['engine'], 'seed': r['seed'], 'status': r['status'], 'suggestions': r['suggestions']} for r in records], ensure_ascii=False))
