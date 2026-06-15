# DESIGN.md

Этот документ нужен для LLM, дизайнеров и разработчиков, которые будут адаптировать `hsreplay-deck-view` под другой сайт, сложную дизайн-систему или новый визуальный стиль Hearthstone-проекта.

Главная идея: JS API должен оставаться стабильным, а уникальность достигается через scoped CSS, CSS-переменные, локальные art assets и аккуратные overrides.

## Контекст проекта

`hsreplay-deck-view` — маленькая browser-first библиотека компонентов для Hearthstone UI:

- deck tiles;
- circle strip;
- square strip;
- archetype row;
- stone portrait;
- synergy card;
- mulligan card;
- matchup row;
- tier/meta badge;
- deck cost curve.

Компоненты не зависят от React, Next.js или сборщика. Они создают DOM через `document.createElement` и возвращают root-элемент. React/Next должны использовать их только на клиенте.

## Файлы

| Файл | Роль |
|---|---|
| `src/hsreplay-deck-view.js` | Публичный API, normalizers, DOM factories, render methods |
| `src/hsreplay-deck-view.css` | Базовый визуальный язык всех компонентов |
| `src/hsreplay-deck-view.d.ts` | TypeScript declarations для React/Next/Node интеграций |
| `src/showcase.js` | Демо-данные для GitHub Pages |
| `src/showcase.css` | Стили витрины, preview-режимы, screenshot-only views |
| `index.html` | Живая витрина |
| `scripts/capture-screenshots.mjs` | Генерация PNG для README |
| `README.md` | Пользовательская документация |
| `DESIGN.md` | Этот дизайн-контракт для LLM |

## Нельзя ломать

- Префикс классов `hsrdv-`.
- Публичные методы `render*`, `create*`, `normalize*`.
- `data-card-id` и `data-dbf-id`, если они уже выставляются.
- `aria-label`, `role="img"` и readable text внутри карточек.
- Семантику `clear: true`: render-метод должен заменять содержимое контейнера.
- Работа без сборки через обычные `<link>` и `<script>`.
- Возможность передавать прямые image URL вместо HearthstoneJSON CDN.

## Можно менять

- Цвета, тени, рамки, фоновые слои, density.
- CSS-переменные компонента.
- Layout внутри CSS, если DOM-классы остаются стабильными.
- Preview-стили в `src/showcase.css`.
- README-примеры и screenshots.
- Дополнительные scoped темы через `className`.

## Дизайн-принципы

1. Hearthstone UI должен чувствоваться предметным: карта, камень, мана, редкость, класс, мета-статус.
2. Не превращать все в одинаковые белые SaaS-карточки.
3. Операционные блоки должны быть плотными и сканируемыми.
4. Статусы должны отличаться формой и цветом, а не только текстом.
5. Маленькие бейджи `×2` и `★` должны быть одного визуального веса.
6. Не использовать один доминирующий hue на всю страницу.
7. Длинные русские названия должны обрезаться предсказуемо, без перекрытий.
8. На мобильном компоненты должны оставаться usable, даже если часть строк прокручивается горизонтально.

## Архитектура кастомизации

Лучший способ адаптировать компонент под другой сайт:

```js
HSReplayDeckView.renderMetaBadges("#meta", badges, {
  className: "koloda-meta-theme"
});
```

```css
.koloda-meta-theme {
  --hsrdv-meta-badge-width: 100%;
  --hsrdv-cost-curve-height: 112px;
}

.koloda-meta-theme .hsrdv-meta-badge {
  border-radius: 4px;
  background: var(--koloda-panel-bg);
}
```

Сначала используйте CSS-переменные. Если их не хватает, добавляйте scoped class overrides. Глобально переписывать `.hsrdv-*` стоит только если меняется базовый дизайн всей библиотеки.

## Component Contracts

### Deck Tiles

Ключевые классы:

- `.hsrdv-card-tile`
- `.hsrdv-card-gem`
- `.hsrdv-card-frame`
- `.hsrdv-card-art`
- `.hsrdv-card-countbox`
- `.hsrdv-card-name`

Основные переменные:

- `--hsrdv-tile-width`
- `--hsrdv-tile-height`
- `--hsrdv-gem-width`
- `--hsrdv-count-width`
- `--hsrdv-art-right`

Дизайн можно менять через цвет gem, фон frame, shadow текста, fade gradient. Нельзя убирать `text-overflow` у названия без нового mobile QA.

### Circle And Square Strips

Ключевые классы:

- `.hsrdv-card-icon`
- `.hsrdv-card-square-icon`
- `.hsrdv-card-icon-badge`
- `.hsrdv-card-square-badge`

Основные переменные:

- `--hsrdv-icon-size`
- `--hsrdv-icon-gap`
- `--hsrdv-square-icon-size`
- `--hsrdv-square-icon-gap`
- `--hsrdv-icon-art-x`
- `--hsrdv-icon-art-scale`

Если меняете размер, проверяйте `×2` и `★`: они должны выглядеть одинаково по весу и не перекрывать соседние иконки.

### Archetype Row

Ключевые классы:

- `.hsrdv-archetype-card`
- `.hsrdv-archetype-bg`
- `.hsrdv-archetype-art-panel`
- `.hsrdv-archetype-icon`
- `.hsrdv-archetype-title`

Основные переменные:

- `--hsrdv-archetype-height`
- `--hsrdv-archetype-panel-width`
- `--hsrdv-archetype-panel-skew`
- `--hsrdv-archetype-art-opacity`

Фоновые арты должны помогать распознать архетип, но не спорить с названием.

### Stone Portrait

Ключевые классы:

- `.hsrdv-stone-portrait`
- `.hsrdv-stone-portrait-art`

Основные переменные:

