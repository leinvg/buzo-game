// /src/objects/Boat.js

import Phaser from "phaser";

export default class Boat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "boat");

    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    this.setOrigin(0.5, 0.5);
  }
}
