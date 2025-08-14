const locationNameEl = document.getElementById('location-name');
const locationDescEl = document.getElementById('location-description');
const npcListEl = document.getElementById('npc-list');
const actionListEl = document.getElementById('action-list');
const npcSectionEl = document.getElementById('npcs');
const actionSectionEl = document.getElementById('actions');
const npcHeaderEl = document.getElementById('npc-header');
const actionHeaderEl = document.getElementById('action-header');
const inventoryHeaderEl = document.getElementById('inventory-header');
const inventoryMenuEl = document.getElementById('inventory-menu');
const inventoryUIEl = document.getElementById('inventory-ui');
const inventoryTabsEl = document.getElementById('inventory-tabs');
const inventoryItemsEl = document.getElementById('inventory-items');
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

const player = {
  hp: 100,
  stamina: 50
};

let actions = [];
let locations = {};
let currentLocation = '';
let currentMenu = 'main';
let currentCategory = 'all';

const inventory = [
  { name: '낡은 칼', type: 'weapon' },
  { name: '천 갑옷', type: 'armor' },
  { name: '붕대', type: 'medicine' },
  { name: '길드 증표', type: 'important' }
];

const equipment = {
  head: null,
  top: null,
  bottom: null,
  back: null,
  gloves: null,
  shoes: null
};

const categories = [
  { key: 'all', label: '전체' },
  { key: 'weapon', label: '무기' },
  { key: 'armor', label: '방어구' },
  { key: 'medicine', label: '의약품' },
  { key: 'important', label: '중요 물품' }
];

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

function displayMenu(listEl, items) {
  listEl.innerHTML = '';
  const elements = items.map((text, idx) => {
    const li = document.createElement('li');
    li.textContent = '';
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
  updateHeaders();
  npcListEl.innerHTML = '';
  actionListEl.innerHTML = '';
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
  updateHeaders();
  const loc = locations[currentLocation];
  const npcs = loc && Array.isArray(loc.npcs)
    ? loc.npcs.slice().sort((a, b) => a.localeCompare(b))
    : [];
  const items = [...npcs, '뒤로'];
  displayMenu(npcListEl, items);
  npcSectionEl.classList.add('active');
  actionSectionEl.classList.remove('active');
}

function openActionMenu() {
  currentMenu = 'actions';
  updateHeaders();
  const items = [...actions, '뒤로'];
  displayMenu(actionListEl, items);
  actionSectionEl.classList.add('active');
  npcSectionEl.classList.remove('active');
}

function renderInventory() {
  renderEquipment();
  renderInventoryTabs();
  renderInventoryItems();
}

function renderInventoryTabs() {
  inventoryTabsEl.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      currentCategory = cat.key;
      renderInventoryItems();
    });
    inventoryTabsEl.appendChild(btn);
  });
}

function renderInventoryItems() {
  inventoryItemsEl.innerHTML = '';
  const filtered = inventory.filter(item => currentCategory === 'all' || item.type === currentCategory);
  filtered.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    inventoryItemsEl.appendChild(li);
  });
}

function renderEquipment() {
  equipHeadEl.textContent = equipment.head || '없음';
  equipTopEl.textContent = equipment.top || '없음';
  equipBottomEl.textContent = equipment.bottom || '없음';
  equipBackEl.textContent = equipment.back || '없음';
  equipGlovesEl.textContent = equipment.gloves || '없음';
  equipShoesEl.textContent = equipment.shoes || '없음';
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
  const [actionData, locationData] = await Promise.all([
    fetch('data/actions.json').then(res => res.json()),
    fetch('data/locations.json').then(res => res.json())
  ]);

  actions = actionData.actions;
  locations = locationData.locations;
  currentLocation = locationData.start;
  render();
  showMainMenu();
}

loadData();

npcHeaderEl.addEventListener('click', () => {
  if (currentMenu === 'npcs') {
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
      console.log(`NPC selected: ${npcs[num - 1]}`);
    }
  } else if (currentMenu === 'actions') {
    if (num === actions.length + 1) {
      showMainMenu();
    } else if (num > 0 && num <= actions.length) {
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

