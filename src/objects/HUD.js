// /src/objects/HUD.js

import { OXYGEN } from "../config/constants.js";

// Constantes locales
const HUD_FONT = { fontSize: "20px", color: "#000000" };
const HUD_POSITIONS = {
  time: { x: 780, y: 20, align: "right" },
  score: { x: 20, y: 20 },
  oxygenLabel: { x: 20, y: 50 },
  bar: { x: 130, y: 54, width: 200, height: 12 },
};
const BAR_SAFE_COLOR = 0x03ff5f; // azul
const BAR_CRITICAL_COLOR = 0xff8c00; // naranja

export default class HUD {
  constructor(scene) {
    this.scene = scene;

    this.score = 0;
    this.oxygen = OXYGEN.start;
    this.displayedOxygen = OXYGEN.start;

    // Textos
    this.timeText = scene.add.text(
      HUD_POSITIONS.time.x,
      HUD_POSITIONS.time.y,
      "Tiempo: 0s",
      HUD_FONT
    );
    this.timeText.setOrigin(1, 0);

    this.scoreText = scene.add.text(
      HUD_POSITIONS.score.x,
      HUD_POSITIONS.score.y,
      "Peces liberados: 0",
      HUD_FONT
    );

    this.oxygenLabel = scene.add.text(
      HUD_POSITIONS.oxygenLabel.x,
      HUD_POSITIONS.oxygenLabel.y,
      "Oxígeno:",
      HUD_FONT
    );

    // Barra
    const { x, y, width, height } = HUD_POSITIONS.bar;
    this.barX = x;
    this.barY = y;
    this.barWidth = width;
    this.barHeight = height;
    this.barRadius = height / 2;

    this.border = scene.add.graphics();
    this.border.lineStyle(1, 0x000000, 1);
    this.border.strokeRoundedRect(
      this.barX - 3,
      this.barY - 3,
      this.barWidth + 6,
      this.barHeight + 6,
      this.barRadius + 3
    );

    this.fill = scene.add.graphics();
  }

  updateTime(seconds) {
    this.timeText.setText(`Tiempo: ${seconds}s`);
  }

  updateScore(score) {
    this.score = score;
    this.scoreText.setText(`Peces liberados: ${score}`);
  }

  setOxygen(value) {
    this.oxygen = Phaser.Math.Clamp(value, 0, OXYGEN.max);
  }

  drawBar() {
    this.fill.clear();

    // Ancho de la barra limitado al máximo
    const shown = Phaser.Math.Clamp(this.displayedOxygen, 0, OXYGEN.max);
    const percentage = shown / OXYGEN.max;
    const currentWidth = Phaser.Math.Clamp(
      this.barWidth * percentage,
      0,
      this.barWidth
    );

    if (currentWidth <= 0) return;

    // Color según nivel de oxígeno
    const color = this.oxygen > 3 ? BAR_SAFE_COLOR : BAR_CRITICAL_COLOR;
    this.fill.fillStyle(color, 1);

    // Dibuja la barra progresiva sin salirse del borde
    this.fill.fillRoundedRect(
      this.barX,
      this.barY,
      currentWidth,
      this.barHeight,
      this.barRadius
    );
  }

  update(delta) {
    // Lerp para barra progresiva
    const lerpFactor = 0.1;
    this.displayedOxygen += (this.oxygen - this.displayedOxygen) * lerpFactor;

    // Forzar a 0 si es muy pequeño para que desaparezca correctamente
    if (this.displayedOxygen < 0.01) {
      this.displayedOxygen = 0;
    }

    this.drawBar();
  }
}
