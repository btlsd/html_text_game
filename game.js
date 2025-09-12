const locationNameEl = document.getElementById('location-name');
const locationDescEl = document.getElementById('location-description');
const timeDisplayEl = document.getElementById('time-display');
const npcListEl = document.getElementById('npc-list');
const npcInteractionListEl = document.getElementById('npc-interaction-list');
const actionMenusEl = document.getElementById('action-menus');
const actionListEl = document.getElementById('action-list');
const npcSectionEl = document.getElementById('npcs');
const actionSectionEl = document.getElementById('actions');
const npcHeaderEl = document.getElementById('npc-header');
const moveHeaderEl = document.getElementById('move-header');
const actionHeaderEl = document.getElementById('action-header');
const menuHeaderEl = document.getElementById('menu-header');
const menuSectionEl = document.getElementById('game-menu');
const gameMenuListEl = document.getElementById('game-menu-list');
const inventoryUIEl = document.getElementById('inventory-ui');
const inventoryTabsEl = document.getElementById('inventory-tabs');
const inventorySubtabsEl = document.getElementById('inventory-subtabs');
const inventoryItemsEl = document.getElementById('inventory-items');
const inventoryStatListEl = document.getElementById('inventory-stat-list');
const inventoryConditionListEl = document.getElementById('inventory-condition-list');
const equipRightHandEl = document.getElementById('equip-rightHand');
const equipLeftHandEl = document.getElementById('equip-leftHand');
const equipHeadEl = document.getElementById('equip-head');
const equipTopEl = document.getElementById('equip-top');
const equipBottomEl = document.getElementById('equip-bottom');
const equipBackEl = document.getElementById('equip-back');
const equipGlovesEl = document.getElementById('equip-gloves');
const equipShoesEl = document.getElementById('equip-shoes');
const closeInventoryEl = document.getElementById('close-inventory');
const tradeUIEl = document.getElementById('trade-ui');
const tradeLogEl = document.getElementById('trade-log');
const tradeAssetsEl = document.getElementById('trade-assets');
const shopTabsEl = document.getElementById('shop-tabs');
const shopItemListEl = document.getElementById('shop-item-list');
const shopInventoryListEl = document.getElementById('shop-inventory-list');
const closeTradeEl = document.getElementById('close-trade');
const hpBarEl = document.getElementById('hp-bar');
const hpTextEl = document.getElementById('hp-text');
const staminaBarEl = document.getElementById('stamina-bar');
const staminaTextEl = document.getElementById('stamina-text');
const preservationTextEl = document.getElementById('preservation-text');
const activityPointsTextEl = document.getElementById('activity-points-text');
const moneyTextEl = document.getElementById('money-text');
const battleUIEl = document.getElementById('battle-ui');
const enemyNameEl = document.getElementById('enemy-name');
const enemyHpBarEl = document.getElementById('enemy-hp-bar');
const enemyHpTextEl = document.getElementById('enemy-hp-text');
const battleMenuEl = document.getElementById('battle-menu');
const battleSubmenuEl = document.getElementById('battle-submenu');
const battleLogEl = document.getElementById('battle-log');
const playerHpBarBattleEl = document.getElementById('player-hp-bar');
const playerHpTextBattleEl = document.getElementById('player-hp-text');
const playerStaminaBarBattleEl = document.getElementById('player-stamina-bar');
const playerStaminaTextBattleEl = document.getElementById('player-stamina-text');
const playerTurnBarEl = document.getElementById('player-turn-bar');
const playerCommandEl = document.getElementById('player-command');
const submitCommandEl = document.getElementById('submit-command');
const statusUIEl = document.getElementById('status-ui');
const statListEl = document.getElementById('stat-list');
const extraStatsEl = document.getElementById('extra-stats');
const statusDescEl = document.getElementById('status-description');
const statusConfirmEl = document.getElementById('status-confirm');
const closeStatusEl = document.getElementById('close-status');
const conditionListEl = document.getElementById('condition-list');
const flashOverlayEl = document.getElementById('flash-overlay');
const battleResultEl = document.getElementById('battle-result');
const battleResultStatsEl = document.getElementById('battle-result-stats');
const battleOutcomeEl = document.getElementById('battle-outcome');
const battleResultCloseEl = document.getElementById('battle-result-close');
const questUIEl = document.getElementById('quest-ui');
const questListEl = document.getElementById('quest-list');
const closeQuestEl = document.getElementById('close-quest');
const butcheringUIEl = document.getElementById('butchering-ui');
const butcherBarEl = document.getElementById('butcher-bar');
const butcherArrowEl = document.getElementById('butcher-arrow');
const butcherResultEl = document.getElementById('butcher-result');
const skillsUIEl = document.getElementById('skills-ui');
const skillListEl = document.getElementById('skill-list');
const closeSkillsEl = document.getElementById('close-skills');
const hackingUIEl = document.getElementById('hacking-ui');
const hackingCodeEl = document.getElementById('hacking-code');
const hackingGaugeEl = document.getElementById('hacking-gauge');
const hackingTimerEl = document.getElementById('hacking-timer');
const hackingResultEl = document.getElementById('hacking-result');
const xpBarEl = document.getElementById('xp-bar');
const xpTextEl = document.getElementById('xp-text');
const logEl = document.getElementById('log');

const slotDisplayNames = {
  head: '머리',
  top: '상의',
  bottom: '하의',
  back: '등',
  gloves: '장갑',
  shoes: '신발'
};

const statDisplayNames = {
  strength: '힘',
  perception: '지각',
  endurance: '지구력',
  charisma: '매력',
  intelligence: '지능',
  agility: '민첩'
};

const conditionDisplayNames = {
  guild_access: '길드 출입 자격',
  weapon: '무기 장착',
  weapon_melee: '냉병기 장착',
  weapon_blunt: '둔기 장착',
  weapon_firearm: '화기 장착',
  weapon_energy: '에너지무기 장착',
  at_mercenary_office: '용병 사무소',
  at_office_lounge: '휴게실',
  at_city_shop: '상점가'
};

const currencyDisplayNames = {
  money: '원'
};

let debugMode = false;
const questDefs = {};
const activeQuests = [];
const completedQuests = new Set();

const player = {
  stats: {
    strength: 5,
    perception: 5,
    endurance: 5,
    charisma: 5,
    intelligence: 5,
    agility: 5
  },
  hp: 0,
  stamina: 0,
  activityPoints: 0,
  money: 0,
  preservation: 0,
  extraStats: 0,
  tempStats: {},
  level: 1,
  xp: 0,
  totalXp: 0,
  conditions: new Set(),
  actionStats: {},
  skillStats: {}
};

function getMaxHpFor(stats) {
  return stats.endurance * 10 + stats.strength * 5;
}

function getMaxHp() {
  return getMaxHpFor(player.stats);
}

function getMaxStamina() {
  return player.stats.endurance * 8 + player.stats.charisma * 4;
}

function evaluateCondition(cond) {
  if (!cond) return true;
  if (typeof cond === 'string') {
    const def = conditionDefs[cond];
    return def ? evaluateCondition(def) : player.conditions.has(cond);
  }
  if (Array.isArray(cond)) {
    return cond.every(evaluateCondition);
  }
  if (cond.all) {
    return cond.all.every(evaluateCondition);
  }
  if (cond.any) {
    return cond.any.some(evaluateCondition);
  }
  return false;
}

function isAvailable(entity) {
  return evaluateCondition(entity && entity.conditions);
}

function filterAvailable(list) {
  return list.filter(isAvailable);
}

const levelThresholds = [10, 100, 1000, 10000];

function getTechniqueStat(store, key) {
  if (!store[key]) {
    store[key] = { level: 1, usage: 0, big: 0, success: 0, fail: 0 };
  }
  return store[key];
}

function gainTechniqueUsage(store, key, result, amount = 1) {
  const stat = getTechniqueStat(store, key);
  stat.usage += amount;
  if (result === 'big') stat.big += amount;
  else if (result === 'success') stat.success += amount;
  else if (result === 'fail') stat.fail += amount;
  while (stat.level < 5 && stat.usage >= levelThresholds[stat.level - 1]) {
    stat.level++;
  }
  return stat;
}

function getTechniqueName(key) {
  const act = actions.find(a => a.key === key);
  if (act) return act.name;
  const sk = skills.find(s => s.key === key);
  if (sk) return sk.name;
  return key;
}

function recordAction(key, result = 'success', amount = 1) {
  gainTechniqueUsage(player.actionStats, key, result, amount);
}

function recordSkillUsage(key, result = 'success', amount = 1) {
  gainTechniqueUsage(player.skillStats, key, result, amount);
}

function studyFromBook(key, amount = 1) {
  if (actions.some(a => a.key === key)) {
    recordAction(key, 'success', amount);
  } else {
    recordSkillUsage(key, 'success', amount);
  }
}

function trainSkill(npc, key) {
  const npcLevel = (npc.skills && npc.skills[key]) || 0;
  const store = actions.some(a => a.key === key) ? player.actionStats : player.skillStats;
  const stat = getTechniqueStat(store, key);
  if (npcLevel <= stat.level) {
    addLog(`${npc.name}에게서 배울 것이 없다.`);
    addLogSeparator(logEl);
    return false;
  }
  if ((npc.relationship || 0) < 50) {
    if (player.money < 10) {
      addLog('돈이 부족하다.');
      addLogSeparator(logEl);
      return false;
    }
    player.money -= 10;
  }
  addLog(`${npc.name}에게 ${getTechniqueName(key)}을 배웠다.`);
  addLogSeparator(logEl);
  gainTechniqueUsage(store, key, 'success', 5);
  return true;
}

