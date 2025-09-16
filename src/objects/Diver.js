// /src/objects/Diver.js

import Phaser from "phaser";
import { OXYGEN, GAME_HEIGHT } from "../config/constants.js";

// Constantes locales del buzo
const DIVER_WIDTH = 32;
const DIVER_HEIGHT = 64;
const DIVER_COLOR = 0xffd166;
const DIVER_SPEED = {
  swimX: 220,
  swimUp: -120,
  swimDown: 150,
  maxFall: 100,
  gravityStep: 5,
};

export default class Diver extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, DIVER_WIDTH, DIVER_HEIGHT, DIVER_COLOR);

    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);

    // Oxígeno
    this.oxygen = OXYGEN.start;

    // Controles
    this.cursors = scene.input.keyboard.createCursorKeys();

    // Velocidades
    this.speed = DIVER_SPEED;
  }

  update(delta, seaLevel, hud) {
    const { swimX, swimUp, swimDown, maxFall, gravityStep } = this.speed;

    // Movimiento lateral
    this.body.setVelocityX(0);
    if (this.cursors.left.isDown) this.body.setVelocityX(-swimX);
    if (this.cursors.right.isDown) this.body.setVelocityX(swimX);

    // Movimiento vertical
    if (this.cursors.up.isDown) this.body.setVelocityY(swimUp);
    else if (this.cursors.down.isDown) this.body.setVelocityY(swimDown);
    else if (this.body.velocity.y < maxFall)
      this.body.setVelocityY(this.body.velocity.y + gravityStep);

    // Evitar que suba por encima del mar
    if (this.y < seaLevel) {
      this.y = seaLevel;
      this.body.setVelocityY(0);
    }

    // Consumo continuo de oxígeno (barra progresiva)
    const diverTop = this.y - this.height / 2;
    if (diverTop > seaLevel) {
      const oxygenLossPerSecond = 1; // Oxígeno perdido por segundo
      this.oxygen -= oxygenLossPerSecond * (delta / 1000);
      this.oxygen = Math.max(this.oxygen, 0);

      hud.setOxygen(this.oxygen);

      // Si se queda sin oxígeno, pausa la escena y activa mensaje de Game Over
      if (this.oxygen <= 0) {
        this.fillColor = 0x0000ff;
        this.scene.scene.pause();
        this.scene.scene.start("MenuScene", {
          gameOver: true,
          score: hud.score,
        });
      }
    }
  }

  // Incrementa oxígeno al liberar peces
  addOxygen(amount, hud) {
    this.oxygen = Math.min(this.oxygen + amount, OXYGEN.max);
    hud.setOxygen(this.oxygen);
  }
}
