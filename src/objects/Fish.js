// /src/objects/Fish.js
import Phaser from "phaser";

const FISH_SPEED = 80;
const RELEASE_MULTIPLIER = 3;

export default class Fish extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, speed = FISH_SPEED) {
    super(scene, x, y, "fish");

    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.5);

    this.trapped = true;
    this.speed = speed;
    this.direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;

    // Red (con imagen transparente)
    this.net = scene.add.image(x, y, "bag");
    this.net.setOrigin(0.5, 0.7);
    this.net.setAlpha(0.6);
    this.net.setScale(0.2);

    // Aseguramos orden de render
    this.setDepth(0);
    this.net.setDepth(1);

    // Ajustamos flip inicial según dirección
    this.flipX = this.direction === -1;
    this.net.flipX = this.direction === -1;
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

    // Controlamos el giro de la textura y la red
    this.flipX = this.direction === -1;
    if (this.net) {
      this.net.flipX = this.direction === -1;
    }
  }

  syncNet() {
    if (this.net) {
      this.net.x = this.x;
      this.net.y = this.y;
    }
  }
}
