const locationNameEl = document.getElementById('location-name');
const locationDescEl = document.getElementById('location-description');
const npcListEl = document.getElementById('npc-list');
const actionListEl = document.getElementById('action-list');
const statusInfoEl = document.getElementById('status-info');

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
    loc.npcs.forEach(npc => {
      const li = document.createElement('li');
      li.textContent = npc;
      npcListEl.appendChild(li);
    });
  }

  actionListEl.innerHTML = '';
  actions.forEach((action, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${action}`;
    actionListEl.appendChild(li);
  });

  statusInfoEl.textContent = `HP: ${player.hp}  기력: ${player.stamina}`;
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

