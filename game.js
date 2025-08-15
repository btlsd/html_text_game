const locationNameEl = document.getElementById('location-name');
const locationDescEl = document.getElementById('location-description');
const npcListEl = document.getElementById('npc-list');
const npcInteractionListEl = document.getElementById('npc-interaction-list');
const actionMenusEl = document.getElementById('action-menus');
const actionListEl = document.getElementById('action-list');
const npcSectionEl = document.getElementById('npcs');
const actionSectionEl = document.getElementById('actions');
const npcHeaderEl = document.getElementById('npc-header');
const actionHeaderEl = document.getElementById('action-header');
const inventoryHeaderEl = document.getElementById('inventory-header');
const inventoryMenuEl = document.getElementById('inventory-menu');
const inventoryUIEl = document.getElementById('inventory-ui');
const inventoryTabsEl = document.getElementById('inventory-tabs');
const inventorySubtabsEl = document.getElementById('inventory-subtabs');
const inventoryItemsEl = document.getElementById('inventory-items');
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
const playerCommandEl = document.getElementById('player-command');
const submitCommandEl = document.getElementById('submit-command');
const statusUIEl = document.getElementById('status-ui');
const statListEl = document.getElementById('stat-list');
const extraStatsEl = document.getElementById('extra-stats');
const statusDescEl = document.getElementById('status-description');
const statusConfirmEl = document.getElementById('status-confirm');
const closeStatusEl = document.getElementById('close-status');

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
  tempStats: {}
};

function getMaxHp() {
  return player.stats.endurance * 10 + player.stats.strength * 5;
}

function getMaxStamina() {
  return player.stats.endurance * 8 + player.stats.charisma * 4;
}

player.hp = getMaxHp();
player.stamina = getMaxStamina();

let actions = [];
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

function updateHeaders() {
  if (currentMenu === 'main') {
    npcHeaderEl.textContent = '1. 인물';
    actionHeaderEl.textContent = '2. 행동';
    inventoryHeaderEl.textContent = '3. 소지품';
  } else {
    npcHeaderEl.textContent = '인물';
    actionHeaderEl.textContent = '행동';
    inventoryHeaderEl.textContent = '소지품';
  }
}

function render() {
  const loc = locations[currentLocation];
  locationNameEl.textContent = loc && loc.name ? loc.name : '???';
  locationDescEl.textContent = loc ? loc.description : '';
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
  const elements = items.map((text, idx) => {
    const li = document.createElement('li');
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

  let step = 0;
  const interval = setInterval(() => {
    let done = true;
    elements.forEach(el => {
      if (step < el.fullText.length) {
        el.li.textContent = el.fullText.slice(0, step + 1);
        if (step < el.fullText.length - 1) done = false;
      }
    });
    step++;
    if (done) clearInterval(interval);
  }, 50);
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

function showMainMenu() {
  currentMenu = 'main';
  currentNpc = '';
  updateHeaders();
  renderNpcList();
  actionMenusEl.innerHTML = '';
  actionMenuStack = [];
  npcInteractionListEl.innerHTML = '';
  npcInteractionListEl.style.display = 'none';
  npcListEl.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
  npcSectionEl.classList.remove('active');
  actionSectionEl.classList.remove('active');
  inventoryMenuEl.style.display = '';
  inventoryUIEl.style.display = 'none';
  statusUIEl.style.display = 'none';
  document.getElementById('location').style.display = '';
  npcSectionEl.style.display = '';
  actionSectionEl.style.display = '';
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
}

function getNpcActions(npc) {
  return ['대화', '관찰'];
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
      console.log(`Interaction with ${npc}: ${npcActions[idx]}`);
    }
  });
  npcInteractionListEl.style.display = 'block';
  npcSectionEl.classList.add('active');
  actionSectionEl.classList.remove('active');
}

function openActionMenu() {
  currentMenu = 'actions';
  updateHeaders();
  actionMenusEl.innerHTML = '';
  actionMenuStack = [{ ul: actionListEl, items: [], onSelect: null }];
  actionMenusEl.appendChild(actionListEl);
  setActionMenu(0, ['이동', '메뉴', '뒤로'], (idx) => {
    if (idx === 0) {
      console.log('이동 선택됨');
    } else if (idx === 1) {
      openActionMainMenu();
    } else {
      showMainMenu();
    }
  });
  actionSectionEl.classList.add('active');
  npcSectionEl.classList.remove('active');
}

function openActionMainMenu() {
  setActionMenu(1, ['상태', '기술', '뒤로'], (idx) => {
    if (idx === 0) {
      openStatusMenu();
    } else if (idx === 1) {
      openActionSkillsMenu();
    } else {
      clearActionMenusFrom(1);
      highlightItem(actionMenuStack[0].ul, -1);
    }
  });
}

function openActionSkillsMenu() {
  setActionMenu(2, [...actions, '뒤로'], (idx) => {
    if (idx === actions.length) {
      clearActionMenusFrom(2);
    } else {
      console.log(`Action selected: ${actions[idx]}`);
    }
  });
}

function openStatusMenu() {
  currentMenu = 'status';
  document.getElementById('location').style.display = 'none';
  npcSectionEl.style.display = 'none';
  actionSectionEl.style.display = 'none';
  inventoryMenuEl.style.display = 'none';
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

function renderInventory() {
  renderEquipment();
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

function handleItemClick(id) {
  const item = items[id];
  if (item.type === 'weapon') {
    const choice = prompt('1. 오른손에 장착\n2. 왼손에 장착\n3. 뒤로');
    if (choice === '1') {
      equipment.rightHand = id;
      renderEquipment();
    } else if (choice === '2') {
      equipment.leftHand = id;
      renderEquipment();
    }
  } else if (item.type === 'armor') {
    const slotName = slotDisplayNames[item.subtype] || item.subtype;
    const choice = prompt(`1. ${slotName}에 장착\n2. 뒤로`);
    if (choice === '1') {
      equipment[item.subtype] = id;
      renderEquipment();
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
  inventoryMenuEl.style.display = 'none';
  inventoryUIEl.style.display = 'block';
  renderInventory();
}

function closeInventory() {
  showMainMenu();
}

async function loadData() {
  const [actionData, locationData, inventoryData, itemData] = await Promise.all([
    fetch('data/actions.json').then(res => res.json()),
    fetch('data/locations.json').then(res => res.json()),
    fetch('data/inventory.json').then(res => res.json()),
    fetch('data/items.json').then(res => res.json())
  ]);

  actions = actionData.actions;
  locations = locationData.locations;
  currentLocation = locationData.start;
  items = itemData.items;
  inventory = inventoryData.inventory;
  equipment = inventoryData.equipment;
  categories = inventoryData.categories;
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

actionHeaderEl.addEventListener('click', () => {
  if (currentMenu === 'actions') {
    showMainMenu();
  } else {
    openActionMenu();
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
      openActionMenu();
    } else if (num === 3) {
      openInventory();
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
      console.log(`Interaction with ${currentNpc}: ${npcActions[num - 1]}`);
    }
  } else if (currentMenu === 'actions') {
    if (actionMenuStack.length > 0) {
      const currentLevel = actionMenuStack[actionMenuStack.length - 1];
      if (num > 0 && num <= currentLevel.items.length) {
        highlightItem(currentLevel.ul, num - 1);
        currentLevel.onSelect(num - 1);
      }
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

inventoryHeaderEl.addEventListener('click', openInventory);
closeInventoryEl.addEventListener('click', closeInventory);
statusConfirmEl.addEventListener('click', confirmStatAllocation);
closeStatusEl.addEventListener('click', closeStatusMenu);

