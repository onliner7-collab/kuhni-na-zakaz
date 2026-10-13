'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useExploreContext } from '@/components/exploration';
import { ContactForm } from '@/components/sections/ContactForm';
import { CEILING_ROUTE, ceilingIdeas, ceilingRooms } from './ceiling-data';
import s from './ceiling.module.css';

type Choice = { idea: string; room: string; height: string; shape: string; ceiling: string; construction: string; budget: string };
const initial: Choice = { idea: '', room: 'newbuild', height: '', shape: 'Угловая', ceiling: 'Пока не знаю', construction: 'Антресоли', budget: 'Сравнить комплектации' };
const Selection = createContext<{ choice: Choice; change: (patch: Partial<Choice>, action: string) => void } | null>(null);
const eventName = 'ceiling-kitchen-answers';
const roomFor = (id: string) => ceilingRooms.find(room => room.id === id) ?? ceilingRooms[0];
function useSelection() { const value = useContext(Selection); if (!value) throw new Error('Не найден подбор кухни'); return value; }

export function CeilingKitchenSelection({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Choice>(initial);
  const { updateContext } = useExploreContext();
  function change(patch: Partial<Choice>, action: string) {
    const next = { ...choice, ...patch };
    setChoice(next);
    updateContext({ layout: next.shape, scenario: `${roomFor(next.room).label}; ${next.construction}`, budgetIntent: next.budget }, action);
  }
  useEffect(() => { window.dispatchEvent(new CustomEvent(eventName, { detail: { sourceRoute: CEILING_ROUTE, ...choice, roomLabel: roomFor(choice.room).label, selectedIdea: ceilingIdeas.find(item => item.id === choice.idea)?.title || 'Пока не выбрана' } })); }, [choice]);
  return <Selection.Provider value={{ choice, change }}>{children}</Selection.Provider>;
}

export function CeilingGallery() {
  const { choice, change } = useSelection();
  const [shape, setShape] = useState('Все');
  const [finish, setFinish] = useState('Все');
  const [showAll, setShowAll] = useState(false);
  const [preview, setPreview] = useState(ceilingIdeas[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = ceilingIdeas.filter(item => (shape === 'Все' || item.shape === shape) && (finish === 'Все' || item.finish === finish));
  const visible = showAll ? filtered : filtered.slice(0, 6);
  function choose(id: string) {
    const item = ceilingIdeas.find(idea => idea.id === id)!;
    change({ idea: id, shape: item.shape, construction: item.tier === 'Два яруса' ? 'Антресоли' : item.tier }, `ceiling-idea:${id}`);
  }
  return <section id="variants" className={s.section} aria-labelledby="ceiling-gallery-title" data-testid="ceiling-gallery">
    <div className={s.sectionHead}><div><p className={s.eyebrow}>Выберите основу проекта</p><h2 id="ceiling-gallery-title" className={s.heading}>Какую кухню до потолка вы хотите купить?</h2></div><p className={s.count} role="status">{filtered.length} вариантов</p></div>
    <p className={s.sub}>Прямые и угловые кухни, высокие шкафы и отдельные антресоли. Каждый пример можно обсудить по вашим размерам.</p>
    <div className={s.filters}>
      <label className={s.field}>Планировка<select aria-label="Планировка" value={shape} onChange={event => { setShape(event.target.value); setShowAll(true); }}><option>Все</option><option>Прямая</option><option>Угловая</option><option>П-образная</option></select></label>
      <label className={s.field}>Внешний вид<select aria-label="Внешний вид" value={finish} onChange={event => { setFinish(event.target.value); setShowAll(true); }}><option>Все</option><option>Светлые</option><option>Под дерево</option><option>Графитовые</option><option>Цветные</option></select></label>
      <button className={s.secondary} type="button" onClick={() => { setShape('Все'); setFinish('Все'); setShowAll(true); }}>Все варианты</button>
    </div>
    <div className={s.grid}>{ceilingIdeas.map(item => <article id={`idea-${item.id}`} key={item.id} hidden={!visible.includes(item)} className={`${s.card} ${choice.idea === item.id ? s.selected : ''}`}>
      <button type="button" className={s.imageButton} aria-label={`Увеличить: ${item.title}`} onClick={() => { setPreview(item); dialog.current?.showModal(); }}><img className={s.photo} src={item.src} alt={item.alt} width={1200} height={800} loading="lazy" decoding="async" /><span className={s.badge}>Пример дизайна</span></button>
      <div className={s.cardBody}><h3 className={s.cardTitle}>{item.title}</h3><div className={s.tags}><span className={s.tag}>{item.shape}</span><span className={s.tag}>{item.tier}</span><span className={s.tag}>{item.finish}</span></div><p className={s.cardNote}>{item.note}</p><button type="button" aria-pressed={choice.idea === item.id} className={`${s.secondary} ${s.full}`} onClick={() => choose(item.id)}>{choice.idea === item.id ? '✓ Выбрана для расчёта' : 'Выбрать для расчёта'}</button></div>
    </article>)}</div>
    {!filtered.length && <div className={s.empty}><p>Такого сочетания среди примеров пока нет. Посмотрите все варианты или опишите пожелания в заявке.</p><button type="button" className={s.secondary} onClick={() => { setShape('Все'); setFinish('Все'); }}>Сбросить фильтры</button></div>}
    {!showAll && filtered.length > 6 && <div className={s.actions}><button type="button" className={s.secondary} onClick={() => setShowAll(true)}>Показать ещё {filtered.length - 6} кухни</button></div>}
    <p className={s.smallPrint}>Изображения — визуализации и примеры дизайна, а не подтверждённые выполненные заказы. Материалы, размеры и техника согласуются отдельно.</p>
    <dialog ref={dialog} className={s.dialog} aria-labelledby="ceiling-preview-title"><div className={s.dialogHead}><h2 id="ceiling-preview-title" className={s.cardTitle}>{preview.title}</h2><button type="button" className={s.secondary} onClick={() => dialog.current?.close()}>Закрыть</button></div><img src={preview.src} alt={preview.alt} width={1200} height={800} /><p>{preview.note} Пример дизайна для обсуждения проекта.</p><div className={s.actions}><button type="button" className={s.button} onClick={() => { choose(preview.id); dialog.current?.close(); }}>Выбрать эту кухню</button></div></dialog>
  </section>;
}

const constructions = [
  { name: 'Высокие шкафы', description: 'Один высокий фасад. Верхние полки остаются зоной редкого доступа.', check: 'Вес фасада, допустимые размеры и совместимость петель.', photo: 'handleless' },
  { name: 'Антресоли', description: 'Отдельный верхний ряд. Ежедневное и сезонное хранение разделены дверцами.', check: 'Глубина ярусов, открывание и нагрузка на крепления.', photo: 'straight' },
  { name: 'Добор', description: 'Планка закрывает зазор над шкафом. Дополнительного хранения за ней нет.', check: 'Перепад потолка, монтаж и доступ к коммуникациям.', photo: 'warm' },
];

function CabinetScheme({ kind }: { kind: string }) {
  return <svg viewBox="0 0 560 310" className={s.scheme} role="img" aria-labelledby="ceiling-scheme-title ceiling-scheme-desc"><title id="ceiling-scheme-title">{`Схема: ${kind}`}</title><desc id="ceiling-scheme-desc">{kind === 'Антресоли' ? 'Отдельный верхний ряд шкафов над ежедневной зоной.' : kind === 'Добор' ? 'Глухая планка над верхними шкафами, без хранения.' : 'Высокий шкаф с единым фасадом до верхней линии.'} Размеры условные.</desc>
    <path d="M45 40H515" stroke="#78716c" strokeWidth="4" /><text x="280" y="25" textAnchor="middle" fill="#57534e" fontSize="17">Потолок</text>
    {[0,1,2].map(index => <g key={index}><rect x={60+index*145} y={kind === 'Добор' ? 88 : 52} width="140" height={kind === 'Добор' ? 125 : 161} fill="#ded6c7" stroke="#78716c" strokeWidth="2" />{kind === 'Антресоли' && <><rect x={60+index*145} y="52" width="140" height="53" fill="#bbcfbd" stroke="#78716c" strokeWidth="2" /><path d={`M${75+index*145} 93h25`} stroke="#57534e" strokeWidth="3" /></>}{kind === 'Добор' && <rect x={60+index*145} y="52" width="140" height="34" fill="#bd9e73" stroke="#78716c" strokeWidth="2" />}<path d={`M${75+index*145} 194h25`} stroke="#57534e" strokeWidth="3" /><rect x={60+index*145} y="250" width="140" height="40" fill="#f1ebe0" stroke="#78716c" strokeWidth="2" /></g>)}
    <path d="M55 244H500" stroke="#78716c" strokeWidth="7" /><text x="280" y="232" textAnchor="middle" fill="#57534e" fontSize="15">Схема конструкции, без масштаба</text>
  </svg>;
}

export function CeilingConstruction() {
  const { choice, change } = useSelection();
  const selected = constructions.find(item => item.name === choice.construction) ?? constructions[1];
  const photo = ceilingIdeas.find(item => item.id === selected.photo)!;
  return <section id="construction" className={s.section} aria-labelledby="ceiling-construction-title"><p className={s.eyebrow}>Три разных решения</p><h2 id="ceiling-construction-title" className={s.heading}>Высокие шкафы, антресоли или добор?</h2><div className={s.choices} role="group" aria-label="Конструкция верхних шкафов">{constructions.map(item => <button key={item.name} type="button" className={s.choice} aria-pressed={selected.name === item.name} onClick={() => change({ construction: item.name }, `ceiling-construction:${item.name}`)}><strong>{item.name}</strong><span>{item.description}</span></button>)}</div><div className={`${s.split} ${s.result}`}><figure className={s.figure}><img src={photo.src} alt={photo.alt} className={s.photo} width={1200} height={800} loading="lazy" /><figcaption className={s.caption}>Пример внешнего вида. Разницу конструкции показывает схема.</figcaption></figure><div className={s.panel}><CabinetScheme kind={selected.name} /><p role="status">{selected.description}</p><div className={s.check}><strong>До заказа проверяем:</strong> {selected.check}</div></div></div></section>;
}

export function CeilingRoomPlanner() {
  const { choice, change } = useSelection();
  const room = roomFor(choice.room);
  const height = Number(choice.height.replace(',', '.'));
  const invalid = choice.height !== '' && (!Number.isFinite(height) || height < 200 || height > 450);
  const recommendation = choice.shape === 'Прямая' ? ceilingIdeas[choice.construction === 'Добор' ? 5 : 1] : choice.shape === 'П-образная' ? ceilingIdeas[room.id === 'small' ? 2 : 7] : room.id === 'small' ? ceilingIdeas[6] : ceilingIdeas[0];
  return <section id="planner" className={s.section} aria-labelledby="ceiling-planner-title" data-testid="ceiling-planner"><p className={s.eyebrow}>Под ваше помещение</p><h2 id="ceiling-planner-title" className={s.heading}>Квартира, загородный дом или дача?</h2><div className={s.tabs} role="group" aria-label="Тип помещения">{ceilingRooms.map(item => <button key={item.id} type="button" className={s.tab} aria-pressed={room.id === item.id} onClick={() => change({ room: item.id }, `ceiling-room:${item.id}`)}>{item.label}</button>)}</div><div className={s.split}><figure className={s.figure}><img key={room.id} className={s.photo} src={room.image} alt={room.alt} width={1200} height={800} loading="lazy" /><figcaption className={s.caption}>Визуализация решения для обсуждения планировки.</figcaption></figure><div className={s.panel}><h3 className={s.roomTitle}>{room.title}</h3><p>{room.copy}</p><div className={s.check}><strong>Проверить:</strong> {room.check}</div><div className={s.filters}>
      <label className={s.field}>Высота потолка, см<input type="text" inputMode="decimal" maxLength={5} placeholder="Например, 270" value={choice.height} onChange={event => change({ height: event.target.value }, 'ceiling-height')} aria-invalid={invalid} aria-describedby="ceiling-height-help" /></label>
      <label className={s.field}>Форма кухни<select aria-label="Форма кухни" value={choice.shape} onChange={event => change({ shape: event.target.value }, 'ceiling-shape')}><option>Прямая</option><option>Угловая</option><option>П-образная</option></select></label>
      <label className={s.field}>Потолок<select aria-label="Потолок" value={choice.ceiling} onChange={event => change({ ceiling: event.target.value }, 'ceiling-type')}><option>Пока не знаю</option><option>Окрашенный</option><option>Натяжной</option><option>Деревянный или с балками</option></select></label>
    </div><p id="ceiling-height-help" className={s.smallPrint}>{invalid ? 'Для подбора введите высоту от 200 до 450 см. Для другой высоты опишите помещение в заявке.' : 'Предварительная высота помогает начать обсуждение. Замерьте её в нескольких точках.'}</p><div className={s.result} aria-live="polite"><strong>Направление для сравнения</strong><p>{recommendation.title}. {choice.construction === 'Добор' ? 'Добор завершает верхнюю линию без дополнительного хранения.' : `Сравните ${choice.construction.toLowerCase()} и удобство верхнего доступа.`} {choice.height && !invalid && height >= 300 ? 'При большой высоте отдельно оцените доступ к верхним полкам.' : 'Высоту и деление секций определим по точному замеру.'} {choice.ceiling === 'Натяжной' ? 'Примыкание и порядок монтажа согласуйте с мастером потолка.' : ''}</p><img className={s.resultImage} src={recommendation.src} alt={recommendation.alt} width={1200} height={800} loading="lazy" /><button type="button" className={s.secondary} disabled={invalid} onClick={() => change({ idea: recommendation.id }, `ceiling-recommendation:${recommendation.id}`)}>Выбрать этот пример</button><a href="#form" className={s.button}>Передать параметры на расчёт</a><p className={s.smallPrint}>Это подбор идей, а не расчёт размеров шкафов или допуск к монтажу.</p></div></div></div></section>;
}

export function CeilingBudgetChoice() {
  const { choice, change } = useSelection();
  const affordable = choice.budget === 'Практичная комплектация';
  return <div className={s.panel}><h3 className={s.cardTitle}>Что важнее в комплектации?</h3><div className={s.tabs} role="group" aria-label="Приоритет комплектации">{['Практичная комплектация', 'Больше хранения', 'Сравнить комплектации'].map(value => <button type="button" key={value} className={s.tab} aria-pressed={choice.budget === value} onClick={() => change({ budget: value }, `ceiling-budget:${value}`)}>{value}</button>)}</div><img className={s.priceImage} src={ceilingIdeas[affordable ? 5 : 0].src} alt={ceilingIdeas[affordable ? 5 : 0].alt} width={1200} height={800} loading="lazy" /><p role="status">{affordable ? 'Для недорогой кухни сравните простую планировку, фасады ЛДСП и доступные покрытия МДФ. Количество ящиков и верхних секций согласуйте со списком вещей.' : choice.budget === 'Больше хранения' ? 'Сравните отдельные антресоли, пеналы и дополнительные ящики. Учитывайте не только объём, но и удобство доступа.' : 'Попросите две сметы на одинаковую планировку с разными фасадами и фурнитурой. Так будет видно, за что вы доплачиваете.'}</p><p className={s.smallPrint}>Фото показывает идею внешнего вида. Материал фасадов нельзя определить по изображению.</p></div>;
}

export function CeilingRequest() {
  const { choice } = useSelection();
  const idea = ceilingIdeas.find(item => item.id === choice.idea);
  const room = roomFor(choice.room);
  const numeric = Number(choice.height.replace(',', '.'));
  const heightValid = choice.height !== '' && Number.isFinite(numeric) && numeric >= 200 && numeric <= 450;
  const dimensions = heightValid ? `Высота потолка ${choice.height} см` : '';
  const comment = `Кухня до потолка: ${idea?.title || 'помогите выбрать вариант'}. Помещение: ${room.label}. Конструкция: ${choice.construction}. Потолок: ${choice.ceiling}. Приоритет: ${choice.budget}.`;
  return <section id="form" className={`${s.section} ${s.request}`} aria-labelledby="ceiling-request-title"><div className={s.requestIntro}><p className={s.eyebrow} style={{ color: '#fcd34d' }}>Купить кухню по вашим размерам</p><h2 id="ceiling-request-title" className={s.heading}>Рассчитать кухню до потолка</h2><p>Оставьте контакт и населённый пункт. Уточним планировку, комплектацию и данные для расчёта.</p><div className={s.summary} data-testid="ceiling-selection-summary"><strong>{idea?.title || 'Вариант кухни пока не выбран'}</strong><br />{room.label} · {choice.shape}<br />{choice.construction} · {heightValid ? `${choice.height} см` : 'Высоту уточним'}<br />{choice.budget}</div><p>Можно указать деревню, агрогородок, район или садовое товарищество. Условия замера, доставки и монтажа согласуем по адресу.</p></div><div className={s.form}><ContactForm source="catalog" sourcePage={CEILING_ROUTE} sourceType="catalog-ceiling" formType="ceiling-kitchen-calculation" formLocation="ceiling-final" submitLabel="Отправить на расчёт" defaultKitchenType="До потолка" defaultDimensions={dimensions} defaultComment={comment} defaultAnswers={{ ...choice, selectedIdea: idea?.title || '', roomLabel: room.label }} answersEventName={eventName} city="" cityLabel="Город, деревня или СТ и район" showCity showDimensions showComment showHasMeasurements /></div></section>;
}
