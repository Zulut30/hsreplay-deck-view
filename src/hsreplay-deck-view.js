(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HSReplayDeckView = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const DEFAULT_OPTIONS = {
    locale: "ruRU",
    dataUrl: "https://api.hearthstonejson.com/v1/latest/{locale}/cards.collectible.json",
    artBaseUrl: "https://art.hearthstonejson.com/v1/tiles/",
    artFormat: "webp",
    className: "",
    group: true,
    sort: true,
    clear: true,
    showLegendaryAsStar: true,
    showSingleCountBox: false,
    imageFallbackFormat: "png",
    iconBadgeSingleCount: false
  };

  const RARITY_ORDER = {
    free: 0,
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4
  };

  const databaseCache = new Map();

  function withDefaults(options) {
    return Object.assign({}, DEFAULT_OPTIONS, options || {});
  }

  function resolveTarget(target) {
    if (typeof target === "string") {
      const element = document.querySelector(target);
      if (!element) {
        throw new Error(`HSReplayDeckView: target not found: ${target}`);
      }
      return element;
    }
    if (!target || typeof target.appendChild !== "function") {
      throw new Error("HSReplayDeckView: target must be an Element or selector");
    }
    return target;
  }

  function parseDeckCards(input) {
    if (Array.isArray(input)) {
      return input.map(Number).filter(Number.isFinite);
    }
    if (typeof input !== "string") {
      return [];
    }
    return input
      .split(/[,\s]+/)
      .map((value) => Number(value.trim()))
      .filter(Number.isFinite);
  }

  function normalizeRarity(rarity) {
    return String(rarity || "common").toLowerCase();
  }

  function normalizeCard(card) {
    const rarity = normalizeRarity(card.rarity);
    return {
      id: card.id || card.cardId || "",
      dbfId: card.dbfId || card.dbf_id || null,
      name: card.name || "Unknown card",
      cost: Number.isFinite(Number(card.cost)) ? Number(card.cost) : 0,
      rarity,
      elite: Boolean(card.elite) || rarity === "legendary",
      count: Math.max(1, Number(card.count || 1)),
      image: card.image || card.imageUrl || card.art || "",
      predicted: Boolean(card.predicted)
    };
  }

  function getCardKey(card) {
    return card.dbfId || card.id || card.name;
  }

  function groupCards(cards) {
    const grouped = new Map();
    cards.forEach((rawCard) => {
      const card = normalizeCard(rawCard);
      const key = getCardKey(card);
      if (!grouped.has(key)) {
        grouped.set(key, card);
        return;
      }
      grouped.get(key).count += card.count;
    });
    return Array.from(grouped.values());
  }

  function sortCards(cards) {
    return cards.slice().sort((a, b) => {
      if (a.cost !== b.cost) {
        return a.cost - b.cost;
      }
      const rarityDiff = (RARITY_ORDER[a.rarity] ?? 99) - (RARITY_ORDER[b.rarity] ?? 99);
      if (rarityDiff !== 0) {
        return rarityDiff;
      }
      return a.name.localeCompare(b.name, "ru");
    });
  }

  function getArtUrl(card, options) {
    if (card.image) {
      return card.image;
    }
    if (!card.id) {
      return "";
    }
    return `${options.artBaseUrl}${card.id}.${options.artFormat}`;
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof text !== "undefined") {
      element.textContent = text;
    }
    return element;
  }

  function shouldShowCountBox(card, options) {
    return options.showSingleCountBox || card.count > 1 || (options.showLegendaryAsStar && card.elite);
  }

  function getCountLabel(card, options) {
    if (options.showLegendaryAsStar && card.elite && card.count === 1) {
      return "★";
    }
    return String(card.count);
  }

  function getIconBadgeLabel(card, options) {
    if (options.showLegendaryAsStar && card.elite && card.count === 1) {
      return "★";
    }
    if (card.count > 1) {
      return `×${card.count}`;
    }
    if (options.iconBadgeSingleCount) {
      return String(card.count);
    }
    return "";
  }

  function prepareCards(cards, options) {
    const normalized = options.group ? groupCards(cards) : cards.map(normalizeCard);
    return options.sort ? sortCards(normalized) : normalized;
  }

  function createTile(rawCard, options) {
    const card = normalizeCard(rawCard);
    const settings = withDefaults(options);
    const hasCountBox = shouldShowCountBox(card, settings);
    const tile = createElement(
      "figure",
      `hsrdv-card-tile${card.predicted ? " hsrdv-card-tile--predicted" : ""}`
    );
    tile.setAttribute("aria-label", `${card.name}, ${card.cost} mana`);
    if (card.dbfId) {
      tile.dataset.dbfId = String(card.dbfId);
    }
    if (card.id) {
      tile.dataset.cardId = card.id;
    }

    const gem = createElement("div", `hsrdv-card-gem hsrdv-rarity-${card.rarity}`);
    gem.appendChild(createElement("span", "hsrdv-card-cost", String(card.cost)));

    const frame = createElement(
      "div",
      `hsrdv-card-frame ${hasCountBox ? "hsrdv-card-frame--with-count" : "hsrdv-card-frame--without-count"}`
    );

    const artUrl = getArtUrl(card, settings);
    if (artUrl) {
      const image = createElement("img", "hsrdv-card-art");
      image.src = artUrl;
      image.alt = card.name;
      if (settings.imageFallbackFormat && settings.artFormat !== settings.imageFallbackFormat) {
        image.addEventListener(
          "error",
          () => {
            if (image.dataset.fallbackTried || card.image || !card.id) {
              return;
            }
            image.dataset.fallbackTried = "1";
            image.src = `${settings.artBaseUrl}${card.id}.${settings.imageFallbackFormat}`;
          },
          { once: true }
        );
      }
      frame.appendChild(image);
    }

    if (hasCountBox) {
      const countBox = createElement("div", "hsrdv-card-countbox");
      const countClass = card.count > 1 ? "hsrdv-card-count hsrdv-card-count--copies" : "hsrdv-card-count";
      countBox.appendChild(createElement("span", countClass, getCountLabel(card, settings)));
      frame.appendChild(countBox);
    }

    frame.appendChild(createElement("span", "hsrdv-card-fade"));
    frame.appendChild(createElement("figcaption", "hsrdv-card-name", card.name));

    tile.appendChild(gem);
    tile.appendChild(frame);
    return tile;
  }

  function createIcon(rawCard, options) {
    const card = normalizeCard(rawCard);
    const settings = withDefaults(options);
    const badgeLabel = getIconBadgeLabel(card, settings);
    const icon = createElement(
      "div",
      `hsrdv-card-icon hsrdv-rarity-${card.rarity}${card.predicted ? " hsrdv-card-icon--predicted" : ""}`
    );
    icon.setAttribute("role", "img");
    icon.setAttribute("aria-label", badgeLabel ? `${card.name} ${badgeLabel}` : card.name);
    if (card.dbfId) {
      icon.dataset.dbfId = String(card.dbfId);
    }
    if (card.id) {
      icon.dataset.cardId = card.id;
    }

    const artUrl = getArtUrl(card, settings);
    if (artUrl) {
      icon.style.backgroundImage = `url("${artUrl}")`;
    }

    if (badgeLabel) {
      const badgeClass = badgeLabel === "★"
        ? "hsrdv-card-icon-badge hsrdv-card-icon-badge--star"
        : "hsrdv-card-icon-badge hsrdv-card-icon-badge--copies";
      icon.appendChild(createElement("span", badgeClass, badgeLabel));
    }

    return icon;
  }

  function createSquareIcon(rawCard, options) {
    const card = normalizeCard(rawCard);
    const settings = withDefaults(options);
    const badgeLabel = getIconBadgeLabel(card, settings);
    const icon = createElement(
      "div",
      `hsrdv-card-square-icon hsrdv-rarity-${card.rarity}${card.predicted ? " hsrdv-card-square-icon--predicted" : ""}`
    );
    icon.setAttribute("role", "img");
    icon.setAttribute("aria-label", badgeLabel ? `${card.name} ${badgeLabel}` : card.name);
    if (card.dbfId) {
      icon.dataset.dbfId = String(card.dbfId);
    }
    if (card.id) {
      icon.dataset.cardId = card.id;
    }

    const artUrl = getArtUrl(card, settings);
    if (artUrl) {
      icon.style.backgroundImage = `url("${artUrl}")`;
    }

    if (badgeLabel) {
      const badgeClass = badgeLabel === "★"
        ? "hsrdv-card-square-badge hsrdv-card-square-badge--star"
        : "hsrdv-card-square-badge hsrdv-card-square-badge--copies";
      icon.appendChild(createElement("span", badgeClass, badgeLabel));
    }

    return icon;
  }

  function renderDeck(target, cards, options) {
    const settings = withDefaults(options);
    const container = resolveTarget(target);
    const renderCards = prepareCards(cards, settings);
    const rootElement = createElement("div", `hsrdv ${settings.className}`.trim());
    const list = createElement("ul", "hsrdv-list");

    renderCards.forEach((card) => {
      const item = createElement("li");
      item.appendChild(createTile(card, settings));
      list.appendChild(item);
    });

    rootElement.appendChild(list);
    if (settings.clear) {
      container.replaceChildren(rootElement);
    } else {
      container.appendChild(rootElement);
    }
    return rootElement;
  }

  function renderIcons(target, cards, options) {
    const settings = withDefaults(options);
    const container = resolveTarget(target);
    const renderCards = prepareCards(cards, settings);
    const rootElement = createElement("div", `hsrdv hsrdv-icons ${settings.className}`.trim());
    const list = createElement("ul", "hsrdv-icon-list");

    renderCards.forEach((card) => {
      const item = createElement("li");
      item.appendChild(createIcon(card, settings));
      list.appendChild(item);
    });

    rootElement.appendChild(list);
    if (settings.clear) {
      container.replaceChildren(rootElement);
    } else {
      container.appendChild(rootElement);
    }
    return rootElement;
  }

  function renderSquareIcons(target, cards, options) {
    const settings = withDefaults(options);
    const container = resolveTarget(target);
    const renderCards = prepareCards(cards, settings);
    const rootElement = createElement("div", `hsrdv hsrdv-square-icons ${settings.className}`.trim());
    const list = createElement("ul", "hsrdv-square-icon-list");

    renderCards.forEach((card) => {
      const item = createElement("li");
      item.appendChild(createSquareIcon(card, settings));
      list.appendChild(item);
    });

    rootElement.appendChild(list);
    if (settings.clear) {
      container.replaceChildren(rootElement);
    } else {
      container.appendChild(rootElement);
    }
    return rootElement;
  }

  async function loadCardDatabase(options) {
    const settings = withDefaults(options);
    const url = settings.dataUrl.replace("{locale}", settings.locale);
    if (databaseCache.has(url)) {
      return databaseCache.get(url);
    }
    if (typeof fetch !== "function") {
      throw new Error("HSReplayDeckView: fetch is required to load HearthstoneJSON data");
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HSReplayDeckView: HearthstoneJSON request failed: ${response.status}`);
    }
    const cards = await response.json();
    const byDbfId = new Map(cards.map((card) => [Number(card.dbfId), card]));
    databaseCache.set(url, byDbfId);
    return byDbfId;
  }

  async function cardsFromDbfIds(dbfIds, options) {
    const ids = parseDeckCards(dbfIds);
    const byDbfId = await loadCardDatabase(options);
    return ids
      .map((dbfId) => byDbfId.get(dbfId))
      .filter(Boolean);
  }

  async function renderDeckFromDbfIds(target, dbfIds, options) {
    const cards = await cardsFromDbfIds(dbfIds, options);
    return renderDeck(target, cards, options);
  }

  async function renderIconsFromDbfIds(target, dbfIds, options) {
    const cards = await cardsFromDbfIds(dbfIds, options);
    return renderIcons(target, cards, options);
  }

  async function renderSquareIconsFromDbfIds(target, dbfIds, options) {
    const cards = await cardsFromDbfIds(dbfIds, options);
    return renderSquareIcons(target, cards, options);
  }

  return {
    createIcon,
    createSquareIcon,
    createTile,
    cardsFromDbfIds,
    groupCards,
    loadCardDatabase,
    normalizeCard,
    parseDeckCards,
    renderDeck,
    renderDeckFromDbfIds,
    renderIcons,
    renderIconsFromDbfIds,
    renderSquareIcons,
    renderSquareIconsFromDbfIds,
    sortCards
  };
});
