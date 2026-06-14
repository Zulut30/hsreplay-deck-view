# HSReplay Deck View

Переиспользуемый паттерн Hearthstone-плиток в стиле HSReplay: стоимость слева, цвет редкости, tile-art, затемнение под текстом, название с `ellipsis`, счетчик копий или звезда для легендарок. Также есть компактные режимы круглых/квадратных иконок и строка архетипа с несколькими артами на фоне через диагональные разделители.

Проект не требует сборки и фреймворков. Достаточно подключить CSS и JS.

## Живая витрина

GitHub Pages: https://zulut30.github.io/hsreplay-deck-view/

![Showcase site](assets/screenshots/site-showcase.png)

## Скриншоты

### Колода из `data-deck-cards`

![Deck demo](assets/screenshots/deck-demo.png)

### Круглые иконки

![Circle icon strip demo](assets/screenshots/icon-strip-demo.png)

### Квадратные иконки

![Square icon strip demo](assets/screenshots/square-strip-demo.png)

### Карточка архетипа

![Archetype card demo](assets/screenshots/archetype-card-demo.png)

### Все редкости и стоимости 0-10

![Rarity and cost showcase](assets/screenshots/rarity-cost-showcase.png)

### Мобильный вид

![Mobile demo](assets/screenshots/mobile-demo.png)

## Быстрый старт

```html
<link rel="stylesheet" href="src/hsreplay-deck-view.css">
<div id="deck"></div>
<script src="src/hsreplay-deck-view.js"></script>
<script>
  const deckCards = "69521,69521,69623,69623,126088";

  HSReplayDeckView.renderDeckFromDbfIds("#deck", deckCards, {
    locale: "ruRU"
  });
</script>
```

`renderDeckFromDbfIds` берет dbfId, загружает карточную базу HearthstoneJSON, группирует дубликаты, сортирует карты по стоимости и рисует плитки.

## Круглые иконки

Для компактного горизонтального вида используйте тот же источник данных:

```html
<link rel="stylesheet" href="src/hsreplay-deck-view.css">
<div id="deck-icons"></div>
<script src="src/hsreplay-deck-view.js"></script>
<script>
  const deckCards = "69521,69521,69623,69623,126088";

  HSReplayDeckView.renderIconsFromDbfIds("#deck-icons", deckCards, {
    locale: "ruRU"
  });
</script>
```

Круги повторяют HSReplay-паттерн из инспектора: `border-radius: 50%`, `background-position-x: -61.7647px` для размера 30px и `background-size: 111.176px 100%`. В CSS это пересчитано через переменные, поэтому размер можно менять:

```css
#deck-icons .hsrdv {
  --hsrdv-icon-size: 54px;
  --hsrdv-icon-gap: 14px;
}
```

## Квадратные иконки

Третий режим повторяет arena/winning-decks стиль: квадратная иконка, мягкое скругление, белая боковая тень и такой же бейдж количества или легендарной звезды.

```html
<link rel="stylesheet" href="src/hsreplay-deck-view.css">
<div id="deck-squares"></div>
<script src="src/hsreplay-deck-view.js"></script>
<script>
  const deckCards = "69521,69521,69623,69623,126088";

  HSReplayDeckView.renderSquareIconsFromDbfIds("#deck-squares", deckCards, {
    locale: "ruRU"
  });
</script>
```

Размеры из инспектора HSReplay для 36px-иконки: `border-radius: 8px`, `background-position-x: -74.1176px`, `background-size: 133.412px 100%`. В компоненте это тоже пересчитано через переменные:

```css
#deck-squares .hsrdv {
  --hsrdv-square-icon-size: 36px;
  --hsrdv-square-icon-gap: 16px;
}
```

## Карточки архетипов

Этот режим повторяет паттерн из meta overview: строка высотой `70px`, слева круглая иконка архетипа, а под названием лежат несколько `256x`-артов карт. Каждый арт вставляется в параллелограмм с базовой шириной `100px`, сдвигается на `-15px`, отделяется светлым диагональным зазором, получает правый градиент и может растягиваться, чтобы заполнить всю строку.

```html
<link rel="stylesheet" href="src/hsreplay-deck-view.css">
<div id="archetypes"></div>
<script src="src/hsreplay-deck-view.js"></script>
<script>
  HSReplayDeckView.renderArchetypes("#archetypes", [
    {
      name: "Манипулятор маг",
      icon: "CS2_029",
      arts: ["EDR_451", "EDR_852", "EDR_264"]
    }
  ]);
</script>
```

