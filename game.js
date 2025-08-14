const locationNameEl = document.getElementById('location-name');
const locationDescEl = document.getElementById('location-description');
const npcListEl = document.getElementById('npc-list');
const actionListEl = document.getElementById('action-list');
const npcSectionEl = document.getElementById('npcs');
const actionSectionEl = document.getElementById('actions');
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

function render() {
  const loc = locations[currentLocation];
  locationNameEl.textContent = loc && loc.name ? loc.name : '???';
  locationDescEl.textContent = loc ? loc.description : '';

  npcListEl.innerHTML = '';
  if (loc && Array.isArray(loc.npcs)) {
    const sortedNpcs = loc.npcs.slice().sort((a, b) => a.localeCompare(b));
    sortedNpcs.forEach(npc => {
      const li = document.createElement('li');
      li.textContent = npc;
      npcListEl.appendChild(li);
    });
  }

  actionListEl.innerHTML = '';
  actions.forEach(action => {
    const li = document.createElement('li');
    li.textContent = action;
    actionListEl.appendChild(li);
  });

  statusInfoEl.textContent = `HP: ${player.hp}  기력: ${player.stamina}`;
}

function toggleSection(sectionEl) {
  sectionEl.classList.toggle('active');
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
}

loadData();

npcSectionEl.querySelector('h3').addEventListener('click', () => toggleSection(npcSectionEl));
actionSectionEl.querySelector('h3').addEventListener('click', () => toggleSection(actionSectionEl));

document.addEventListener('keydown', (e) => {
  if (e.key === '1') {
    toggleSection(npcSectionEl);
  } else if (e.key === '2') {
    toggleSection(actionSectionEl);
  }
});

function handleCommand() {
  const command = playerCommandEl.value.trim();
  if (command) {
    console.log(`Player command: ${command}`);
    playerCommandEl.value = '';
  }
}

submitCommandEl.addEventListener('click', handleCommand);
playerCommandEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleCommand();
  }
});

