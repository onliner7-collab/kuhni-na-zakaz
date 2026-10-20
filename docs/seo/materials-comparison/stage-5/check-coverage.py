"""Document topic ownership and validate implementation anchors, not keyword density."""
import csv
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
HERE=Path(__file__).resolve().parent
sources=[ROOT/'artifacts/kuhni-na-zakaz/app/materials/plastik-hpl/page.tsx',ROOT/'artifacts/kuhni-na-zakaz/components/materials/HplVisualJourney.tsx']
code='\n'.join(p.read_text(encoding='utf8') for p in sources)
with (HERE/'semantics.csv').open(encoding='utf8',newline='') as f: rows=list(csv.DictReader(f))
out=[]
for r in rows:
    anchor=r['targetBlock'][1:]
    assert f'id="{anchor}"' in code,anchor
    mode='Тема раскрыта; точные услуги/технологии/свойства — только после согласования'
    if r['cluster']=='Цена и состав': mode='Состав и метод расчёта раскрыты; числовая вилка не заявлена'
    if r['cluster']=='Выбор и сравнение': mode='Сравнение исполнений; проверяемые отзывы не подменяются ИИ'
    out.append(dict(query=r['query'],cluster=r['cluster'],ownerRoute=r['ownerRoute'],targetBlock=r['targetBlock'],coverage='semantic',implementationNote=mode))
with (HERE/'semantic-coverage.csv').open('w',encoding='utf8',newline='') as f:
    writer=csv.DictWriter(f,list(out[0]),quoting=csv.QUOTE_ALL);writer.writeheader();writer.writerows(out)
assert len(out)==164
print(f'{len(out)} candidates mapped to existing anchors; metric fields unchanged')