- `--hsrdv-stone-portrait-size`
- `--hsrdv-stone-portrait-art-inset`
- `--hsrdv-stone-portrait-frame-image`

Можно менять рамку, но сохраняйте круговую маску и `object-position`, иначе Battlegrounds portraits быстро становятся плохо читаемыми.

### Synergy Card

Ключевые классы:

- `.hsrdv-synergy-card`
- `.hsrdv-synergy-chain`
- `.hsrdv-synergy-item`
- `.hsrdv-synergy-connector`
- `.hsrdv-synergy-result`

Основные переменные:

- `--hsrdv-synergy-card-width`
- `--hsrdv-synergy-item-size`
- `--hsrdv-synergy-item-gap`
- `--hsrdv-synergy-connector-size`

`connector: "plus"` означает “работают вместе”. `connector: "arrow"` означает порядок действий. Не заменяйте оба на один визуальный паттерн.

### Mulligan Card

Ключевые классы:

- `.hsrdv-mulligan-card`
- `.hsrdv-mulligan-item`
- `.hsrdv-mulligan-item--keep`
- `.hsrdv-mulligan-item--situational`
- `.hsrdv-mulligan-item--replace`
- `.hsrdv-mulligan-status`

Основные переменные:

- `--hsrdv-mulligan-card-width`
- `--hsrdv-mulligan-art-size`
- `--hsrdv-mulligan-gap`

Дизайн должен быстро отвечать: оставить, подумать, заменить. Цвет статуса должен быть виден даже при беглом сканировании.

### Matchup Row

Ключевые классы:

- `.hsrdv-matchup-row`
- `.hsrdv-matchup-row--favored`
- `.hsrdv-matchup-row--even`
- `.hsrdv-matchup-row--unfavored`
- `.hsrdv-matchup-opponent`
- `.hsrdv-matchup-gauge`
- `.hsrdv-matchup-keycards`

Основные переменные:

- `--hsrdv-matchup-row-width`
- `--hsrdv-matchup-icon-size`
- `--hsrdv-matchup-card-size`

Сначала читается opponent, потом winrate, потом gauge, потом key cards. Не переставляйте порядок без причины.

### Tier/Meta Badge

Ключевые классы:

- `.hsrdv-meta-badge`
- `.hsrdv-meta-badge--tier-1`
- `.hsrdv-meta-badge--tier-2`
- `.hsrdv-meta-badge--counter`
- `.hsrdv-meta-badge--meme`
- `.hsrdv-meta-badge--rising`
- `.hsrdv-meta-badge--falling`

Основная переменная:

- `--hsrdv-meta-badge-width`

Каждый kind должен иметь свой характер. Не сводите все к одинаковым карточкам с разным цветом текста.

### Deck Cost Curve

Ключевые классы:

- `.hsrdv-cost-curve`
- `.hsrdv-cost-curve-chart`
- `.hsrdv-cost-curve-bucket`
- `.hsrdv-cost-curve-bar`
- `.hsrdv-cost-curve-fill`
- `.hsrdv-cost-curve-label`

Основные переменные:

- `--hsrdv-cost-curve-width`
- `--hsrdv-cost-curve-height`
- `--hsrdv-cost-curve-gap`
- `--hsrdv-cost-curve-columns`

Столбцы должны выглядеть как mana-статистика, а не как generic dashboard chart. Хорошо работают темные панели, синий glow, плотные labels.

## Patterns For Unique Designs

### Class-Themed Page

Use class-specific wrapper variables:

```css
.mage-theme .hsrdv-meta-badge {
  --hsrdv-meta-accent: #4aa8ff;
}

.warlock-theme .hsrdv-meta-badge {
  --hsrdv-meta-accent: #8d5ad8;
}
```

### Editorial Guide

For an article, reduce density and make copy easier to read:

```css
.guide-body .hsrdv-synergy-card {
  max-width: 680px;
  background: linear-gradient(180deg, #fffaf0, #f0f5f7);
}
```

### Dense Meta Table

For repeated rows, reduce shadows and tighten spacing:

```css
.meta-table .hsrdv-matchup-row {
  box-shadow: none;
  border-radius: 4px;
  padding-block: 8px;
}
```

### Premium/Legendary Theme

Use gold accents sparingly:

```css
.legendary-theme .hsrdv-cost-curve-fill {
  background: linear-gradient(180deg, #fff1a6, #d49a2e, #6e4211);
}
```

## LLM Workflow

When asked to make a visual change:

1. Identify which component family is affected.
2. Read current CSS for that family and any preview overrides in `src/showcase.css`.
3. Prefer scoped changes or component variables.
4. Keep DOM shape and public JS API intact.
5. Update README if the public API, integration, or design contract changed.
6. Run:

```bash
node --check src/hsreplay-deck-view.js
node --check src/showcase.js
node --check scripts/capture-screenshots.mjs
git diff --check
npm run screenshots
```

7. Inspect screenshots:

- `assets/screenshots/site-showcase.png`
- the component-specific screenshot;
- `assets/screenshots/mobile-demo.png` when layout or typography changed.

## QA Checklist

Before shipping:

- No text overlap in Russian names.
- `×2` and `★` are not oversized.
- Mobile view is usable.
- Dark components have readable contrast.
- Screenshots in README match current design.
- GitHub Pages is updated from `main:gh-pages`.
- Worktree is clean after commit.

## Integration Notes

React and Next.js integrations should treat this library as an imperative DOM island. The React component owns only the empty container; `HSReplayDeckView` owns the children inside that container.

Node.js integrations should not call render methods unless a DOM exists. Use JSDOM for static HTML generation.

TypeScript integrations should use `src/hsreplay-deck-view.d.ts`; keep it in sync whenever public API fields or methods are added.