function toMenuOptions(list, getLabel) {
  const labelFn = getLabel || (item => item);
  return [...list.map(labelFn), '뒤로'];
}

function getXpForNextLevel() {
  return player.level * 100;
}

function calculateHit(attacker, defender, accuracyMultiplier = 1) {
  const acc = attacker.perception;
  const eva = defender.agility;
  let chance = acc / (acc + eva);
  chance *= accuracyMultiplier;
  if (chance < 0) chance = 0;
  if (chance > 1) chance = 1;
  const roll = Math.random();
  const result = roll < chance;
  debugLog(`calculateHit acc:${acc} eva:${eva} mult:${accuracyMultiplier} chance:${chance.toFixed(2)} roll:${roll.toFixed(2)} => ${result}`, battleState ? battleLogEl : logEl);
  return result;
}

function calculateDamage(attacker, defender, weapon = null, defending = false) {
  let dmg;
  if (weapon && weapon.type === 'weapon') {
    const props = weapon.properties || {};
    if ((weapon.subtype === 'firearm' || weapon.subtype === 'energy') && props.fixedDamage != null) {
      dmg = props.fixedDamage;
    } else {
      const strWeight = Math.min(Math.max(props.strWeight || 50, 1), 99);
      const agiWeight = 100 - strWeight;
      const damageStat = attacker.strength * (strWeight / 100) + attacker.agility * (agiWeight / 100);
      const multiplier = props.multiplier || 1;
      const bonus = props.bonus || 0;
      dmg = damageStat * multiplier + bonus;
    }
  } else {
    dmg = attacker.strength + 5;
  }
  if (defending) {
    dmg = Math.max(0, dmg - defender.endurance);
  }
  const finalDmg = Math.round(dmg);
  const weaponName = weapon ? (weapon.name || 'weapon') : 'none';
  debugLog(`calculateDamage atkStr:${attacker.strength} atkAgi:${attacker.agility} defEnd:${defender.endurance} weapon:${weaponName} defending:${defending} => ${finalDmg}`, battleState ? battleLogEl : logEl);
  return finalDmg;
}

player.hp = getMaxHp();
player.stamina = getMaxStamina();
player.activityPoints = 50;
player.money = 100;
player.preservation = 24;

let npcData = {};

let battleState = null;
let battleItemList = [];
let battleSkillList = [];

let actions = [];
let skills = [];
let conditionDefs = {};
let locations = {};
let items = {};
let inventory = [];
let equipment = {};
let categories = [];
const mercenaryShop = {
  currency: 'money',
  allowSell: true,
  categories: {
    weapons: {
      label: '무기',
      items: [
        { id: 'iron_sword', price: 30 }
      ]
    },
    armor: {
      label: '방어구',
      items: [
        { id: 'leather_armor', price: 25 }
      ]
    }
  }
};
let currentShop = null;
let currentShopCategory = '';
let shopAllowSell = false;
let shopCurrency = 'money';
let currentLocation = '';
let currentMenu = 'main';
let currentNpc = '';
let currentNpcIndex = -1;
let currentCategory = '';
let currentSubcategory = null;
let actionMenuStack = [];
let currentTime = 8;
let currentLocationGrants = new Set();
let currentLocationAttitude = 'neutral';

function getTimeSegment() {
  if (currentTime >= 4 && currentTime <= 7) return { key: 'morning', name: '아침' };
  if (currentTime >= 8 && currentTime <= 11) return { key: 'day', name: '낮' };
  if (currentTime >= 12 && currentTime <= 15) return { key: 'afternoon', name: '오후' };
  if (currentTime >= 16 && currentTime <= 19) return { key: 'evening', name: '저녁' };
  if (currentTime >= 20 && currentTime <= 23) return { key: 'night', name: '밤' };
  return { key: 'lateNight', name: '심야' };
}

function isWithinTime(range) {
  if (!range) return true;
  const start = range.start ?? 0;
  const end = range.end ?? 24;
  if (start <= end) {
    return currentTime >= start && currentTime < end;
  }
  return currentTime >= start || currentTime < end;
}

function addLog(message) {
  const entry = document.createElement('div');
  entry.textContent = message;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

function debugLog(message, target = logEl) {
  if (!debugMode) return;
  const entry = document.createElement('div');
  entry.textContent = `[DEBUG] ${message}`;
  target.appendChild(entry);
  target.scrollTop = target.scrollHeight;
}

function addLogSeparator(target) {
  const hr = document.createElement('hr');
  hr.className = 'log-separator';
  target.appendChild(hr);
  target.scrollTop = target.scrollHeight;
}

function logLocation() {
  const loc = locations[currentLocation];
  const seg = getTimeSegment();
  addLog(`${seg.name} ${String(currentTime).padStart(2, '0')}:00`);
  if (loc && loc.name) addLog(`장소: ${loc.name}`);
  const desc = loc && loc.descriptions && loc.descriptions[seg.key]
    ? loc.descriptions[seg.key]
    : loc
    ? loc.description
    : '';
  if (desc) addLog(desc);
  const moodMap = { positive: '긍정적', neutral: '중립적', negative: '부정적' };
  addLog(`분위기: ${moodMap[currentLocationAttitude] || currentLocationAttitude}`);
}

function logNpcDescription(npc) {
  const info = npcData[npc];
  if (info && info.description) {
    addLog(info.description);
  }
}

function getLocationAttitude(loc) {
  if (!loc || !loc.attitudes) return 'neutral';
  if (evaluateCondition(loc.attitudes.positive)) return 'positive';
  if (evaluateCondition(loc.attitudes.neutral)) return 'neutral';
  return 'negative';
}

function updateLocationAttitude() {
  const loc = locations[currentLocation];
  let attitude = getLocationAttitude(loc);
  if (loc && loc.entry) {
    if (loc.entry.conditions && !evaluateCondition(loc.entry.conditions)) attitude = 'negative';
    if (loc.entry.time && !isWithinTime(loc.entry.time)) attitude = 'negative';
  }
  currentLocationAttitude = attitude;
}

function applyLocationGrants(loc) {
  currentLocationGrants.forEach(cond => player.conditions.delete(cond));
  currentLocationGrants.clear();
  if (loc && Array.isArray(loc.grantConditions)) {
    loc.grantConditions.forEach(cond => {
      player.conditions.add(cond);
      currentLocationGrants.add(cond);
    });
  }
}

function advanceTime(hours = 1) {
  const prevTime = currentTime;
  const prevPreservation = player.preservation;
  currentTime = (currentTime + hours) % 24;
  player.preservation = Math.max(0, player.preservation - hours);
  debugLog(`advanceTime hours:${hours} time:${prevTime}->${currentTime} preservation:${prevPreservation}->${player.preservation}`);
  if (player.preservation === 0) {
    addLog('보존 기간이 끝났습니다. 당신은 사망했습니다.');
    alert('보존 기간이 끝났습니다. 게임이 초기화됩니다.');
    location.reload();
    return;
  }
  updateLocationAttitude();
  render();
  logLocation();
  addLogSeparator(logEl);
}

function updateHeaders() {
  if (currentMenu === 'main') {
    npcHeaderEl.textContent = '1. 개체';
    moveHeaderEl.textContent = '2. 이동';
    actionHeaderEl.textContent = '3. 행동';
    menuHeaderEl.textContent = '4. 메뉴';
  } else {
    npcHeaderEl.textContent = '개체';
    moveHeaderEl.textContent = '이동';
    actionHeaderEl.textContent = '행동';
    menuHeaderEl.textContent = '메뉴';
  }
}

function render() {
  const loc = locations[currentLocation];
  const seg = getTimeSegment();
  locationNameEl.textContent = loc && loc.name ? loc.name : '???';
  if (timeDisplayEl) {
    timeDisplayEl.textContent = `${seg.name} ${String(currentTime).padStart(2, '0')}:00`;
  }
  const desc = loc && loc.descriptions && loc.descriptions[seg.key]
    ? loc.descriptions[seg.key]
    : loc
    ? loc.description
    : '';
  if (locationDescEl) {
    locationDescEl.textContent = desc;
  }
  const maxHp = getMaxHp();
  const maxStamina = getMaxStamina();
  hpBarEl.style.width = `${(player.hp / maxHp) * 100}%`;
  hpTextEl.textContent = `${player.hp}/${maxHp}`;
  staminaBarEl.style.width = `${(player.stamina / maxStamina) * 100}%`;
  staminaTextEl.textContent = `${player.stamina}/${maxStamina}`;
  preservationTextEl.textContent = `${player.preservation}`;
  activityPointsTextEl.textContent = `${player.activityPoints}`;
  moneyTextEl.textContent = `${player.money}`;
}

function renderNpcList() {
  const loc = locations[currentLocation];
  const npcs = loc && Array.isArray(loc.npcs)
    ? loc.npcs.slice().sort((a, b) => a.localeCompare(b))
    : [];
  npcListEl.innerHTML = '';
  npcs.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    npcListEl.appendChild(li);
  });
}

function highlightItem(listEl, index) {
  const items = listEl.querySelectorAll('li');
  items.forEach((li, idx) => {
    if (idx === index) {
      li.classList.add('selected');
    } else {
      li.classList.remove('selected');
    }
  });
}

