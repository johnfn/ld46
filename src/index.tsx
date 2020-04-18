import { Game } from './game/game';

function initialize() {
  new Game();
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();
});
