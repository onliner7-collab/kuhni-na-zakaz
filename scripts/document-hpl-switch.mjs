import fs from 'node:fs';
import path from 'node:path';
const roots=[process.cwd(),'C:/Users/User/Desktop/kuhni-na-zakaz'];
const title='## 2026-10-20 — Исправление смены фото HPL';
const rows={
'docs/11_PAGE_REGISTRY.md':'/materials/plastik-hpl: фото помещений, альтернатив, комплектаций и финишей загружаются напрямую из WebP. Runtime 39d84165, production 5/5 PASS. Подробности: docs/seo/materials-comparison/stage-5/switch-fix.md.',
'docs/12_COMPONENT_REGISTRY.md':'Локальный SwitchPhoto в HplVisualJourney: key по src, eager/unoptimized, индикатор загрузки и сообщение ошибки, фиксированный кадр 3:2. На телефоне выбранная альтернатива первая, desktop сохраняет HPL слева. Общий store не менялся.',
'docs/13_MEDIA_REGISTRY.md':'Существующие WebP HPL и alternatives переиспользованы; новых генераций и замен исходников нет. В переключателях убрана повторная обработка /_next/image; выводятся готовые лёгкие WebP.',
'docs/14_DECISION_LOG.md':'В ответ на сообщения владельца проверены фактические currentSrc и декодирование всех 20 состояний. Для мгновенной видимости результата применены прямые WebP, key/eager и первый порядок альтернативы на телефоне. Production 5/5 PASS, runtime 39d84165.',
'docs/15_HANDOFF.md':'Актуальный HPL runtime 39d84165bf9df533d336ce4bbed4a0a25020aa55. Исправлены переключатели фотографий, production 5/5 PASS (включая 42 перехода и заявку). Изолированная ветка codex/hpl-20261020, отчёт stage-5/switch-fix.md. Документальные коммиты после runtime повторно не деплоить.'};
for(const root of roots){for(const [file,note]of Object.entries(rows)){const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');if(!s.includes(title))fs.writeFileSync(p,s.trimEnd()+'\n\n'+title+'\n\n'+note+'\n','utf8');}}
for(const file of ['switch-fix.md','switch-local-results.json','switch-production-results.json','switch-deploy.log'])fs.copyFileSync(path.join(roots[0],'docs/seo/materials-comparison/stage-5',file),path.join(roots[1],'docs/seo/materials-comparison/stage-5',file));
console.log('Recorded HPL switch fix and verified runtime.');