function displayMenu(listEl, items, onSelect) {
  listEl.innerHTML = '';
  const elements = items.map((text, idx) => {
    const li = document.createElement('li');
    li.style.display = 'none';
    li.textContent = '';
    if (onSelect) {
      li.addEventListener('click', () => {
        highlightItem(listEl, idx);
        onSelect(idx);
      });
    }
    listEl.appendChild(li);
    return { li, fullText: `${idx + 1}. ${text}` };
  });

  let index = 0;
  function showNext() {
    if (index >= elements.length) {
      return;
    }
    const el = elements[index];
    el.li.style.display = '';
    let char = 0;
    const interval = setInterval(() => {
      if (char < el.fullText.length) {
        el.li.textContent += el.fullText.charAt(char++);
      } else {
        clearInterval(interval);
        index++;
        showNext();
      }
    }, 50);
  }
  setTimeout(showNext, 300);
}

function setActionMenu(level, items, onSelect) {
  while (actionMenuStack.length <= level) {
    const ul = document.createElement('ul');
    ul.style.display = 'none';
    actionMenusEl.appendChild(ul);
    actionMenuStack.push({ ul, items: [], onSelect: null });
  }
  for (let i = actionMenuStack.length - 1; i > level; i--) {
    actionMenusEl.removeChild(actionMenuStack[i].ul);
    actionMenuStack.pop();
  }
  const levelObj = actionMenuStack[level];
  displayMenu(levelObj.ul, items, (idx) => onSelect(idx));
  levelObj.ul.style.display = 'block';
  levelObj.items = items;
  levelObj.onSelect = onSelect;
}

function clearActionMenusFrom(level) {
  for (let i = actionMenuStack.length - 1; i >= level; i--) {
    actionMenusEl.removeChild(actionMenuStack[i].ul);
    actionMenuStack.pop();
  }
}

function performMove() {
  currentMenu = 'move';
  currentNpc = '';
  updateHeaders();
  renderNpcList();
  npcInteractionListEl.innerHTML = '';
  npcInteractionListEl.style.display = 'none';
  npcListEl.querySelectorAll('li').forEach(li => li.classList.remove('selected'));

  actionMenusEl.innerHTML = '';
  gameMenuListEl.innerHTML = '';
  actionMenuStack = [{ ul: actionListEl, items: [], onSelect: null }];
  actionMenusEl.appendChild(actionListEl);

  const loc = locations[currentLocation];
  const connections = loc && Array.isArray(loc.connections) ? loc.connections : [];
  setActionMenu(0, toMenuOptions(connections, id => (locations[id] && locations[id].name) ? locations[id].name : id), (idx) => {
    if (idx === connections.length) {
      showMainMenu();
    } else {
      tryMove(connections[idx]);
    }
  });

  actionSectionEl.classList.add('active');
  npcSectionEl.classList.add('active');
  menuSectionEl.classList.remove('active');
}

function tryMove(target) {
  const loc = locations[target];
  if (!loc) return;
  if (loc.entry && loc.entry.locked && !evaluateCondition(loc.entry.locked)) {
    addLog('문이 잠겨 있습니다.');
    addLogSeparator(logEl);
    return;
  }
  const entryDenied = loc.entry && (
    (loc.entry.conditions && !evaluateCondition(loc.entry.conditions)) ||
    (loc.entry.time && !isWithinTime(loc.entry.time))
  );
  currentLocation = target;
  applyLocationGrants(loc);
  updateLocationAttitude();
  advanceTime();
  if (entryDenied) addLog('당신은 몰래 침입했습니다.');
  showMainMenu();
}

function openGameMenu() {
  currentMenu = 'gameMenu';
  currentNpc = '';
  updateHeaders();
  renderNpcList();
  npcInteractionListEl.innerHTML = '';
  npcInteractionListEl.style.display = 'none';
  npcListEl.querySelectorAll('li').forEach(li => li.classList.remove('selected'));

  gameMenuListEl.innerHTML = '';
  const items = ['상태', '기술', '소지품', '의뢰', '설정', '뒤로'];
  displayMenu(gameMenuListEl, items, (idx) => {
    if (idx === 0) {
      openStatusMenu();
      advanceTime();
    } else if (idx === 1) {
      openGameMenuSkills();
    } else if (idx === 2) {
      openInventory();
    } else if (idx === 3) {
      openQuestMenu();
    } else if (idx === 4) {
      openSettingsMenu();
    } else {
      showMainMenu();
    }
  });
  menuSectionEl.classList.add('active');
  npcSectionEl.classList.add('active');
  actionSectionEl.classList.remove('active');
}

function openGameMenuSkills() {
  currentMenu = 'skills';
  document.getElementById('location').style.display = 'none';
  npcSectionEl.style.display = 'none';
  actionSectionEl.style.display = 'none';
  document.getElementById('status').style.display = 'none';
  document.getElementById('player-input-container').style.display = 'none';
  menuSectionEl.style.display = 'none';
  skillListEl.innerHTML = '';
  const all = [];
  actions.forEach(a => {
    const stat = getTechniqueStat(player.actionStats, a.key);
    let text = `${a.name} Lv${stat.level} ${stat.usage}회`;
    if (stat.big + stat.success + stat.fail > 0) {
      text += ` (대성공${stat.big}/성공${stat.success}/실패${stat.fail})`;
    }
    all.push(text);
  });
  skills.forEach(s => {
    const stat = getTechniqueStat(player.skillStats, s.key);
    let text = `${s.name} Lv${stat.level} ${stat.usage}회`;
    if (stat.big + stat.success + stat.fail > 0) {
      text += ` (대성공${stat.big}/성공${stat.success}/실패${stat.fail})`;
    }
    all.push(text);
  });
  all.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    skillListEl.appendChild(li);
  });
  skillsUIEl.style.display = 'block';
}

function openSettingsMenu() {
  currentMenu = 'settings';
  const items = [`디버그: ${debugMode ? 'ON' : 'OFF'}`, '뒤로'];
  displayMenu(gameMenuListEl, items, (idx) => {
    if (idx === 0) {
      debugMode = !debugMode;
      addLog(`디버그 모드가 ${debugMode ? '켜졌습니다' : '꺼졌습니다'}.`);
      addLogSeparator(logEl);
      openSettingsMenu();
    } else {
      openGameMenu();
    }
  });
}

function showMainMenu() {
  currentMenu = 'main';
  currentNpc = '';
  updateHeaders();
  renderNpcList();
  actionMenusEl.innerHTML = '';
  actionMenuStack = [];
  gameMenuListEl.innerHTML = '';
  npcInteractionListEl.innerHTML = '';
  npcInteractionListEl.style.display = 'none';
  npcListEl.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
  npcSectionEl.classList.add('active');
  actionSectionEl.classList.remove('active');
  menuSectionEl.classList.remove('active');
  menuSectionEl.style.display = '';
  inventoryUIEl.style.display = 'none';
  statusUIEl.style.display = 'none';
  document.getElementById('location').style.display = '';
  npcSectionEl.style.display = '';
  actionSectionEl.style.display = '';
  menuSectionEl.style.display = '';
  document.getElementById('status').style.display = '';
  document.getElementById('player-input-container').style.display = '';
}

function openNpcMenu() {
  currentMenu = 'npcs';
  currentNpc = '';
  updateHeaders();
  const loc = locations[currentLocation];
  const npcs = loc && Array.isArray(loc.npcs)
    ? loc.npcs.slice().sort((a, b) => a.localeCompare(b))
    : [];
  const items = [...npcs, '뒤로'];
  displayMenu(npcListEl, items, (idx) => {
    if (idx === npcs.length) {
      showMainMenu();
    } else {
      openNpcInteractions(npcs[idx], idx);
    }
  });
  npcInteractionListEl.innerHTML = '';
  npcInteractionListEl.style.display = 'none';
  npcSectionEl.classList.add('active');
  actionSectionEl.classList.remove('active');
  menuSectionEl.classList.remove('active');
}

function getNpcActions(npc) {
  const info = npcData[npc];
  if (info && info.hostile) {
    return ['전투'];
  }
  const actions = ['대화'];
  if (npc === '사무원') actions.push('의뢰');
  const deliverable = activeQuests.find(q => q.type === 'delivery' && q.recipient === npc && inventory.includes(q.item));
  if (deliverable) actions.push('전달');
  actions.push('관찰');
  if (info && info.skills) actions.push('훈련');
  return actions;
}

function startBattle(npc) {
  const enemyTemplate = npcData[npc];
  if (!enemyTemplate) return;
  const maxHp = getMaxHpFor(enemyTemplate.stats);
  battleState = {
    enemy: { ...enemyTemplate, hp: maxHp, maxHp },
    defending: false,
    log: [],
    stats: { damageDealt: 0, damageTaken: 0, skillUsage: {} },
    preXp: player.xp,
    preXpNeeded: getXpForNextLevel(),
    playerGauge: 0,
    enemyGauge: 0,
    playerReady: false,
    processing: false,
    intervalId: null
  };
  debugLog(`startBattle enemy:${enemyTemplate.name} hp:${maxHp}`, battleLogEl);
  document.getElementById('location').style.display = 'none';
  npcSectionEl.style.display = 'none';
  actionSectionEl.style.display = 'none';
  menuSectionEl.style.display = 'none';
  document.getElementById('status').style.display = 'none';
  battleResultEl.style.display = 'none';
  battleLogEl.innerHTML = '';
  battleUIEl.style.display = 'flex';
  renderBattle();
  battleState.intervalId = setInterval(updateBattleTurn, 100);
}

