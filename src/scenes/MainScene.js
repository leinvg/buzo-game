// /src/scenes/MainScene.js

import Phaser from "phaser";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  ENVIRONMENT,
  FISH,
  OXYGEN,
} from "../config/constants.js";

import Fish from "../objects/Fish.js";
import HUD from "../objects/HUD.js";
import Diver from "../objects/Diver.js";
import Boat from "../objects/Boat.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  create() {
    console.log("MainScene.create() ejecutado");

    this.seaLevel = GAME_HEIGHT / 3;

    // background
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 6,
      GAME_WIDTH,
      GAME_HEIGHT / 3,
      ENVIRONMENT.skyColor
    );
    this.add.rectangle(
      GAME_WIDTH / 2,
      (2 * GAME_HEIGHT) / 3,
      GAME_WIDTH,
      (2 * GAME_HEIGHT) / 3,
      ENVIRONMENT.seaColor
    );
    this.add.rectangle(
      GAME_WIDTH / 2,
      this.seaLevel,
      GAME_WIDTH,
      1,
      0xffffff,
      0.5
    );

    // boat
    this.boat = new Boat(this, GAME_WIDTH / 8, this.seaLevel);

    // HUD
    this.hud = new HUD(this);

    // diver
    this.diver = new Diver(this, 100, 280);

    // fishes
    this.fishes = this.add.group();
    for (let i = 0; i < FISH.count; i++) {
      const x = Phaser.Math.Between(200, GAME_WIDTH - 40);
      const y = Phaser.Math.Between(this.seaLevel + 40, GAME_HEIGHT - 60);
      this.fishes.add(new Fish(this, x, y, FISH.speed));
    }

    // collisions diver - fish
    this.physics.add.overlap(this.diver, this.fishes, (diver, fish) => {
      if (fish.trapped) {
        fish.free();
        this.hud.updateScore(this.hud.score + 1);

        // Aumentar oxígeno del diver y reflejar en HUD
        diver.oxygen = Math.min(diver.oxygen + 1, OXYGEN.max);
        this.hud.setOxygen(diver.oxygen);
      }
    });

    // collisions diver - boat
    this.physics.add.overlap(this.diver, this.boat, () => {
      if (this.hud.oxygen > 0) {
        this.scene.pause();
        this.add.text(
          GAME_WIDTH / 2 - 220,
          GAME_HEIGHT / 2,
          `¡Victoria! Rescataste ${this.hud.score} peces y llegaste al bote.`,
          { fontSize: "24px", color: "#000", wordWrap: { width: 440 } }
        );
      }
    });
  }

  update(time, delta) {
    const secondsElapsed = Math.floor(time / 1000);
    this.hud.updateTime(secondsElapsed);

    // diver
    this.diver.update(delta, this.seaLevel, this.hud);

    // HUD
    this.hud.update(delta);

    // fishes
    this.fishes.getChildren().forEach((f) => f.update(delta, GAME_WIDTH));
  }
}
