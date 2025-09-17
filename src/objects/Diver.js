// /src/objects/Diver.js

import Phaser from "phaser";
import { OXYGEN } from "../config/constants.js";

// Velocidades y físicas del buzo
const DIVER_SPEED = {
  swimX: 220,
  swimUp: -120,
  swimDown: 150,
  maxFall: 100,
  gravityStep: 5,
};

export default class Diver extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "diver"); // clave de la imagen cargada en MainScene

    this.scene = scene;

    // Agregar a la escena y habilitar físicas
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);

    // Oxígeno inicial
    this.oxygen = OXYGEN.start;

    // Controles de teclado
    this.cursors = scene.input.keyboard.createCursorKeys();

    // Velocidades
    this.speed = DIVER_SPEED;
  }

  update(delta, seaLevel, hud) {
    const { swimX, swimUp, swimDown, maxFall, gravityStep } = this.speed;

    // Reset horizontal
    this.setVelocityX(0);

    // Movimiento lateral
    if (this.cursors.left.isDown) {
      this.setVelocityX(-swimX);
      this.setFlipX(true); // Voltear sprite al ir a la izquierda
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(swimX);
      this.setFlipX(false);
    }

    // Movimiento vertical
    if (this.cursors.up.isDown) {
      this.setVelocityY(swimUp);
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(swimDown);
    } else if (this.body.velocity.y < maxFall) {
      this.setVelocityY(this.body.velocity.y + gravityStep);
    }

    // Limite del mar (no puede salir por arriba)
    if (this.y < seaLevel) {
      this.y = seaLevel;
      this.setVelocityY(0);
    }

    // Oxígeno: pierde cuando está bajo el agua
    const diverTop = this.y - this.height / 2;
    if (diverTop > seaLevel) {
      const oxygenLossPerSecond = 1;
      this.oxygen -= oxygenLossPerSecond * (delta / 1000);
      this.oxygen = Math.max(this.oxygen, 0);

      hud.setOxygen(this.oxygen);

      if (this.oxygen <= 0) {
        // Game Over
        this.scene.scene.pause();
        this.scene.scene.start("MenuScene", {
          gameOver: true,
          score: hud.score,
        });
      }
    }
  }

  // Recuperar oxígeno al rescatar peces
  addOxygen(amount, hud) {
    this.oxygen = Math.min(this.oxygen + amount, OXYGEN.max);
    hud.setOxygen(this.oxygen);
  }
}