function renderBattle() {
  if (!battleState) return;
  const enemy = battleState.enemy;
  enemyNameEl.textContent = enemy.name;
  enemyHpBarEl.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
  enemyHpTextEl.textContent = `${enemy.hp}/${enemy.maxHp}`;
  const maxHp = getMaxHp();
  playerHpBarBattleEl.style.width = `${(player.hp / maxHp) * 100}%`;
  playerHpTextBattleEl.textContent = `${player.hp}/${maxHp}`;
  const maxStamina = getMaxStamina();
  playerStaminaBarBattleEl.style.width = `${(player.stamina / maxStamina) * 100}%`;
  playerStaminaTextBattleEl.textContent = `${player.stamina}/${maxStamina}`;
  renderTurnBar();
  renderBattleMenu();
}

function renderTurnBar() {
  if (!battleState) return;
  playerTurnBarEl.style.width = `${battleState.playerGauge}%`;
}

function renderBattleMenu() {
  if (!battleState) return;
  if (!battleState.playerReady) {
    currentMenu = 'battleWait';
    battleMenuEl.innerHTML = '<li>행동 대기중...</li>';
    battleSubmenuEl.style.display = 'none';
    return;
  }
  currentMenu = 'battle';
  const options = ['공격', '방어', '기술', '아이템', '도주'];
  displayMenu(battleMenuEl, options, (idx) => {
    if (idx === 0) battleAttack();
    else if (idx === 1) battleDefend();
    else if (idx === 2) openBattleSkillMenu();
    else if (idx === 3) openBattleItemMenu();
    else if (idx === 4) attemptRun();
  });
  battleSubmenuEl.style.display = 'none';
}

async function battleAttack() {
  if (!battleState || !battleState.playerReady) return;
  battleState.processing = true;
  battleState.playerReady = false;
  battleState.playerGauge = 0;
  const enemy = battleState.enemy;
  const stat = battleState.stats.skillUsage['공격'] || { count: 0, damage: 0 };
  stat.count += 1;
  let message = `${enemy.name}을 공격했지만 빗나갔다!`;
  if (calculateHit(player.stats, enemy.stats)) {
    const weapon = equipment.rightHand ? items[equipment.rightHand] : null;
    const damage = calculateDamage(player.stats, enemy.stats, weapon);
    enemy.hp -= damage;
    battleState.stats.damageDealt += damage;
    stat.damage += damage;
    await flashScreen('white', damage);
    renderBattle();
    message = `${enemy.name}에게 ${damage}의 피해를 입혔다.`;
  } else {
    renderBattle();
  }
  battleState.stats.skillUsage['공격'] = stat;
  await typeBattleLog(message);
  addLogSeparator(battleLogEl);
  if (enemy.hp <= 0) {
    await endBattle(true);
    return;
  }
  battleState.processing = false;
}

function battleDefend() {
  if (!battleState || !battleState.playerReady) return;
  battleState.playerReady = false;
  battleState.playerGauge = 0;
  battleState.defending = true;
  renderTurnBar();
  renderBattleMenu();
  addLogSeparator(battleLogEl);
}

function openBattleSkillMenu() {
  currentMenu = 'battleSkill';
  battleSkillList = filterAvailable(skills);
  const options = toMenuOptions(battleSkillList, s => `${s.name} (${s.staminaCost} 기력)`);
  displayMenu(battleSubmenuEl, options, (idx) => {
    if (idx === battleSkillList.length) {
      renderBattleMenu();
    } else {
      useSkill(battleSkillList[idx]);
    }
  });
  battleSubmenuEl.style.display = 'block';
}

async function useSkill(skill) {
  if (!battleState || !battleState.playerReady) return;
  const statInfo = getTechniqueStat(player.skillStats, skill.key);
  const level = statInfo.level;
  const baseCost = skill.staminaCost || 0;
  const cost = Math.max(0, baseCost - (level - 1));
  if (player.stamina < cost) {
    await typeBattleLog('기력이 부족합니다.');
    addLogSeparator(battleLogEl);
    renderBattleMenu();
    return;
  }
  battleState.processing = true;
  battleState.playerReady = false;
  battleState.playerGauge = 0;
  player.stamina -= cost;
  const enemy = battleState.enemy;
  const stat = battleState.stats.skillUsage[skill.name] || { count: 0, damage: 0 };
  stat.count += 1;
  let totalDamage = 0;
  let hits = 0;
  const hitCount = skill.hitCount || 1;
  const accMul = (skill.accuracyMultiplier || 1) + 0.05 * (level - 1);
  for (let i = 0; i < hitCount; i++) {
    if (calculateHit(player.stats, enemy.stats, accMul)) {
      let damage = 0;
      if (skill.type === 'physical') {
        const weapon = equipment.rightHand ? items[equipment.rightHand] : null;
        const base = calculateDamage(player.stats, enemy.stats, weapon);
        damage = Math.round(base * (skill.damageMultiplier || 1));
      } else {
        damage = skill.damage || 0;
      }
      enemy.hp -= damage;
      battleState.stats.damageDealt += damage;
      stat.damage += damage;
      totalDamage += damage;
      hits++;
    }
  }
  await flashScreen('white', totalDamage, hits || 1);
  renderBattle();
  let message = `${skill.name} 사용! 하지만 빗나갔다!`;
  if (hits > 0) {
    message = `${skill.name} 사용! ${totalDamage}의 피해를 입혔다.`;
  }
  battleState.stats.skillUsage[skill.name] = stat;
  const outcome = hits === hitCount && hits > 0 ? 'big' : (hits > 0 ? 'success' : 'fail');
  recordSkillUsage(skill.key, outcome);
  await typeBattleLog(message);
  addLogSeparator(battleLogEl);
  if (enemy.hp <= 0) {
    await endBattle(true);
    return;
  }
  battleState.processing = false;
}

function openBattleItemMenu() {
  currentMenu = 'battleItem';
  battleItemList = inventory.filter(id => items[id].type === 'medicine');
  const options = toMenuOptions(battleItemList, id => items[id].name);
  displayMenu(battleSubmenuEl, options, (idx) => {
    if (idx === battleItemList.length) {
      renderBattleMenu();
    } else {
      useBattleItem(battleItemList[idx]);
    }
  });
  battleSubmenuEl.style.display = 'block';
}

async function useBattleItem(id) {
  if (!battleState || !battleState.playerReady) return;
  battleState.processing = true;
  battleState.playerReady = false;
  battleState.playerGauge = 0;
  const item = items[id];
  if (item.properties && item.properties.heal) {
    player.hp += item.properties.heal;
    const maxHp = getMaxHp();
    if (player.hp > maxHp) player.hp = maxHp;
  }
  const index = inventory.indexOf(id);
  if (index !== -1) inventory.splice(index, 1);
  render();
  renderBattle();
  await typeBattleLog(`${items[id].name} 사용!`);
  renderBattleMenu();
  battleState.processing = false;
  addLogSeparator(battleLogEl);
}

async function attemptRun() {
  if (!battleState || !battleState.playerReady) return;
  battleState.processing = true;
  battleState.playerReady = false;
  battleState.playerGauge = 0;
  const enemy = battleState.enemy;
  const chance = player.stats.agility / (player.stats.agility + enemy.stats.agility);
  const roll = Math.random();
  const success = roll < chance;
  debugLog(`attemptRun chance:${chance.toFixed(2)} roll:${roll.toFixed(2)} => ${success}`, battleLogEl);
  if (success) {
    addLogSeparator(battleLogEl);
    await endBattle(null);
    return;
  } else {
    await typeBattleLog('도주에 실패했다!');
  }
  renderTurnBar();
  renderBattleMenu();
  battleState.processing = false;
  addLogSeparator(battleLogEl);
}

async function enemyTurn() {
  if (!battleState) return;
  const enemy = battleState.enemy;
  let message = `${enemy.name}의 공격을 회피했다!`;
  if (calculateHit(enemy.stats, player.stats)) {
    const damage = calculateDamage(enemy.stats, player.stats, null, battleState.defending);
    if (battleState.defending) battleState.defending = false;
    player.hp -= damage;
    if (player.hp < 0) player.hp = 0;
    battleState.stats.damageTaken += damage;
    message = `${enemy.name}가 당신에게 ${damage}의 피해를 입혔다.`;
    await flashScreen('red', damage);
    render();
    renderBattle();
  } else {
    if (battleState.defending) battleState.defending = false;
    renderBattle();
  }
  await typeBattleLog(message);
  if (player.hp <= 0) {
    await endBattle(false);
    return;
  }
}

function flashScreen(color, damage, count = 1) {
  const duration = Math.min(100 + damage * 20, 1000) / 10;
  return new Promise(resolve => {
    let flashes = 0;
    const doFlash = () => {
      flashOverlayEl.style.backgroundColor = color;
      flashOverlayEl.style.opacity = '1';
      setTimeout(() => {
        flashOverlayEl.style.opacity = '0';
        flashes++;
        if (flashes < count) {
          setTimeout(doFlash, duration);
        } else {
          setTimeout(resolve, duration);
        }
      }, duration);
    };
    doFlash();
  });
}

