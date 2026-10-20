import fs from 'node:fs';
import path from 'node:path';
const roots=[process.cwd(),'C:/Users/User/Desktop/kuhni-hpl-20261020'];
const header='## 2026-10-20 — HPL: содержание и иллюстрации';
const entries={
 'docs/11_PAGE_REGISTRY.md':'/materials/plastik-hpl: самостоятельная облицовка и кромление, основные основания МДФ/ДСП, 11 тем ядра, 8 новых ИИ-иллюстраций, сравнение и расчёт. Прежние фотоблоки сохранены. Статус и QA: docs/seo/materials-comparison/stage-5/implementation.md.',
 'docs/12_COMPONENT_REGISTRY.md':'HplVisualJourney: основания/финиши/помещения/альтернативы, фильтры, lightbox и общие ценовые сценарии. hplView в store v1 сохраняет просмотр отдельно от выбора и заявки. Общие MaterialDecisionExplorer/MaterialDetailGallery не переписаны.',
 'docs/13_MEDIA_REGISTRY.md':'public/images/hpl-20261020/: 8 встроенных image_gen PNG-мастеров, WebP 1200×800 и 720×480, русские alt/подписи. Процесс и срезы — условные ИИ-иллюстрации; все новые src WebP. Промпты/вес/контактный лист — stage-5/image-*.json и image-contact-sheet.jpg.',
 'docs/14_DECISION_LOG.md':'По поручению владельца темы 164 кандидатов внедряются естественными ответами, а не перечнем ключей. Подтверждены собственные приклеивание HPL/кромки и основания в основном МДФ/ДСП. Марки, клей и числовая рыночная вилка не выдуманы. Исправлен выход подписей из figure. Деплой разрешён пользователем; публикация только scope HPL поверх проверенного production.',
 'docs/15_HANDOFF.md':'HPL продолжать из изолированной ветки codex/hpl-20261020 в C:/Users/User/Desktop/kuhni-hpl-20261020. Полный отчёт и актуальный runtime/production QA: docs/seo/materials-comparison/stage-5/implementation.md. Общий store и ID hpl сохранены. Не переносить весь dirty основной checkout и не начинать акрил в этом этапе.',
};
for(const root of roots){
 for(const [name,entry]of Object.entries(entries)){
  const p=path.join(root,name);let s=fs.readFileSync(p,'utf8');if(!s.includes(header))fs.writeFileSync(p,s.trimEnd()+'\n\n'+header+'\n\n'+entry+'\n','utf8');
 }
 const p=path.join(root,'docs/seo/materials-comparison/architecture.md');let s=fs.readFileSync(p,'utf8');if(!s.includes('## Дополнения этапа 5'))fs.writeFileSync(p,s+'\n## Дополнения этапа 5 — HPL, 20.10.2026\n\nHplVisualJourney использует общий store v1 с hplView: base/finish/room/alternative, color/texture/layout, limit/photo. Поля мигрируют, санитизируются и входят в materialsView history, не меняя явный выбор/updatedAt и не попадая в lead payload. ID hpl и общие scenarioId прежние. HPL_PHOTOS дополняет галерею после прежних src, без смены ID. Новый префикс image-disclosure /images/hpl-20261020/; два старых фотоблока сохранены. Отдельный server route HPL, metadata и безопасные обычные ссылки.\n','utf8');
 const status=path.join(root,'docs/seo/materials-comparison/status.md');s=fs.readFileSync(status,'utf8').replace('| 5 | /materials/plastik-hpl | Общая интеграция подключена; подробный этап не выполнен |','| 5 | /materials/plastik-hpl | Реализован, локальные production QA PASS; публикация и runtime — stage-5/implementation.md |');fs.writeFileSync(status,s,'utf8');
}
const dir='docs/seo/materials-comparison/stage-5';
for(const file of ['implementation.md','browser-results.json','production-protected-before.json'])fs.copyFileSync(path.join(roots[0],dir,file),path.join(roots[1],dir,file));
console.log('Updated HPL registries, architecture and handoff in workspace and isolated release.');
