const storyElement = document.getElementById('story');
const inputElement = document.getElementById('input');
const submitButton = document.getElementById('submit');

const scenes = {
  town: {
    text: 'You are in the town square. Exits: north.',
    actions: {
      north: 'forest'
    }
  },
  forest: {
    text: 'A goblin blocks your path! Do you attack or run?',
    actions: {
      attack: 'victory',
      run: 'town'
    }
  },
  victory: {
    text: 'You defeated the goblin and return home a hero. The end.',
    actions: {}
  }
};

let currentScene = 'town';

function showScene() {
  storyElement.textContent = scenes[currentScene].text;
}

function handleCommand() {
  const command = inputElement.value.trim().toLowerCase();
  inputElement.value = '';
  const next = scenes[currentScene].actions[command];
  if (next) {
    currentScene = next;
    showScene();
  } else {
    storyElement.textContent += `\nI don't understand '${command}'.`;
  }
}

submitButton.addEventListener('click', handleCommand);
inputElement.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleCommand();
  }
});

showScene();
