// /src/objects/Boat.js

import Phaser from 'phaser';
import { BOAT } from '../config/constants.js';

export default class Boat extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, BOAT.size.width, BOAT.size.height, BOAT.color);
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // cuerpo estático
  }
}
