// /src/main.js

import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "./config/constants.js";
import MainScene from "./scenes/MainScene.js";
import MenuScene from "./scenes/MenuScene.js";

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game",
  backgroundColor: 0x87ceeb,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [MenuScene, MainScene], // MenuScene primero para mostrar el menú al cargar
};

const game = new Phaser.Game(config);
