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
