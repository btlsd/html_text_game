const locationNameEl = document.getElementById('location-name');
const locationDescEl = document.getElementById('location-description');
const npcListEl = document.getElementById('npc-list');
const npcInteractionListEl = document.getElementById('npc-interaction-list');
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
const statusInfoEl = document.getElementById('status-info');
const playerCommandEl = document.getElementById('player-command');
const submitCommandEl = document.getElementById('submit-command');

const slotDisplayNames = {
  head: '머리',
  top: '상의',
  bottom: '하의',
  back: '등',
  gloves: '장갑',
  shoes: '신발'
};

const player = {
  hp: 100,
  stamina: 50
};

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
  statusInfoEl.textContent = `HP: ${player.hp}  기력: ${player.stamina}`;
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

function showMainMenu() {
  currentMenu = 'main';
  currentNpc = '';
  updateHeaders();
  renderNpcList();
  actionListEl.innerHTML = '';
  npcInteractionListEl.innerHTML = '';
  npcInteractionListEl.style.display = 'none';
  npcListEl.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
  actionListEl.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
  npcSectionEl.classList.remove('active');
  actionSectionEl.classList.remove('active');
  inventoryMenuEl.style.display = '';
  inventoryUIEl.style.display = 'none';
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
  const items = [...actions, '뒤로'];
  displayMenu(actionListEl, items, (idx) => {
    if (idx === actions.length) {
      showMainMenu();
    } else {
      console.log(`Action selected: ${actions[idx]}`);
    }
  });
  actionSectionEl.classList.add('active');
  npcSectionEl.classList.remove('active');
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
    if (num === actions.length + 1) {
      showMainMenu();
    } else if (num > 0 && num <= actions.length) {
      highlightItem(actionListEl, num - 1);
      console.log(`Action selected: ${actions[num - 1]}`);
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

