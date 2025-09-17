// /src/scenes/MenuScene.js

import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants.js";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  init(data) {
    // Saber si llegamos por game over o victoria y cuántos peces se rescataron
    this.gameOver = data.gameOver || false;
    this.victory = data.victory || false;
    this.score = data.score || 0;
  }

  create() {
    // Fondo semi-transparente
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
      0.5
    );

    let startY = GAME_HEIGHT / 2 - 40;

    // Mensaje según el estado
    if (this.gameOver) {
      this.add
        .text(
          GAME_WIDTH / 2,
          startY - 60,
          `¡Perdiste! Rescataste ${this.score} peces`,
          { fontSize: "28px", color: "#ff5555" }
        )
        .setOrigin(0.5);
    } else if (this.victory) {
      this.add
        .text(
          GAME_WIDTH / 2,
          startY - 60,
          `¡Victoria! Rescataste ${this.score} peces`,
          { fontSize: "28px", color: "#00ff55" }
        )
        .setOrigin(0.5);
    }

    // Botón Play
    const playButton = this.add.rectangle(
      GAME_WIDTH / 2,
      startY,
      160,
      50,
      0x00a2ff
    );
    const playText = this.add
      .text(GAME_WIDTH / 2, startY, "Play", {
        fontSize: "24px",
        color: "#fff",
      })
      .setOrigin(0.5);

    // Hacer interactivo
    playButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.scene.start("MainScene");
    });
    playText.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      this.scene.start("MainScene");
    });
  }
}