function typeBattleLog(message) {
  return new Promise(resolve => {
    const line = document.createElement('div');
    battleLogEl.appendChild(line);
    battleState.log.push(message);
    let i = 0;
    const typeNext = () => {
      if (i < message.length) {
        line.textContent += message[i++];
        setTimeout(typeNext, 20);
      } else {
        battleLogEl.scrollTop = battleLogEl.scrollHeight;
        resolve();
      }
    };
    typeNext();
  });
}

function updateBattleTurn() {
  if (!battleState || battleState.processing) return;
  if (!battleState.playerReady) {
    battleState.playerGauge += player.stats.agility;
    if (battleState.playerGauge >= 100) {
      battleState.playerGauge = 100;
      battleState.playerReady = true;
      renderBattleMenu();
    }
    if (!battleState.playerReady) {
      battleState.enemyGauge += battleState.enemy.stats.agility;
      if (battleState.enemyGauge >= 100) {
        battleState.enemyGauge -= 100;
        battleState.processing = true;
        enemyTurn().then(() => {
          if (battleState) battleState.processing = false;
        });
      }
    }
  }
  renderTurnBar();
}

async function endBattle(victory) {
  if (battleState.intervalId) clearInterval(battleState.intervalId);
  battleUIEl.style.display = 'none';
  battleSubmenuEl.style.display = 'none';
  const stats = battleState.stats;
  const enemy = battleState.enemy;
  const xpGain = victory ? (enemy.xp || 0) : 0;
  debugLog(`endBattle result:${victory} xp:${xpGain}`, battleLogEl);
  if (victory && enemy.corpseItem) {
    await processCorpse(enemy);
  }
  battleOutcomeEl.textContent = victory === null ? '도주' : (victory ? '승리' : '패배');
  const lines = [];
  lines.push(`가한 데미지: ${stats.damageDealt}`);
  lines.push(`받은 데미지: ${stats.damageTaken}`);
  Object.keys(stats.skillUsage).forEach(name => {
    const s = stats.skillUsage[name];
    lines.push(`${name}: ${s.count}회, ${s.damage} 데미지`);
  });
  lines.push(`획득 경험치: ${xpGain}`);
  battleResultStatsEl.innerHTML = lines.map(l => `<li>${l}</li>`).join('');
  const preRatio = battleState.preXp / battleState.preXpNeeded;
  player.totalXp += xpGain;
  player.xp += xpGain;
  let xpNeeded = getXpForNextLevel();
  while (player.xp >= xpNeeded) {
    player.xp -= xpNeeded;
    player.level++;
    xpNeeded = getXpForNextLevel();
  }
  const postRatio = player.xp / xpNeeded;
  xpBarEl.style.width = `${preRatio * 100}%`;
  xpTextEl.textContent = `${player.xp}/${xpNeeded}`;
  setTimeout(() => {
    xpBarEl.style.transition = 'width 0.5s';
    xpBarEl.style.width = `${postRatio * 100}%`;
  }, 100);
  battleResultEl.style.display = 'block';
  currentMenu = 'battleResult';
  battleState = null;
}

function openNpcInteractions(npc, npcIndex) {
  currentMenu = 'npcInteractions';
  currentNpc = npc;
  currentNpcIndex = npcIndex;
  updateHeaders();
  highlightItem(npcListEl, npcIndex);
  logNpcDescription(npc);
  addLogSeparator(logEl);
  const npcActions = getNpcActions(npc);
  const items = [...npcActions, '뒤로'];
  displayMenu(npcInteractionListEl, items, (idx) => {
    if (idx === npcActions.length) {
      openNpcMenu();
    } else {
      const action = npcActions[idx];
      if (action === '전투') {
        startBattle(npc);
      } else if (action === '의뢰') {
        openNpcQuestMenu(npc);
      } else if (action === '전달') {
        deliverQuestItem(npc);
      } else if (action === '훈련') {
        openTrainingMenu(npc);
        return;
      } else {
        console.log(`Interaction with ${npc}: ${action}`);
      }
      advanceTime();
    }
  });
  npcInteractionListEl.style.display = 'block';
  npcSectionEl.classList.add('active');
  actionSectionEl.classList.remove('active');
}

function openActionMenu() {
  currentMenu = 'actions';
  currentNpc = '';
  updateHeaders();
  // Ensure NPC list remains visible but non-interactive
  renderNpcList();
  npcInteractionListEl.innerHTML = '';
  npcInteractionListEl.style.display = 'none';
  npcListEl.querySelectorAll('li').forEach(li => li.classList.remove('selected'));

  actionMenusEl.innerHTML = '';
  gameMenuListEl.innerHTML = '';
  actionMenuStack = [{ ul: actionListEl, items: [], onSelect: null }];
  actionMenusEl.appendChild(actionListEl);
  const availableActions = filterAvailable(actions);
  setActionMenu(0, toMenuOptions(availableActions, a => a.name), (idx) => {
    if (idx === availableActions.length) {
      showMainMenu();
    } else {
      handleAction(availableActions[idx]);
    }
  });
  actionSectionEl.classList.add('active');
  npcSectionEl.classList.add('active');
  menuSectionEl.classList.remove('active');
}

function handleAction(action) {
  switch (action.key) {
    case 'wait':
      addLog('당신은 잠시 기다렸다.');
      recordAction('wait');
      advanceTime();
      break;
    case 'sneak':
    case 'stealth':
    case 'lockpick':
      const success = Math.random() < 0.5;
      addLog(`${action.name}을 시도하여 ${success ? '성공했다' : '실패했다'}.`);
      recordAction(action.key, success ? 'success' : 'fail');
      advanceTime();
      break;
    case 'hack':
      startHacking().then(() => {
        advanceTime();
      });
      break;
    case 'merc_shop':
      openMercenaryShop();
      advanceTime();
      break;
    case 'use_injector':
      usePreservationInjector();
      advanceTime();
      break;
    case 'buy_food':
      buyFood();
      advanceTime();
      break;
    default:
      console.log(`Action not implemented: ${action.key}`);
      advanceTime();
  }
}

function openMercenaryShop() {
  openShopUI(mercenaryShop);
}

function openShopUI(shop) {
  currentShop = shop;
  shopAllowSell = !!shop.allowSell;
  shopCurrency = shop.currency || 'money';
  currentShopCategory = Object.keys(shop.categories)[0] || '';
  currentMenu = 'shop';
  document.getElementById('location').style.display = 'none';
  npcSectionEl.style.display = 'none';
  actionSectionEl.style.display = 'none';
  menuSectionEl.style.display = 'none';
  document.getElementById('status').style.display = 'none';
  document.getElementById('player-input-container').style.display = 'none';
  tradeUIEl.style.display = 'block';
  tradeLogEl.innerHTML = '';
  renderShopTabs();
  renderShopItems();
  renderShopInventory();
  updateShopAssets();
}

function renderShopTabs() {
  shopTabsEl.innerHTML = '';
  const entries = Object.entries(currentShop.categories);
  entries.forEach(([key, cat]) => {
    const btn = document.createElement('button');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      currentShopCategory = key;
      renderShopItems();
    });
    shopTabsEl.appendChild(btn);
  });
}

function renderShopItems() {
  shopItemListEl.innerHTML = '';
  const cat = currentShop.categories[currentShopCategory];
  if (!cat) return;
  cat.items.forEach((item) => {
    const li = document.createElement('li');
    const data = items[item.id];
    li.textContent = `${data ? data.name : item.id} - ${item.price}`;
    li.addEventListener('click', () => selectShopItem(item));
    shopItemListEl.appendChild(li);
  });
}

function renderShopInventory() {
  shopInventoryListEl.innerHTML = '';
  inventory.forEach((itemId) => {
    const li = document.createElement('li');
    const data = items[itemId];
    li.textContent = data ? data.name : itemId;
    if (shopAllowSell) {
      li.addEventListener('click', () => selectInventoryItem(itemId));
    }
    shopInventoryListEl.appendChild(li);
  });
}

function selectShopItem(item) {
  const data = items[item.id];
  addShopLog(`${data ? data.name : item.id} 가격 ${item.price}`);
  if (confirm('구매하시겠습니까?')) {
    if (player[shopCurrency] >= item.price) {
      player[shopCurrency] -= item.price;
      inventory.push(item.id);
      addShopLog('구매 완료');
      renderShopInventory();
      updateShopAssets();
    } else {
      addShopLog('자산이 부족합니다.');
    }
  }
  addLogSeparator(tradeLogEl);
}

function selectInventoryItem(itemId) {
  const price = getSellPrice(itemId);
  const data = items[itemId];
  if (price <= 0) {
    addShopLog('판매 불가');
    addLogSeparator(tradeLogEl);
    return;
  }
  addShopLog(`${data ? data.name : itemId} 판매가 ${price}`);
  if (confirm('판매하시겠습니까?')) {
    const idx = inventory.indexOf(itemId);
    if (idx !== -1) inventory.splice(idx, 1);
    player[shopCurrency] += price;
    addShopLog('판매 완료');
    renderShopInventory();
    updateShopAssets();
  }
  addLogSeparator(tradeLogEl);
}

function getSellPrice(itemId) {
  for (const key in currentShop.categories) {
    const cat = currentShop.categories[key];
    const entry = cat.items.find((it) => it.id === itemId);
    if (entry) return Math.floor(entry.price / 2);
  }
  return 0;
}

function updateShopAssets() {
  const unit = currencyDisplayNames[shopCurrency] || '';
  tradeAssetsEl.textContent = `${player[shopCurrency]} ${unit}`;
}

