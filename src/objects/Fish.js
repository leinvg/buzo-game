// /src/objects/Fish.js
import Phaser from "phaser";

// Constantes locales
const FISH_SIZE = { width: 40, height: 20 };
const FISH_COLOR = 0xff0000;
const FISH_NET_COLOR = 0x87ceeb;
const FISH_NET_BORDER = 0x001100;
const FISH_SPEED = 80;
const RELEASE_MULTIPLIER = 3;

export default class Fish extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, speed = FISH_SPEED) {
    super(scene, x, y, FISH_SIZE.width, FISH_SIZE.height, FISH_COLOR);

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
      FISH_SIZE.width + 8,
      FISH_SIZE.height + 8,
      FISH_NET_COLOR,
      0.5
    );
    this.net.setStrokeStyle(2, FISH_NET_BORDER);
  }

  free() {
    this.trapped = false;
    if (this.net) {
      this.net.destroy();
      this.net = null;
    }
    this.speed *= RELEASE_MULTIPLIER;
  }

  update(delta, worldWidth) {
    this.x += (this.direction * this.speed * delta) / 1000;

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
