// /src/objects/Fish.js

import Phaser from 'phaser';
import { FISH } from '../config/constants.js';

export default class Fish extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, speed = FISH.speed) {
    super(scene, x, y, FISH.size.width, FISH.size.height, FISH.color);

    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.trapped = true;
    this.speed = speed;
    this.direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

    // Red de captura
    this.net = scene.add.rectangle(
      x,
      y,
      FISH.size.width + 8,
      FISH.size.height + 8,
      FISH.netColor,
      0.5
    );
    this.net.setStrokeStyle(2, FISH.netBorder);
  }

  free() {
    this.trapped = false;
    if (this.net) {
      this.net.destroy();
      this.net = null;
    }
    this.speed *= FISH.releaseMultiplier;
  }

  update(delta, worldWidth) {
    this.x += this.direction * this.speed * delta / 1000;

    if (this.trapped) {
      const halfW = this.width / 2;
      if (this.x <= halfW) {
        this.direction = 1;
        this.x = halfW;
      } else if (this.x >= worldWidth - halfW) {
        this.direction = -1;
        this.x = worldWidth - halfW;
      }
      this.syncNet();
    } else {
      if (this.x < -50 || this.x > worldWidth + 50) {
        if (this.net) {
          this.net.destroy();
          this.net = null;
        }
        this.destroy();
      }
    }
  }

  syncNet() {
    if (this.net) {
      this.net.x = this.x;
      this.net.y = this.y;
    }
  }
}