function addShopLog(msg) {
  const p = document.createElement('p');
  p.textContent = msg;
  tradeLogEl.appendChild(p);
  tradeLogEl.scrollTop = tradeLogEl.scrollHeight;
}

function closeTradeUI() {
  tradeUIEl.style.display = 'none';
  document.getElementById('player-input-container').style.display = 'flex';
  showMainMenu();
  render();
}

function usePreservationInjector() {
  const cost = 10;
  const gain = 24;
  if (player.activityPoints < cost) {
    addLog('활동도가 부족합니다.');
    return;
  }
  player.activityPoints -= cost;
  player.preservation += gain;
  addLog(`보존제가 주입되어 보존 기간이 ${gain}시간 늘어났습니다.`);
}

function buyFood() {
  const cost = 10;
  const gain = 6;
  if (player.money < cost) {
    addLog('돈이 부족합니다.');
    return;
  }
  player.money -= cost;
  player.preservation += gain;
  addLog(`음식을 먹어 보존 기간이 ${gain}시간 늘어났습니다.`);
}

function openStatusMenu() {
  currentMenu = 'status';
  document.getElementById('location').style.display = 'none';
  npcSectionEl.style.display = 'none';
  actionSectionEl.style.display = 'none';
  menuSectionEl.style.display = 'none';
  document.getElementById('status').style.display = 'none';
  document.getElementById('player-input-container').style.display = 'none';
  statusUIEl.style.display = 'block';
  renderStatusMenu();
}

function closeStatusMenu() {
  statusUIEl.style.display = 'none';
  showMainMenu();
}

function renderStatusMenu() {
  statListEl.innerHTML = '';
  Object.keys(player.stats).forEach(key => {
    const li = document.createElement('li');
    const name = statDisplayNames[key] || key;
    const span = document.createElement('span');
    const value = player.stats[key] + (player.tempStats[key] || 0);
    span.textContent = value;
    li.textContent = `${name}: `;
    li.appendChild(span);
    const incBtn = document.createElement('button');
    incBtn.textContent = '+';
    incBtn.addEventListener('click', () => increaseStat(key));
    if (player.extraStats <= 0) incBtn.disabled = true;
    const decBtn = document.createElement('button');
    decBtn.textContent = '-';
    decBtn.addEventListener('click', () => decreaseStat(key));
    if (!(player.tempStats[key] > 0)) decBtn.disabled = true;
    li.appendChild(incBtn);
    li.appendChild(decBtn);
    statListEl.appendChild(li);
  });
  extraStatsEl.textContent = player.extraStats > 0 ? `추가 스탯: ${player.extraStats}` : '';
  conditionListEl.innerHTML = '';
  if (player.conditions.size === 0) {
    const li = document.createElement('li');
    li.textContent = '기록된 조건이 없습니다.';
    conditionListEl.appendChild(li);
  } else {
    player.conditions.forEach(cond => {
      const li = document.createElement('li');
      const name = conditionDisplayNames[cond] || cond;
      li.textContent = name;
      conditionListEl.appendChild(li);
    });
  }
  statusDescEl.textContent = '아직 특별한 이상은 보이지 않는다.';
}

function increaseStat(key) {
  if (player.extraStats <= 0) return;
  player.extraStats--;
  player.tempStats[key] = (player.tempStats[key] || 0) + 1;
  renderStatusMenu();
}

function decreaseStat(key) {
  if (!(player.tempStats[key] > 0)) return;
  player.tempStats[key]--;
  if (player.tempStats[key] === 0) delete player.tempStats[key];
  player.extraStats++;
  renderStatusMenu();
}

function confirmStatAllocation() {
  Object.keys(player.tempStats).forEach(key => {
    player.stats[key] += player.tempStats[key];
  });
  player.tempStats = {};
  const maxHp = getMaxHp();
  if (player.hp > maxHp) player.hp = maxHp;
  const maxStamina = getMaxStamina();
  if (player.stamina > maxStamina) player.stamina = maxStamina;
  render();
  renderStatusMenu();
}


function getWeaponAttack(id) {
  return calculateDamage(player.stats, { endurance: 0, agility: 0 }, id ? items[id] : null);
}

function getTotalDefense(eq = equipment) {
  let total = 0;
  ['head', 'top', 'bottom', 'back', 'gloves', 'shoes'].forEach(slot => {
    const itemId = eq[slot];
    if (itemId) {
      const def = items[itemId]?.properties?.defense || 0;
      total += def;
    }
  });
  return total;
}

function renderInventoryStats() {
  inventoryStatListEl.innerHTML = '';
  const atkLi = document.createElement('li');
  const atk = Math.max(getWeaponAttack(equipment.rightHand), getWeaponAttack(equipment.leftHand));
  atkLi.textContent = `공격력: ${atk}`;
  inventoryStatListEl.appendChild(atkLi);
  const defLi = document.createElement('li');
  defLi.textContent = `방어력: ${getTotalDefense()}`;
  inventoryStatListEl.appendChild(defLi);
  Object.keys(player.stats).forEach(key => {
    const li = document.createElement('li');
    const name = statDisplayNames[key] || key;
    li.textContent = `${name}: ${player.stats[key]}`;
    inventoryStatListEl.appendChild(li);
  });

  inventoryConditionListEl.innerHTML = '';
  if (player.conditions.size === 0) {
    const li = document.createElement('li');
    li.textContent = '기록된 조건이 없습니다.';
    inventoryConditionListEl.appendChild(li);
  } else {
    player.conditions.forEach(cond => {
      const li = document.createElement('li');
      const name = conditionDisplayNames[cond] || cond;
      li.textContent = name;
      inventoryConditionListEl.appendChild(li);
    });
  }
}

function renderInventory() {
  renderEquipment();
  renderInventoryStats();
  renderInventoryTabs();
  renderInventorySubtabs();
  renderInventoryItems();
}

function renderInventoryTabs() {
  inventoryTabsEl.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      currentCategory = cat.key;
      currentSubcategory = null;
      renderInventorySubtabs();
      renderInventoryItems();
    });
    inventoryTabsEl.appendChild(btn);
  });
}

function renderInventorySubtabs() {
  inventorySubtabsEl.innerHTML = '';
  const category = categories.find(cat => cat.key === currentCategory);
  if (category && Array.isArray(category.subcategories)) {
    inventorySubtabsEl.style.display = '';
    category.subcategories.forEach(sub => {
      const btn = document.createElement('button');
      btn.textContent = sub.label;
      btn.addEventListener('click', () => {
        currentSubcategory = sub.key;
        renderInventoryItems();
      });
      inventorySubtabsEl.appendChild(btn);
    });
  } else {
    inventorySubtabsEl.style.display = 'none';
  }
}

function renderInventoryItems() {
  inventoryItemsEl.innerHTML = '';
  const filtered = inventory.filter(id => {
    const item = items[id];
    const categoryMatch = currentCategory === 'all' || item.type === currentCategory;
    const subMatch = !currentSubcategory || item.subtype === currentSubcategory;
    return categoryMatch && subMatch;
  });
  filtered.forEach(id => {
    const li = document.createElement('li');
    li.textContent = items[id].name;
    li.addEventListener('click', () => handleItemClick(id));
    inventoryItemsEl.appendChild(li);
  });
}

function renderEquipment() {
  equipRightHandEl.textContent = equipment.rightHand ? items[equipment.rightHand].name : '없음';
  equipLeftHandEl.textContent = equipment.leftHand ? items[equipment.leftHand].name : '없음';
  equipHeadEl.textContent = equipment.head ? items[equipment.head].name : '없음';
  equipTopEl.textContent = equipment.top ? items[equipment.top].name : '없음';
  equipBottomEl.textContent = equipment.bottom ? items[equipment.bottom].name : '없음';
  equipBackEl.textContent = equipment.back ? items[equipment.back].name : '없음';
  equipGlovesEl.textContent = equipment.gloves ? items[equipment.gloves].name : '없음';
  equipShoesEl.textContent = equipment.shoes ? items[equipment.shoes].name : '없음';
}

function updateEquipmentConditions() {
  ['weapon', 'weapon_melee', 'weapon_blunt', 'weapon_firearm', 'weapon_energy']
    .forEach(cond => player.conditions.delete(cond));
  Object.values(equipment).forEach(id => {
    if (!id) return;
    const item = items[id];
    if (item && item.type === 'weapon') {
      player.conditions.add('weapon');
      if (item.subtype) {
        player.conditions.add(`weapon_${item.subtype}`);
      }
    }
  });
}

function applyItemConditions(id, add) {
  const item = items[id];
  if (!item || !item.conditions) return;
  item.conditions.forEach(cond => {
    if (add) {
      player.conditions.add(cond);
    } else {
      player.conditions.delete(cond);
    }
  });
}

function equipItem(slot, id) {
  const index = inventory.indexOf(id);
  if (index !== -1) inventory.splice(index, 1);
  const prev = equipment[slot];
  if (prev) {
    inventory.push(prev);
    applyItemConditions(prev, false);
  }
  equipment[slot] = id;
  applyItemConditions(id, true);
  updateEquipmentConditions();
  renderEquipment();
  renderInventoryItems();
  renderInventoryStats();
}

function unequipItem(slot) {
  const prev = equipment[slot];
  if (prev) {
    applyItemConditions(prev, false);
    equipment[slot] = null;
    inventory.push(prev);
    updateEquipmentConditions();
    renderEquipment();
    renderInventoryItems();
    renderInventoryStats();
  }
}

