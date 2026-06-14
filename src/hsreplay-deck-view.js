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
    iconBadgeSingleCount: false,
    archetypeArtBaseUrl: "https://art.hearthstonejson.com/v1/256x/",
    archetypeArtFormat: "webp",
    archetypeIconBaseUrl: "https://art.hearthstonejson.com/v1/tiles/",
    archetypeIconFormat: "webp",
    stonePortraitArtBaseUrl: "https://art.hearthstonejson.com/v1/256x/",
    stonePortraitArtFormat: "webp",
    stonePortraitFrameImage: "https://static.hsreplay.net/static/webpack/assets/images/battlegrounds/minion-frame.d21732172d83faeae997.png"
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

  function isDirectImageUrl(value) {
    return /^(https?:)?\/\//i.test(value)
      || /^(data|blob):/i.test(value)
      || value.startsWith("/")
      || value.startsWith("./")
      || value.startsWith("../");
  }

  function getArtworkId(artwork) {
    if (!artwork) {
      return "";
    }
    if (typeof artwork === "string") {
      return artwork.trim();
    }
    return String(artwork.id || artwork.cardId || artwork.card_id || "").trim();
  }

  function getArtworkUrl(artwork, baseUrl, format) {
    if (!artwork) {
      return "";
    }
    if (typeof artwork === "string") {
      const value = artwork.trim();
      if (!value) {
        return "";
      }
      return isDirectImageUrl(value) ? value : `${baseUrl}${value}.${format}`;
    }

    const directUrl = artwork.image || artwork.imageUrl || artwork.art || artwork.url || artwork.src;
    if (directUrl) {
      return directUrl;
    }

    const id = getArtworkId(artwork);
    return id ? `${baseUrl}${id}.${format}` : "";
  }

  function getArchetypeArtUrl(artwork, options) {
    return getArtworkUrl(artwork, options.archetypeArtBaseUrl, options.archetypeArtFormat);
  }

  function getArchetypeIconUrl(artwork, options) {
    return getArtworkUrl(artwork, options.archetypeIconBaseUrl, options.archetypeIconFormat);
  }

  function getStonePortraitArtUrl(portrait, options) {
    if (portrait.image) {
      return portrait.image;
    }
    if (!portrait.id) {
      return "";
    }
    return `${options.stonePortraitArtBaseUrl}${portrait.id}.${options.stonePortraitArtFormat}`;
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

  function parseArchetypeArtworks(input) {
    if (Array.isArray(input)) {
      return input;
    }
    if (typeof input !== "string") {
      return [];
    }
    return input.split(/[,\s]+/).map((value) => value.trim()).filter(Boolean);
  }

  function normalizeArchetype(archetype) {
    if (typeof archetype === "string") {
      return {
        name: archetype,
        icon: "",
        arts: [],
        stats: [],
        url: ""
      };
    }

    const raw = archetype || {};
    return {
      name: raw.name || raw.title || "Unknown archetype",
      icon: raw.icon || raw.iconUrl || raw.classIcon || raw.classIconUrl || raw.image || raw.iconCardId || "",
      iconAlt: raw.iconAlt || raw.className || raw.name || raw.title || "",
      arts: parseArchetypeArtworks(raw.arts || raw.artworks || raw.cards || raw.cardIds || raw.backgroundCards),
      stats: Array.isArray(raw.stats) ? raw.stats : [],
      url: raw.url || raw.href || "",
      label: raw.label || raw.ariaLabel || ""
    };
  }

  function normalizeStonePortrait(portrait) {
    if (typeof portrait === "string") {
      const value = portrait.trim();
      const isImage = isDirectImageUrl(value);
      return {
        id: isImage ? "" : value,
        dbfId: null,
        name: value || "Unknown card",
        image: isImage ? value : "",
        href: "",
        position: "",
        predicted: false
      };
    }

    const raw = portrait || {};
    const id = String(raw.id || raw.cardId || raw.card_id || "").trim();
    return {
      id,
      dbfId: raw.dbfId || raw.dbf_id || null,
      name: raw.name || raw.title || id || "Unknown card",
      image: raw.image || raw.imageUrl || raw.art || raw.src || raw.portrait || raw.url || "",
      href: raw.href || "",
      position: raw.position || raw.objectPosition || raw.imagePosition || "",
      predicted: Boolean(raw.predicted)
    };
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

  function createArchetypeCard(rawArchetype, options) {
    const settings = withDefaults(options);
    const archetype = normalizeArchetype(rawArchetype);
    const element = createElement(
      archetype.url ? "a" : "article",
      "hsrdv-archetype-card"
    );
    element.setAttribute("aria-label", archetype.label || archetype.name);
    if (archetype.url) {
      element.href = archetype.url;
    }

    const background = createElement("div", "hsrdv-archetype-bg");
    background.setAttribute("aria-hidden", "true");

    archetype.arts.forEach((artwork) => {
      const artUrl = getArchetypeArtUrl(artwork, settings);
      if (!artUrl) {
        return;
      }

      const panel = createElement("span", "hsrdv-archetype-art-panel");
      const art = createElement("span", "hsrdv-archetype-art");
      art.style.backgroundImage = `url("${artUrl}")`;

      if (artwork && typeof artwork === "object") {
        if (artwork.position || artwork.backgroundPosition) {
          art.style.backgroundPosition = artwork.position || artwork.backgroundPosition;
        }
        if (typeof artwork.scale !== "undefined") {
          art.style.transform = `scale(${artwork.scale})`;
        }
        if (typeof artwork.opacity !== "undefined") {
          panel.style.opacity = String(artwork.opacity);
        }
      }

      panel.appendChild(art);
      background.appendChild(panel);
    });

    const content = createElement("div", "hsrdv-archetype-content");
    const iconUrl = getArchetypeIconUrl(archetype.icon, settings);
    if (iconUrl) {
      const icon = createElement("img", "hsrdv-archetype-icon");
      icon.src = iconUrl;
      icon.alt = archetype.iconAlt || "";
      content.appendChild(icon);
    }

    content.appendChild(createElement("h3", "hsrdv-archetype-title", archetype.name));

    if (archetype.stats.length) {
      const stats = createElement("dl", "hsrdv-archetype-stats");
      archetype.stats.forEach((stat) => {
        const item = createElement("div", "hsrdv-archetype-stat");
        item.appendChild(createElement("dt", "", stat.label || ""));
        item.appendChild(createElement("dd", "", stat.value ?? ""));
        stats.appendChild(item);
      });
      content.appendChild(stats);
    }

    element.appendChild(background);
    element.appendChild(content);
    return element;
  }

  function createStonePortrait(rawPortrait, options) {
    const settings = withDefaults(options);
    const portrait = normalizeStonePortrait(rawPortrait);
    const element = createElement(
      portrait.href ? "a" : "div",
      `hsrdv-stone-portrait${portrait.predicted ? " hsrdv-stone-portrait--predicted" : ""}`
    );
    element.setAttribute("aria-label", portrait.name);
    if (portrait.href) {
      element.href = portrait.href;
    }
    if (portrait.dbfId) {
      element.dataset.dbfId = String(portrait.dbfId);
    }
    if (portrait.id) {
      element.dataset.cardId = portrait.id;
    }

    const artUrl = getStonePortraitArtUrl(portrait, settings);
    if (artUrl) {
      const image = createElement("img", "hsrdv-stone-portrait-art");
      image.src = artUrl;
      image.alt = portrait.name;
      if (portrait.position) {
        image.style.objectPosition = portrait.position;
      }
      element.appendChild(image);
    }

    return element;
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

  function renderArchetypes(target, archetypes, options) {
    const settings = withDefaults(options);
    const container = resolveTarget(target);
    const rootElement = createElement("div", `hsrdv hsrdv-archetypes ${settings.className}`.trim());
    const list = createElement("ul", "hsrdv-archetype-list");

    (archetypes || []).forEach((archetype) => {
      const item = createElement("li");
      item.appendChild(createArchetypeCard(archetype, settings));
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

  function renderStonePortraits(target, portraits, options) {
    const settings = withDefaults(options);
    const container = resolveTarget(target);
    const rootElement = createElement("div", `hsrdv hsrdv-stone-portraits ${settings.className}`.trim());
    const list = createElement("ul", "hsrdv-stone-portrait-list");

    if (settings.stonePortraitFrameImage) {
      rootElement.style.setProperty(
        "--hsrdv-stone-portrait-frame-image",
        `url("${settings.stonePortraitFrameImage}")`
      );
    }

    (portraits || []).forEach((portrait) => {
      const item = createElement("li");
      item.appendChild(createStonePortrait(portrait, settings));
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

  async function renderStonePortraitsFromDbfIds(target, dbfIds, options) {
    const cards = await cardsFromDbfIds(dbfIds, options);
    return renderStonePortraits(target, cards, options);
  }

  return {
    createArchetypeCard,
    createIcon,
    createSquareIcon,
    createStonePortrait,
    createTile,
    cardsFromDbfIds,
    groupCards,
    loadCardDatabase,
    normalizeCard,
    normalizeStonePortrait,
    parseDeckCards,
    renderDeck,
    renderDeckFromDbfIds,
    renderArchetypes,
    renderIcons,
    renderIconsFromDbfIds,
    renderSquareIcons,
    renderSquareIconsFromDbfIds,
    renderStonePortraits,
    renderStonePortraitsFromDbfIds,
    sortCards
  };
});