`icon` принимает прямой URL или card id и по умолчанию берет `tiles/{id}.webp`. `arts` принимает card id, прямой URL или объект:

```js
{
  id: "EDR_451",
  position: "center center",
  scale: 1.5,
  opacity: 0.2
}
```

Полезные CSS-переменные:

```css
#archetypes .hsrdv {
  --hsrdv-archetype-height: 70px;
  --hsrdv-archetype-panel-width: 100px;
  --hsrdv-archetype-panel-skew: 15px;
  --hsrdv-archetype-art-opacity: 0.28;
  --hsrdv-archetype-icon-size: 54px;
}
```

## Готовые объекты карт

Если на сайте уже есть данные карт, можно не грузить HearthstoneJSON:

```html
<div id="manual-deck"></div>
<script>
  HSReplayDeckView.renderDeck("#manual-deck", [
    {
      id: "CATA_190h",
      dbfId: 125467,
      name: "Смертокрыл Разрушитель миров",
      cost: 10,
      rarity: "LEGENDARY",
      elite: true,
      count: 1
    },
    {
      id: "CORE_EX1_145",
      dbfId: 69623,
      name: "Подготовка",
      cost: 0,
      rarity: "EPIC",
      count: 2
    }
  ]);
</script>
```

Минимальные поля:

| Поле | Что делает |
|---|---|
| `id` | Hearthstone card id для tile-art: `https://art.hearthstonejson.com/v1/tiles/{id}.webp` |
| `name` | Текст на плитке |
| `cost` | Стоимость слева |
| `rarity` | `FREE`, `COMMON`, `RARE`, `EPIC`, `LEGENDARY` |
| `count` | Количество копий; `2` рисуется справа |
| `elite` | Для легендарок показывает `★` вместо количества |
| `image` | Необязательный прямой URL арта, если не нужен HearthstoneJSON art CDN |

## API

```js
HSReplayDeckView.renderDeck(target, cards, options)
```

Рендерит массив готовых объектов карт.

```js
HSReplayDeckView.renderDeckFromDbfIds(target, dbfIds, options)
```

Принимает массив dbfId или строку как из HSReplay `data-deck-cards`.

```js
HSReplayDeckView.renderIcons(target, cards, options)
```

Рендерит компактную строку круглых иконок из готовых объектов карт.

```js
HSReplayDeckView.renderIconsFromDbfIds(target, dbfIds, options)
```

Рендерит круглые иконки из массива dbfId или строки `data-deck-cards`.

```js
HSReplayDeckView.renderSquareIcons(target, cards, options)
```

Рендерит компактную строку квадратных иконок из готовых объектов карт.

```js
HSReplayDeckView.renderSquareIconsFromDbfIds(target, dbfIds, options)
```

Рендерит квадратные иконки из массива dbfId или строки `data-deck-cards`.

```js
HSReplayDeckView.renderArchetypes(target, archetypes, options)
```

Рендерит список карточек архетипов из готовых объектов.

```js
HSReplayDeckView.cardsFromDbfIds(dbfIds, options)
```

Возвращает массив карт из HearthstoneJSON без рендера.

```js
HSReplayDeckView.createTile(card, options)
```

Возвращает DOM-элемент одной плитки.

```js
HSReplayDeckView.createIcon(card, options)
```

Возвращает DOM-элемент одной круглой иконки.

```js
HSReplayDeckView.createSquareIcon(card, options)
```

Возвращает DOM-элемент одной квадратной иконки.

```js
HSReplayDeckView.createArchetypeCard(archetype, options)
```

Возвращает DOM-элемент одной карточки архетипа.

Основные опции:

| Опция | По умолчанию | Назначение |
|---|---:|---|
| `locale` | `ruRU` | Локаль HearthstoneJSON |
| `dataUrl` | latest collectible JSON | Шаблон URL базы карт, `{locale}` заменяется автоматически |
| `artBaseUrl` | HearthstoneJSON tiles CDN | База URL для артов |
| `artFormat` | `webp` | Формат арта |
| `group` | `true` | Группировать дубликаты в счетчик |
| `sort` | `true` | Сортировать по стоимости, редкости и названию |
| `showLegendaryAsStar` | `true` | Показывать `★` у легендарок |
| `showSingleCountBox` | `false` | Показывать правый счетчик даже для одной копии |
| `iconBadgeSingleCount` | `false` | Показывать `1` на круглых иконках для одиночных нелегендарных карт |
| `archetypeArtBaseUrl` | HearthstoneJSON 256x CDN | База URL для фоновых артов архетипа |
| `archetypeArtFormat` | `webp` | Формат фоновых артов архетипа |
| `archetypeIconBaseUrl` | HearthstoneJSON tiles CDN | База URL для круглой иконки архетипа |
| `archetypeIconFormat` | `webp` | Формат круглой иконки архетипа |