function setupUnequipListener(el, slot) {
  el.addEventListener('click', () => {
    if (equipment[slot]) {
      const choice = prompt('1. 장비 해제\n2. 뒤로');
      if (choice === '1') {
        unequipItem(slot);
      }
    }
  });
}

function handleItemClick(id) {
  const item = items[id];
  if (item.type === 'weapon') {
    const rightBefore = getWeaponAttack(equipment.rightHand);
    const rightAfter = getWeaponAttack(id);
    const leftBefore = getWeaponAttack(equipment.leftHand);
    const leftAfter = getWeaponAttack(id);
    const choice = prompt(`1. 오른손에 장착 (공격력 ${rightBefore} -> ${rightAfter})\n2. 왼손에 장착 (공격력 ${leftBefore} -> ${leftAfter})\n3. 뒤로`);
    if (choice === '1') {
      equipItem('rightHand', id);
    } else if (choice === '2') {
      equipItem('leftHand', id);
    }
  } else if (item.type === 'armor') {
    const slotName = slotDisplayNames[item.subtype] || item.subtype;
    const before = getTotalDefense();
    const tempEquip = Object.assign({}, equipment, { [item.subtype]: id });
    const after = getTotalDefense(tempEquip);
    const choice = prompt(`1. ${slotName}에 장착 (방어력 ${before} -> ${after})\n2. 뒤로`);
    if (choice === '1') {
      equipItem(item.subtype, id);
    }
  }
}

function openInventory() {
  currentMenu = 'inventory';
  updateHeaders();
  document.getElementById('location').style.display = 'none';
  npcSectionEl.style.display = 'none';
  actionSectionEl.style.display = 'none';
  document.getElementById('status').style.display = 'none';
  document.getElementById('player-input-container').style.display = 'none';
  menuSectionEl.style.display = 'none';
  inventoryUIEl.style.display = 'block';
  renderInventory();
}

function closeInventory() {
  showMainMenu();
}

function openQuestMenu() {
  currentMenu = 'quests';
  updateHeaders();
  document.getElementById('location').style.display = 'none';
  npcSectionEl.style.display = 'none';
  actionSectionEl.style.display = 'none';
  document.getElementById('status').style.display = 'none';
  document.getElementById('player-input-container').style.display = 'none';
  menuSectionEl.style.display = 'none';
  questListEl.innerHTML = '';
  activeQuests.forEach(q => {
    const def = questDefs[q.id];
    const progress = def.count ? `${q.progress || 0}/${def.count}` : '';
    const li = document.createElement('li');
    li.textContent = `${def.name}${progress ? ` (${progress})` : ''}`;
    questListEl.appendChild(li);
  });
  questUIEl.style.display = 'block';
}

function acceptQuest(id) {
  activeQuests.push({ id, progress: 0 });
  const def = questDefs[id];
  addLog(`${def.name} 의뢰를 수락했다.`);
  addLogSeparator(logEl);
  if (def.type === 'delivery' && def.item) {
    inventory.push(def.item);
  }
  render();
}

function completeQuest(q) {
  const def = questDefs[q.id];
  if (def.type === 'battle' && def.evidenceItem) {
    const idx = inventory.indexOf(def.evidenceItem);
    if (idx !== -1) inventory.splice(idx, 1);
  }
  if (def.reward) {
    if (def.reward.money) {
      player.money += def.reward.money;
      addLog(`${def.reward.money}원을 획득했다.`);
    }
    if (def.reward.activity) {
      player.activityPoints += def.reward.activity;
      addLog(`활동도 ${def.reward.activity}를 획득했다.`);
    }
  }
  completedQuests.add(q.id);
  const i = activeQuests.indexOf(q);
  if (i !== -1) activeQuests.splice(i, 1);
  addLog(`${def.name} 의뢰를 완료했다!`);
  addLogSeparator(logEl);
  render();
}

function openNpcQuestMenu(npc) {
  currentMenu = 'npcQuest';
  const turnins = activeQuests.filter(q => questDefs[q.id].giver === npc && q.ready);
  const available = Object.keys(questDefs).filter(id => questDefs[id].giver === npc && !activeQuests.some(q => q.id === id) && !completedQuests.has(id));
  const items = [
    ...turnins.map(q => `보고: ${questDefs[q.id].name}`),
    ...available.map(id => `수락: ${questDefs[id].name}`),
    '뒤로'
  ];
  displayMenu(npcInteractionListEl, items, (idx) => {
    if (idx === items.length - 1) {
      openNpcInteractions(npc, currentNpcIndex);
    } else if (idx < turnins.length) {
      completeQuest(turnins[idx]);
      openNpcQuestMenu(npc);
    } else {
      const questId = available[idx - turnins.length];
      acceptQuest(questId);
      openNpcQuestMenu(npc);
    }
  });
  npcInteractionListEl.style.display = 'block';
}

function deliverQuestItem(npc) {
  const q = activeQuests.find(quest => quest.type === 'delivery' && quest.recipient === npc && inventory.includes(quest.item));
  if (!q) return;
  const idx = inventory.indexOf(q.item);
  if (idx !== -1) inventory.splice(idx, 1);
  q.ready = true;
  completeQuest(q);
  openNpcInteractions(npc, currentNpcIndex);
}

function openTrainingMenu(npcName) {
  const npc = npcData[npcName];
  if (!npc || !npc.skills) return;
  currentMenu = 'training';
  const keys = Object.keys(npc.skills);
  const names = keys.map(k => getTechniqueName(k));
  names.push('뒤로');
  displayMenu(npcInteractionListEl, names, (idx) => {
    if (idx === keys.length) {
      openNpcInteractions(npcName, currentNpcIndex);
    } else {
      trainSkill({ name: npcName, skills: npc.skills, relationship: npc.relationship }, keys[idx]);
      openNpcInteractions(npcName, currentNpcIndex);
      advanceTime();
    }
  });
}

function startHacking() {
  return new Promise(resolve => {
    currentMenu = 'hack';
    hackingCodeEl.textContent = '';
    hackingCodeEl.classList.remove('error');
    hackingResultEl.textContent = '';
    let gauge = 0;
    let time = 5000;
    hackingGaugeEl.style.width = '0%';
    hackingTimerEl.textContent = (time / 1000).toFixed(1);
    document.getElementById('location').style.display = 'none';
    npcSectionEl.style.display = 'none';
    actionSectionEl.style.display = 'none';
    document.getElementById('status').style.display = 'none';
    document.getElementById('player-input-container').style.display = 'none';
    menuSectionEl.style.display = 'none';
    hackingUIEl.style.display = 'block';
    const codeSnippets = ['if(', 'var ', 'let ', 'for(', 'while(', '=>', 'console.log(', 'function '];
    const interval = setInterval(() => {
      gauge = Math.max(0, gauge - 1);
      hackingGaugeEl.style.width = `${gauge}%`;
      time -= 100;
      hackingTimerEl.textContent = (time / 1000).toFixed(1);
      if (time <= 0 || gauge <= 0) {
        end('fail');
      }
    }, 100);
    function onKey(e) {
      if (e.code === 'Enter') {
        if (gauge >= 68 && gauge <= 72) end('big');
        else if (gauge >= 60 && gauge <= 80) end('success');
        else end('fail');
      } else {
        gauge = Math.min(100, gauge + 5);
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        hackingCodeEl.textContent += snippet;
      }
    }
    function end(result) {
      clearInterval(interval);
      document.removeEventListener('keydown', onKey);
      if (result === 'fail') {
        hackingCodeEl.classList.add('error');
        hackingResultEl.textContent = 'Error';
      } else {
        hackingResultEl.textContent = 'Access';
      }
      recordAction('hack', result);
      setTimeout(() => {
        hackingUIEl.style.display = 'none';
        document.getElementById('location').style.display = '';
        npcSectionEl.style.display = '';
        actionSectionEl.style.display = '';
        document.getElementById('status').style.display = '';
        document.getElementById('player-input-container').style.display = '';
        menuSectionEl.style.display = '';
        currentMenu = 'actions';
        resolve(result !== 'fail');
      }, 500);
    }
    document.addEventListener('keydown', onKey);
  });
}

function processCorpse(enemy) {
  return new Promise(resolve => {
    if (!enemy.corpseItem) { resolve(false); return; }
    currentMenu = 'butcher';
    let pos = 0;
    butcherResultEl.textContent = '';
    butcheringUIEl.style.display = 'block';
    const interval = setInterval(() => {
      pos += 2;
      if (pos > 100) pos = 0;
      butcherArrowEl.style.left = `${pos}%`;
    }, 30);
    function onKey(e) {
      if (e.code === 'Space') {
        clearInterval(interval);
        document.removeEventListener('keydown', onKey);
        let success = false;
        if (pos >= 45 && pos <= 55) {
          butcherResultEl.textContent = '대성공';
          success = true;
        } else if (pos >= 30 && pos <= 70) {
          butcherResultEl.textContent = '성공';
          success = true;
        } else {
          butcherResultEl.textContent = '실패';
        }
        setTimeout(() => {
          butcheringUIEl.style.display = 'none';
          currentMenu = 'battleResult';
          resolve(success);
        }, 500);
      }
    }
    document.addEventListener('keydown', onKey);
  }).then(success => {
    if (success) {
      inventory.push(enemy.corpseItem);
      const item = items[enemy.corpseItem];
      addLog(`${item ? item.name : enemy.corpseItem}을 획득했다.`);
      addLogSeparator(logEl);
      activeQuests.forEach(q => {
        const def = questDefs[q.id];
        if (def.type === 'battle' && def.target === enemy.name) {
          q.progress = (q.progress || 0) + 1;
          if (q.progress >= (def.count || 1)) q.ready = true;
        }
      });
      render();
    }
  });
}

