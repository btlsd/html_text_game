const locationNameEl = document.getElementById('location-name');
const locationDescEl = document.getElementById('location-description');
const npcListEl = document.getElementById('npc-list');
const actionListEl = document.getElementById('action-list');
const npcSectionEl = document.getElementById('npcs');
const actionSectionEl = document.getElementById('actions');
const npcHeaderEl = document.getElementById('npc-header');
const actionHeaderEl = document.getElementById('action-header');
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

function updateHeaders() {
  if (currentMenu === 'main') {
    npcHeaderEl.textContent = '1. 인물';
    actionHeaderEl.textContent = '2. 행동';
  } else {
    npcHeaderEl.textContent = '인물';
    actionHeaderEl.textContent = '행동';
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

