// /src/scenes/MainScene.js

import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, OXYGEN } from "../config/constants.js";
import boatImg from "../assets/boat.png";
import diverImg from "../assets/diver.png";
import seaImg from "../assets/sea.png";
import skyImg from "../assets/sky.png";
import fishImg from "../assets/fish.png";
import bagImg from "../assets/bag.png";

import Fish from "../objects/Fish.js";
import HUD from "../objects/HUD.js";
import Diver from "../objects/Diver.js";
import Boat from "../objects/Boat.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    // Cargamos texturas desde assets
    this.load.image("boat", boatImg);
    this.load.image("diver", diverImg);
    this.load.image("sea", seaImg);
    this.load.image("sky", skyImg);
    this.load.image("fish", fishImg);
    this.load.image("bag", bagImg);
  }

  create() {
    console.log("MainScene.create() ejecutado");

    this.seaLevel = GAME_HEIGHT / 3;

    // background: cielo
    const skyBg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 6, "sky");
    skyBg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT / 3);
    skyBg.setDepth(-6);

    // background: mar
    const seaBg = this.add.image(GAME_WIDTH / 2, (2 * GAME_HEIGHT) / 3, "sea");
    seaBg.setDisplaySize(GAME_WIDTH, (2 * GAME_HEIGHT) / 3);
    seaBg.setDepth(-5);

    // Línea blanca
    this.add
      .rectangle(GAME_WIDTH / 2, this.seaLevel, GAME_WIDTH, 1, 0xffffff, 0.5)
      .setDepth(-4);

    // boat
    this.boat = new Boat(this, 120, this.seaLevel - 15);

    // HUD
    this.hud = new HUD(this);

    // diver
    this.diver = new Diver(this, 100, 380);

    // fishes
    this.fishes = this.add.group();
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(200, GAME_WIDTH - 40);
      const y = Phaser.Math.Between(this.seaLevel + 100, GAME_HEIGHT - 60);
      this.fishes.add(new Fish(this, x, y));
    }

    // collisions diver - fish
    this.physics.add.overlap(this.diver, this.fishes, (diver, fish) => {
      if (fish.trapped) {
        fish.free();
        this.hud.updateScore(this.hud.score + 1);

        diver.oxygen = Math.min(diver.oxygen + 1, OXYGEN.max);
        this.hud.setOxygen(diver.oxygen);
      }
    });

    // collisions diver - boat
    this.physics.add.overlap(this.diver, this.boat, () => {
      if (this.hud.oxygen > 0) {
        this.scene.start("MenuScene", {
          status: "win",
          score: this.hud.score,
        });
      }
    });
  }

  update(time, delta) {
    const secondsElapsed = Math.floor(time / 1000);
    this.hud.updateTime(secondsElapsed);

    this.diver.update(delta, this.seaLevel, this.hud);

    this.hud.update(delta);

    this.fishes.getChildren().forEach((f) => f.update(delta, GAME_WIDTH));

    if (this.hud.oxygen <= 0) {
      this.scene.start("MenuScene", {
        status: "lose",
        score: this.hud.score,
      });
    }
  }
}
