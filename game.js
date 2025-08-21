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
const hpBarEl = document.getElementById('hp-bar');
const hpTextEl = document.getElementById('hp-text');
const staminaBarEl = document.getElementById('stamina-bar');
const staminaTextEl = document.getElementById('stamina-text');
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
const xpBarEl = document.getElementById('xp-bar');
const xpTextEl = document.getElementById('xp-text');

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
  weapon_energy: '에너지무기 장착'
};

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
  extraStats: 0,
  tempStats: {},
  level: 1,
  xp: 0,
  totalXp: 0,
  conditions: new Set()
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
  return Math.random() < chance;
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
  return Math.round(dmg);
}

player.hp = getMaxHp();
player.stamina = getMaxStamina();

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
let currentLocation = '';
let currentMenu = 'main';
let currentNpc = '';
let currentCategory = '';
let currentSubcategory = null;
let actionMenuStack = [];
let currentTime = 8;

function getTimeSegment() {
  if (currentTime >= 4 && currentTime <= 7) return { key: 'morning', name: '아침' };
  if (currentTime >= 8 && currentTime <= 11) return { key: 'day', name: '낮' };
  if (currentTime >= 12 && currentTime <= 15) return { key: 'afternoon', name: '오후' };
  if (currentTime >= 16 && currentTime <= 19) return { key: 'evening', name: '저녁' };
  if (currentTime >= 20 && currentTime <= 23) return { key: 'night', name: '밤' };
  return { key: 'lateNight', name: '심야' };
}

function advanceTime(hours = 1) {
  currentTime = (currentTime + hours) % 24;
  render();
}

function updateHeaders() {
  if (currentMenu === 'main') {
    npcHeaderEl.textContent = '1. 인물';
    moveHeaderEl.textContent = '2. 이동';
    actionHeaderEl.textContent = '3. 행동';
    menuHeaderEl.textContent = '4. 메뉴';
  } else {
    npcHeaderEl.textContent = '인물';
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
  locationDescEl.textContent = desc;
  const maxHp = getMaxHp();
  const maxStamina = getMaxStamina();
  hpBarEl.style.width = `${(player.hp / maxHp) * 100}%`;
  hpTextEl.textContent = `${player.hp}/${maxHp}`;
  staminaBarEl.style.width = `${(player.stamina / maxStamina) * 100}%`;
  staminaTextEl.textContent = `${player.stamina}/${maxStamina}`;
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
  listEl.classList.add('tree');
  listEl.classList.add('animating');
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
      listEl.classList.remove('animating');
      return;
    }
    const el = elements[index];
    el.li.style.display = '';
    el.li.classList.add('show-line');
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
  console.log('이동 선택됨');
  advanceTime();
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
  const items = ['상태', '기술', '소지품', '뒤로'];
  displayMenu(gameMenuListEl, items, (idx) => {
    if (idx === 0) {
      openStatusMenu();
      advanceTime();
    } else if (idx === 1) {
      openGameMenuSkills();
    } else if (idx === 2) {
      openInventory();
    } else {
      showMainMenu();
    }
  });
  menuSectionEl.classList.add('active');
  npcSectionEl.classList.add('active');
  actionSectionEl.classList.remove('active');
}