## HTML-паттерн одной плитки

JS генерирует такую структуру:

```html
<figure class="hsrdv-card-tile">
  <div class="hsrdv-card-gem hsrdv-rarity-legendary">
    <span class="hsrdv-card-cost">10</span>
  </div>
  <div class="hsrdv-card-frame hsrdv-card-frame--with-count">
    <img class="hsrdv-card-art" src="https://art.hearthstonejson.com/v1/tiles/CATA_190h.webp" alt="Смертокрыл Разрушитель миров">
    <div class="hsrdv-card-countbox">
      <span class="hsrdv-card-count">★</span>
    </div>
    <span class="hsrdv-card-fade"></span>
    <figcaption class="hsrdv-card-name">Смертокрыл Разрушитель миров</figcaption>
  </div>
</figure>
```

Классы специально префиксованы `hsrdv-`, чтобы этот компонент было проще вставлять на другие сайты без конфликта с их CSS.

## HTML-паттерн круглой иконки

```html
<ul class="hsrdv-icon-list">
  <li>
    <div
      class="hsrdv-card-icon hsrdv-rarity-epic"
      role="img"
      aria-label="Подготовка ×2"
      style="background-image: url(&quot;https://art.hearthstonejson.com/v1/tiles/CORE_EX1_145.webp&quot;)"
    >
      <span class="hsrdv-card-icon-badge hsrdv-card-icon-badge--copies">×2</span>
    </div>
  </li>
</ul>
```

## HTML-паттерн квадратной иконки

```html
<ul class="hsrdv-square-icon-list">
  <li>
    <div
      class="hsrdv-card-square-icon hsrdv-rarity-legendary"
      role="img"
      aria-label="Навигатор Элиза ★"
      style="background-image: url(&quot;https://art.hearthstonejson.com/v1/tiles/TLC_100.webp&quot;)"
    >
      <span class="hsrdv-card-square-badge hsrdv-card-square-badge--star">★</span>
    </div>
  </li>
</ul>
```

## HTML-паттерн карточки архетипа

```html
<ul class="hsrdv-archetype-list">
  <li>
    <article class="hsrdv-archetype-card" aria-label="Манипулятор маг">
      <div class="hsrdv-archetype-bg" aria-hidden="true">
        <span class="hsrdv-archetype-art-panel">
          <span
            class="hsrdv-archetype-art"
            style="background-image: url(&quot;https://art.hearthstonejson.com/v1/256x/EDR_451.webp&quot;)"
          ></span>
        </span>
        <span class="hsrdv-archetype-art-panel">
          <span
            class="hsrdv-archetype-art"
            style="background-image: url(&quot;https://art.hearthstonejson.com/v1/256x/EDR_852.webp&quot;)"
          ></span>
        </span>
      </div>
      <div class="hsrdv-archetype-content">
        <img class="hsrdv-archetype-icon" src="https://art.hearthstonejson.com/v1/tiles/CS2_029.webp" alt="Манипулятор маг">
        <h3 class="hsrdv-archetype-title">Манипулятор маг</h3>
      </div>
    </article>
  </li>
</ul>
```

## Демо и скриншоты

Открыть локально:

```bash
npm run serve
```

После этого перейти на `http://127.0.0.1:8080/`.

Пересобрать скриншоты для README:

```bash
npm run screenshots
```

Скрипт использует установленный Chromium. Если бинарник называется иначе, можно указать его явно:

```bash
CHROMIUM_BIN=/path/to/chromium npm run screenshots
```

## GitHub Pages

В репозитории есть workflow `.github/workflows/pages.yml`. Он публикует статический сайт из корня `main`: `index.html`, `src/`, `assets/` и `.nojekyll`.

Локально сайт можно открыть через:

```bash
npm run serve
```

## Источники данных

- Данные карт: `https://api.hearthstonejson.com/v1/latest/{locale}/cards.collectible.json`
- Tile-art: `https://art.hearthstonejson.com/v1/tiles/{cardId}.webp`
- Full art для архетипов: `https://art.hearthstonejson.com/v1/256x/{cardId}.webp`

Для сайтов, где нельзя зависеть от внешних CDN, передавайте свои поля `image` и готовые данные карт в `renderDeck`, а для архетипов используйте прямые URL в `icon` и `arts`.
