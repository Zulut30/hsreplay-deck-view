(function () {
  "use strict";

  const DECK_CARDS = [
    { id: "EDR_451", name: "Гибельная тень", cost: 0, rarity: "LEGENDARY", elite: true, count: 1 },
    { id: "CORE_EX1_145", name: "Подготовка", cost: 0, rarity: "EPIC", count: 2 },
    { id: "CORE_CS2_072", name: "Удар в спину", cost: 0, rarity: "COMMON", count: 2 },
    { id: "EDR_852", name: "Агент Древних", cost: 1, rarity: "RARE", count: 2 },
    { id: "EDR_264", name: "Дежавю", cost: 1, rarity: "RARE", count: 2 },
    { id: "CORE_NEW1_021", name: "Кошмарное топливо", cost: 1, rarity: "COMMON", count: 2 },
    { id: "TLC_835", name: "Ледниковый осколок", cost: 1, rarity: "COMMON", count: 2 },
    { id: "CORE_CFM_604", name: "Веер клинков", cost: 2, rarity: "COMMON", count: 1 },
    { id: "END_020", name: "Карта сектантов", cost: 2, rarity: "RARE", count: 2 },
    { id: "TIME_045", name: "Сумеречный обряд", cost: 2, rarity: "RARE", count: 2 },
    { id: "TLC_248", name: "Безумный приспешник", cost: 3, rarity: "EPIC", count: 2 },
    { id: "TLC_100", name: "Навигатор Элиза", cost: 4, rarity: "LEGENDARY", elite: true, count: 1 },
    { id: "AT_072", name: "Вариан Ринн", cost: 10, rarity: "LEGENDARY", elite: true, count: 1 },
    { id: "CATA_190h", name: "Смертокрыл Разрушитель миров", cost: 10, rarity: "LEGENDARY", elite: true, count: 1 }
  ];

  const RARITY_CARDS = [
    { id: "Core_CS2_008", name: "Лунный огонь", cost: 0, rarity: "FREE", count: 1 },
    { id: "AT_006", name: "Боец из Даларана", cost: 4, rarity: "COMMON", count: 2 },
    { id: "AT_003", name: "Павший герой", cost: 2, rarity: "RARE", count: 2 },
    { id: "AT_061", name: "На изготовку!", cost: 0, rarity: "EPIC", count: 2 },
    { id: "AT_072", name: "Вариан Ринн", cost: 10, rarity: "LEGENDARY", elite: true, count: 1 }
  ];

  const COST_CARDS = [
    { id: "AT_061", name: "На изготовку!", cost: 0, rarity: "EPIC", count: 2 },
    { id: "EDR_264", name: "Дежавю", cost: 1, rarity: "RARE", count: 2 },
    { id: "AT_003", name: "Павший герой", cost: 2, rarity: "RARE", count: 2 },
    { id: "TLC_248", name: "Безумный приспешник", cost: 3, rarity: "EPIC", count: 2 },
    { id: "AT_006", name: "Боец из Даларана", cost: 4, rarity: "COMMON", count: 2 },
    { id: "CORE_CFM_604", name: "Веер клинков", cost: 5, rarity: "COMMON", count: 2 },
    { id: "TLC_835", name: "Ледниковый осколок", cost: 6, rarity: "EPIC", count: 2 },
    { id: "TLC_100", name: "Навигатор Элиза", cost: 7, rarity: "LEGENDARY", elite: true, count: 1 },
    { id: "END_020", name: "Синестра", cost: 8, rarity: "LEGENDARY", elite: true, count: 1 },
    { id: "TIME_045", name: "Сумеречная госпожа", cost: 9, rarity: "EPIC", count: 2 },
    { id: "CATA_190h", name: "Смертокрыл Разрушитель миров", cost: 10, rarity: "LEGENDARY", elite: true, count: 1 }
  ];

  const ARCHETYPES = [
    {
      name: "Манипулятор маг",
      icon: "CS2_029",
      stats: [
        { label: "Побед", value: "52,4%" },
        { label: "Игр", value: "12 800" },
        { label: "Tier", value: "1" }
      ],
      arts: [
        { id: "EDR_451", position: "center center" },
        { id: "EDR_852", position: "center center" },
        { id: "EDR_264", position: "center center" }
      ]
    },
    {
      name: "Rafaam Warlock",
      icon: "CS2_056",
      stats: [
        { label: "Побед", value: "48,8%" },
        { label: "Игр", value: "4 300" },
        { label: "Tier", value: "2" }
      ],
      arts: [
        { id: "CORE_CFM_604", position: "center center" },
        { id: "TLC_835", position: "center center" },
        { id: "CORE_NEW1_021", position: "center center" }
      ]
    },
    {
      name: "Контроль жрец",
      icon: "CS2_034",
      stats: [
        { label: "Побед", value: "46,1%" },
        { label: "Игр", value: "2 000" },
        { label: "Tier", value: "3" }
      ],
      arts: [
        { id: "END_020", position: "center center" },
        { id: "TIME_045", position: "center center" },
        { id: "TLC_248", position: "center center" }
      ]
    }
  ];

  const STONE_PORTRAITS = [
    {
      id: "BGS_018",
      name: "Голдринн, Великий волк",
      position: "50% 34%"
    }
  ];

  const SYNERGIES = [
    {
      title: "Tempo setup",
      subtitle: "Дешевая подготовка, генератор ресурса и payoff в один сильный ход.",
      eyebrow: "Combo",
      badge: "+ chain",
      connector: "plus",
      items: [
        { id: "CORE_EX1_145", name: "Подготовка", rarity: "EPIC", label: "discount", count: 2 },
        { id: "EDR_852", name: "Агент Древних", rarity: "RARE", label: "resource", count: 2 },
        { id: "TIME_045", name: "Сумеречный обряд", rarity: "RARE", label: "payoff", count: 2 }
      ],
      result: {
        label: "Итог",
        value: "ранний темп и полный refill руки"
      }
    },
    {
      title: "Battlegrounds scaling line",
      subtitle: "Показывает порядок: ключевой зверь, бафф и финальный большой стол.",
      eyebrow: "BG link",
      badge: "arrow",
      connector: "arrow",
      items: [
        { id: "BGS_018", name: "Голдринн", rarity: "LEGENDARY", elite: true, label: "core" },
        { id: "TLC_835", name: "Ледниковый осколок", rarity: "COMMON", label: "trigger", count: 2 },
        { id: "CATA_190h", name: "Финишер", rarity: "LEGENDARY", elite: true, label: "board" }
      ],
      result: "Понятный порядок действий для гайда или разбора"
    }
  ];

  const MULLIGANS = [
    {
      title: "Imbue Rogue mulligan",
      subtitle: "Стартовая рука против поля: быстрый темп, добор и один ситуативный keep.",
      badge: "ranked",
      cards: [
        { id: "CORE_EX1_145", name: "Подготовка", rarity: "EPIC", keepRate: 74.2, winrate: 55.8, status: "keep", note: "лучший темповый старт", count: 2 },
        { id: "EDR_852", name: "Агент Древних", rarity: "RARE", keepRate: 68.1, winrate: 54.6, status: "keep", note: "оставлять почти всегда", count: 2 },
        { id: "END_020", name: "Карта сектантов", rarity: "RARE", keepRate: 49.4, winrate: 51.1, status: "situational", note: "лучше с монеткой", count: 2 },
        { id: "CATA_190h", name: "Смертокрыл", rarity: "LEGENDARY", keepRate: 11.8, winrate: 43.2, status: "replace", note: "слишком тяжелая карта" }
      ]
    },
    {
      title: "Control opener",
      subtitle: "Оставляем ранний ответ и ресурс, дорогие payoff-карты меняем.",
      badge: "vs aggro",
      cards: [
        { id: "CORE_CS2_072", name: "Удар в спину", rarity: "COMMON", keepRate: 81.4, winrate: 57.3, status: "keep", count: 2 },
        { id: "TLC_835", name: "Ледниковый осколок", rarity: "COMMON", keepRate: 63.9, winrate: 52.8, status: "keep", count: 2 },
        { id: "TIME_045", name: "Сумеречный обряд", rarity: "RARE", keepRate: 42.5, winrate: 49.6, status: "situational", count: 2 },
        { id: "AT_072", name: "Вариан Ринн", rarity: "LEGENDARY", keepRate: 8.7, winrate: 41.9, status: "replace" }
      ]
    }
  ];

  const MATCHUPS = [
    {
      name: "Spell Mage",
      className: "Mage",
      icon: "CS2_029",
      winrate: 56.4,
      games: 3240,
      status: "favored",
      cards: [
        { id: "CORE_EX1_145", name: "Подготовка", rarity: "EPIC", count: 2 },
        { id: "EDR_852", name: "Агент Древних", rarity: "RARE", count: 2 },
        { id: "TLC_100", name: "Навигатор Элиза", rarity: "LEGENDARY", elite: true }
      ]
    },
    {
      name: "Handbuff Paladin",
      className: "Paladin",
      icon: "CS2_087",
      winrate: 50.8,
      games: 2180,
      status: "even",
      cards: [
        { id: "CORE_CS2_072", name: "Удар в спину", rarity: "COMMON", count: 2 },
        { id: "END_020", name: "Карта сектантов", rarity: "RARE", count: 2 },
        { id: "TIME_045", name: "Сумеречный обряд", rarity: "RARE", count: 2 }
      ]
    },
    {
      name: "Token Hunter",
      className: "Hunter",
      icon: "DS1_185",
      winrate: 44.7,
      games: 1560,
      status: "unfavored",
      cards: [
        { id: "TLC_835", name: "Ледниковый осколок", rarity: "COMMON", count: 2 },
        { id: "CORE_CFM_604", name: "Веер клинков", rarity: "COMMON" },
        { id: "CATA_190h", name: "Смертокрыл", rarity: "LEGENDARY", elite: true }
      ]
    }
  ];

  const META_BADGES = [
    { kind: "tier-1", label: "Tier 1", title: "Meta leader", value: "56,4%", delta: "+2,1%", description: "Стабильный лидер с хорошими матчапами против популярных колод." },
    { kind: "tier-2", label: "Tier 2", title: "Solid ladder", value: "51,8%", delta: "+0,4%", description: "Надежный выбор без явного доминирования в поле." },
    { kind: "counter", label: "Counter", title: "Anti-aggro pick", value: "61%", delta: "target", description: "Берется против конкретного популярного архетипа." },
    { kind: "meme", label: "Meme", title: "Fun build", value: "47%", delta: "spicy", description: "Играбельно, но ценность больше в идее и зрелищности." },
    { kind: "rising", label: "Rising", title: "Climbing", value: "+18%", delta: "new", description: "Быстро набирает игры и может стать новым стандартом." },
    { kind: "falling", label: "Falling", title: "Losing ground", value: "-9%", delta: "down", description: "Сдает позиции из-за новых контр-колод и плохих матчапов." }
  ];

  const COST_CURVES = [
    {
      title: "Imbue Rogue curve",
      subtitle: "Низкая кривая с несколькими поздними payoff-картами.",
      badge: "30 cards",
      buckets: [5, 8, 7, 3, 2, 1, 1, 3]
    },
    {
      title: "From card objects",
      subtitle: "Та же гистограмма может считаться прямо из массива карт.",
      cards: DECK_CARDS
    }
  ];

  function render() {
    const api = window.HSReplayDeckView;
    if (!api) {
      return;
    }

    api.renderDeck("#hero-deck", DECK_CARDS.slice(0, 5), {
      group: false,
      sort: false
    });
    api.renderIcons("#hero-icons", DECK_CARDS.slice(0, 10), {
      group: false,
      sort: false
    });
    api.renderSquareIcons("#hero-squares", DECK_CARDS.slice(3, 12), {
      group: false,
      sort: false
    });
    api.renderArchetypes("#hero-archetype", ARCHETYPES.slice(0, 1).map((archetype) => ({
      name: archetype.name,
      icon: archetype.icon,
      arts: archetype.arts
    })));
    api.renderStonePortraits("#hero-stone", STONE_PORTRAITS);
    api.renderSynergies("#hero-synergy", SYNERGIES.slice(0, 1));
    api.renderMulligans("#hero-mulligan", MULLIGANS.slice(0, 1));
    api.renderMatchups("#hero-matchup", MATCHUPS.slice(0, 2));
    api.renderMetaBadges("#hero-meta", META_BADGES.slice(0, 3));
    api.renderCostCurve("#hero-cost-curve", COST_CURVES[0]);

    api.renderDeck("#sample-deck", DECK_CARDS, {
      group: false,
      sort: true
    });
    api.renderIcons("#sample-icons", DECK_CARDS, {
      group: false,
      sort: false
    });
    api.renderSquareIcons("#sample-squares", DECK_CARDS, {
      group: false,
      sort: false
    });
    api.renderArchetypes("#sample-archetypes", ARCHETYPES);
    api.renderStonePortraits("#sample-stone", STONE_PORTRAITS);
    api.renderSynergies("#sample-synergies", SYNERGIES);
    api.renderMulligans("#sample-mulligans", MULLIGANS);
    api.renderMatchups("#sample-matchups", MATCHUPS);
    api.renderMetaBadges("#sample-meta-badges", META_BADGES);
    api.renderCostCurves("#sample-cost-curves", COST_CURVES);

    api.renderDeck("#rarity-showcase", RARITY_CARDS, {
      group: false,
      sort: false
    });
    api.renderDeck("#cost-showcase", COST_CARDS, {
      group: false,
      sort: false
    });
  }

  render();
})();