async function loadData() {
  const [conditionData, actionData, skillData, locationData, inventoryData, itemData, npcInfo, questData] = await Promise.all([
    fetch('data/conditions.json').then(res => res.json()),
    fetch('data/actions.json').then(res => res.json()),
    fetch('data/skills.json').then(res => res.json()),
    fetch('data/locations.json').then(res => res.json()),
    fetch('data/inventory.json').then(res => res.json()),
    fetch('data/items.json').then(res => res.json()),
    fetch('data/npcs.json').then(res => res.json()),
    fetch('data/quests.json').then(res => res.json())
  ]);

  conditionDefs = conditionData.conditions;
  actions = actionData.actions;
  skills = skillData.skills;
  locations = locationData.locations;
  currentLocation = locationData.start;
  items = itemData.items;
  inventory = inventoryData.inventory;
  equipment = inventoryData.equipment;
  Object.values(equipment).forEach(id => {
    if (id) applyItemConditions(id, true);
  });
  updateEquipmentConditions();
  categories = inventoryData.categories;
  npcData = npcInfo.npcs;
  Object.assign(questDefs, questData.quests);
  currentCategory = categories[0] ? categories[0].key : '';
  applyLocationGrants(locations[currentLocation]);
  updateLocationAttitude();
  render();
  showMainMenu();
  logLocation();
}

loadData();

npcHeaderEl.addEventListener('click', () => {
  if (currentMenu === 'npcs' || currentMenu === 'npcInteractions') {
    showMainMenu();
  } else {
    openNpcMenu();
  }
});

moveHeaderEl.addEventListener('click', () => {
  if (currentMenu === 'main') {
    performMove();
  } else {
    showMainMenu();
  }
});

actionHeaderEl.addEventListener('click', () => {
  if (currentMenu === 'actions') {
    showMainMenu();
  } else {
    openActionMenu();
  }
});

menuHeaderEl.addEventListener('click', () => {
  if (currentMenu === 'gameMenu' || currentMenu === 'skills' || currentMenu === 'settings') {
    showMainMenu();
  } else {
    openGameMenu();
  }
});

function handleCommand() {
  const command = playerCommandEl.value.trim();
  if (!command) return;
  const num = parseInt(command, 10);
  if (isNaN(num)) {
    playerCommandEl.value = '';
    return;
  }

  if (currentMenu === 'main') {
    if (num === 1) {
      openNpcMenu();
    } else if (num === 2) {
      performMove();
    } else if (num === 3) {
      openActionMenu();
    } else if (num === 4) {
      openGameMenu();
    }
  } else if (currentMenu === 'npcs') {
    const loc = locations[currentLocation];
    const npcs = loc && Array.isArray(loc.npcs)
      ? loc.npcs.slice().sort((a, b) => a.localeCompare(b))
      : [];
    if (num === npcs.length + 1) {
      showMainMenu();
    } else if (num > 0 && num <= npcs.length) {
      openNpcInteractions(npcs[num - 1], num - 1);
    }
  } else if (currentMenu === 'npcInteractions') {
    const npcActions = getNpcActions(currentNpc);
    if (num === npcActions.length + 1) {
      openNpcMenu();
    } else if (num > 0 && num <= npcActions.length) {
      highlightItem(npcInteractionListEl, num - 1);
      const action = npcActions[num - 1];
      if (action === '전투') {
        startBattle(currentNpc);
      } else {
        console.log(`Interaction with ${currentNpc}: ${action}`);
      }
    }
  } else if (currentMenu === 'move') {
    if (actionMenuStack.length > 0) {
      const currentLevel = actionMenuStack[actionMenuStack.length - 1];
      if (num > 0 && num <= currentLevel.items.length) {
        highlightItem(currentLevel.ul, num - 1);
        currentLevel.onSelect(num - 1);
      }
    }
  } else if (currentMenu === 'actions') {
    if (actionMenuStack.length > 0) {
      const currentLevel = actionMenuStack[actionMenuStack.length - 1];
      if (num > 0 && num <= currentLevel.items.length) {
        highlightItem(currentLevel.ul, num - 1);
        currentLevel.onSelect(num - 1);
      }
    }
  } else if (currentMenu === 'gameMenu') {
    const items = ['상태', '기술', '소지품', '의뢰', '설정', '뒤로'];
    if (num > 0 && num <= items.length) {
      highlightItem(gameMenuListEl, num - 1);
      if (num === 1) {
        openStatusMenu();
        advanceTime();
      } else if (num === 2) {
        openGameMenuSkills();
      } else if (num === 3) {
        openInventory();
      } else if (num === 4) {
        openQuestMenu();
      } else if (num === 5) {
        openSettingsMenu();
      } else {
        showMainMenu();
      }
    }
  } else if (currentMenu === 'settings') {
    const items = [`디버그: ${debugMode ? 'ON' : 'OFF'}`, '뒤로'];
    if (num > 0 && num <= items.length) {
      highlightItem(gameMenuListEl, num - 1);
      if (num === 1) {
        debugMode = !debugMode;
        addLog(`디버그 모드가 ${debugMode ? '켜졌습니다' : '꺼졌습니다'}.`);
        addLogSeparator(logEl);
        openSettingsMenu();
      } else {
        openGameMenu();
      }
    }
  } else if (currentMenu === 'training') {
    const npc = npcData[currentNpc];
    const keys = npc && npc.skills ? Object.keys(npc.skills) : [];
    if (num > 0 && num <= keys.length + 1) {
      highlightItem(npcInteractionListEl, num - 1);
      if (num === keys.length + 1) {
        openNpcInteractions(currentNpc, currentNpcIndex);
      } else {
        trainSkill({ name: currentNpc, skills: npc.skills, relationship: npc.relationship }, keys[num - 1]);
        openNpcInteractions(currentNpc, currentNpcIndex);
        advanceTime();
      }
    }
  } else if (currentMenu === 'npcQuest') {
    const turnins = activeQuests.filter(q => questDefs[q.id].giver === currentNpc && q.ready);
    const available = Object.keys(questDefs).filter(id => questDefs[id].giver === currentNpc && !activeQuests.some(q => q.id === id) && !completedQuests.has(id));
    const items = [...turnins, ...available, '뒤로'];
    if (num > 0 && num <= items.length) {
      highlightItem(npcInteractionListEl, num - 1);
      if (num === items.length) {
        openNpcInteractions(currentNpc, currentNpcIndex);
      } else if (num <= turnins.length) {
        completeQuest(turnins[num - 1]);
        openNpcQuestMenu(currentNpc);
      } else {
        const questId = available[num - turnins.length - 1];
        acceptQuest(questId);
        openNpcQuestMenu(currentNpc);
      }
    }
  } else if (currentMenu === 'battle') {
    if (num === 1) {
      battleAttack();
    } else if (num === 2) {
      battleDefend();
    } else if (num === 3) {
      openBattleSkillMenu();
    } else if (num === 4) {
      openBattleItemMenu();
    } else if (num === 5) {
      attemptRun();
    }
  } else if (currentMenu === 'battleSkill') {
    if (num === battleSkillList.length + 1) {
      renderBattleMenu();
    } else if (num > 0 && num <= battleSkillList.length) {
      useSkill(battleSkillList[num - 1]);
    }
  } else if (currentMenu === 'battleItem') {
    if (num === battleItemList.length + 1) {
      renderBattleMenu();
    } else if (num > 0 && num <= battleItemList.length) {
      useBattleItem(battleItemList[num - 1]);
    }
  }

  playerCommandEl.value = '';
}

submitCommandEl.addEventListener('click', handleCommand);
playerCommandEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleCommand();
  }
});
closeTradeEl.addEventListener('click', closeTradeUI);
closeInventoryEl.addEventListener('click', closeInventory);
setupUnequipListener(equipRightHandEl, 'rightHand');
setupUnequipListener(equipLeftHandEl, 'leftHand');
setupUnequipListener(equipHeadEl, 'head');
setupUnequipListener(equipTopEl, 'top');
setupUnequipListener(equipBottomEl, 'bottom');
setupUnequipListener(equipBackEl, 'back');
setupUnequipListener(equipGlovesEl, 'gloves');
setupUnequipListener(equipShoesEl, 'shoes');
statusConfirmEl.addEventListener('click', confirmStatAllocation);
closeStatusEl.addEventListener('click', closeStatusMenu);
battleResultCloseEl.addEventListener('click', () => {
  battleResultEl.style.display = 'none';
  showMainMenu();
  render();
});

closeQuestEl.addEventListener('click', () => {
  questUIEl.style.display = 'none';
  showMainMenu();
});

closeSkillsEl.addEventListener('click', () => {
  skillsUIEl.style.display = 'none';
  document.getElementById('location').style.display = '';
  npcSectionEl.style.display = '';
  actionSectionEl.style.display = '';
  document.getElementById('status').style.display = '';
  document.getElementById('player-input-container').style.display = '';
  menuSectionEl.style.display = '';
  openGameMenu();
});