function openGameMenuSkills() {
  currentMenu = 'gameMenuSkills';
  const availableSkills = filterAvailable(skills);
  displayMenu(gameMenuListEl, toMenuOptions(availableSkills, s => s.name), (idx) => {
    if (idx === availableSkills.length) {
      openGameMenu();
    } else {
      console.log(`Skill selected: ${availableSkills[idx].name}`);
      advanceTime();
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
  return ['대화', '관찰'];
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
  if (enemy.hp <= 0) {
    endBattle(true);
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
  const cost = skill.staminaCost || 0;
  if (player.stamina < cost) {
    await typeBattleLog('기력이 부족합니다.');
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
  for (let i = 0; i < hitCount; i++) {
    if (calculateHit(player.stats, enemy.stats, skill.accuracyMultiplier || 1)) {
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
  await typeBattleLog(message);
  if (enemy.hp <= 0) {
    endBattle(true);
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
}

async function attemptRun() {
  if (!battleState || !battleState.playerReady) return;
  battleState.processing = true;
  battleState.playerReady = false;
  battleState.playerGauge = 0;
  const enemy = battleState.enemy;
  const chance = player.stats.agility / (player.stats.agility + enemy.stats.agility);
  if (Math.random() < chance) {
    endBattle(null);
  } else {
    await typeBattleLog('도주에 실패했다!');
  }
  renderTurnBar();
  renderBattleMenu();
  battleState.processing = false;
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
    endBattle(false);
    return;
  }
}

function flashScreen(color, damage, count = 1) {
  const duration = Math.min(100 + damage * 20, 1000);
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
  }
  battleState.enemyGauge += battleState.enemy.stats.agility;
  if (battleState.enemyGauge >= 100) {
    battleState.enemyGauge -= 100;
    battleState.processing = true;
    enemyTurn().then(() => {
      if (battleState) battleState.processing = false;
    });
  }
  renderTurnBar();
}

function endBattle(victory) {
  if (battleState.intervalId) clearInterval(battleState.intervalId);
  battleUIEl.style.display = 'none';
  battleSubmenuEl.style.display = 'none';
  const stats = battleState.stats;
  const enemy = battleState.enemy;
  const xpGain = victory ? (enemy.xp || 0) : 0;
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
  updateHeaders();
  highlightItem(npcListEl, npcIndex);
  const npcActions = getNpcActions(npc);
  const items = [...npcActions, '뒤로'];
  displayMenu(npcInteractionListEl, items, (idx) => {
    if (idx === npcActions.length) {
      openNpcMenu();
    } else {
      const action = npcActions[idx];
      if (action === '전투') {
        startBattle(npc);
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
      console.log('기다리기 선택됨');
      advanceTime();
      break;
    default:
      console.log(`Action not implemented: ${action.key}`);
      advanceTime();
  }
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

async function loadData() {
  const [conditionData, actionData, skillData, locationData, inventoryData, itemData, npcInfo] = await Promise.all([
    fetch('data/conditions.json').then(res => res.json()),
    fetch('data/actions.json').then(res => res.json()),
    fetch('data/skills.json').then(res => res.json()),
    fetch('data/locations.json').then(res => res.json()),
    fetch('data/inventory.json').then(res => res.json()),
    fetch('data/items.json').then(res => res.json()),
    fetch('data/npcs.json').then(res => res.json())
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
  currentCategory = categories[0] ? categories[0].key : '';
  render();
  showMainMenu();
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
  if (currentMenu === 'gameMenu' || currentMenu === 'gameMenuSkills') {
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
  } else if (currentMenu === 'actions') {
    if (actionMenuStack.length > 0) {
      const currentLevel = actionMenuStack[actionMenuStack.length - 1];
      if (num > 0 && num <= currentLevel.items.length) {
        highlightItem(currentLevel.ul, num - 1);
        currentLevel.onSelect(num - 1);
      }
    }
  } else if (currentMenu === 'gameMenu') {
    const items = ['상태', '기술', '소지품', '뒤로'];
    if (num > 0 && num <= items.length) {
      highlightItem(gameMenuListEl, num - 1);
      if (num === 1) {
        openStatusMenu();
        advanceTime();
      } else if (num === 2) {
        openGameMenuSkills();
      } else if (num === 3) {
        openInventory();
      } else {
        showMainMenu();
      }
    }
  } else if (currentMenu === 'gameMenuSkills') {
    const availableSkills = filterAvailable(skills);
    if (num > 0 && num <= availableSkills.length + 1) {
      highlightItem(gameMenuListEl, num - 1);
      if (num === availableSkills.length + 1) {
        openGameMenu();
      } else {
        console.log(`Skill selected: ${availableSkills[num - 1].name}`);
        advanceTime();
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

