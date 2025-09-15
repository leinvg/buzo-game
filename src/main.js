import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  create() {
    const W = 800, H = 600;

    // Nivel del mar
    this.seaLevel = H / 3;

    // Fondo
    this.add.rectangle(W / 2, H / 6, W, H / 3, 0x87ceeb); // cielo
    this.add.rectangle(W / 2, 2 * H / 3, W, 2 * H / 3, 0x0b4f6c); // mar

    // Línea del mar
    this.add.rectangle(W / 2, this.seaLevel, W, 1, 0xffffff, 0.5);

    // Bote → mitad arriba, mitad abajo
    this.boat = this.add.rectangle(W / 8, this.seaLevel, 120, 40, 0x8b4513);
    this.physics.add.existing(this.boat, true);

    // HUD
    this.score = 0;
    this.oxygen = 50;
    this.oxygenCooldown = 0;

    this.scoreText = this.add.text(12, 12, 'Peces liberados: 0', { fontSize: '20px', color: '#000' });
    this.oxygenLabel = this.add.text(12, 36, 'Oxígeno:', { fontSize: '20px', color: '#000' });
    this.oxygenBar = this.add.rectangle(116, 38, this.oxygen * 2, 16, 0x00bfff).setOrigin(0, 0);

    // Buzo
    this.diver = this.add.rectangle(100, 280, 32, 64, 0xffd166);
    this.physics.add.existing(this.diver);
    this.diver.body.setCollideWorldBounds(true);

    // Peces atrapados
    this.fishes = this.physics.add.group();
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(200, W - 40);
      const y = Phaser.Math.Between(this.seaLevel + 40, H - 60);
      const fish = this.add.rectangle(x, y, 36, 20, 0xff6b6b);
      this.physics.add.existing(fish);
      fish.trapped = true;
      fish.net = this.add.rectangle(x, y, 44, 28, 0x6c757d, 0.5);
      fish.net.setStrokeStyle(2, 0x343a40);
      this.fishes.add(fish);
    }

    // Colisión buzo-pez
    this.physics.add.overlap(this.diver, this.fishes, (diver, fish) => {
      if (fish.trapped) {
        fish.trapped = false;
        fish.net.destroy();
        this.score += 1;
        this.scoreText.setText('Peces liberados: ' + this.score);
        this.oxygen = Math.min(this.oxygen + 15, 100);
        this.oxygenBar.width = this.oxygen * 2;
      }
    });

    // Victoria: tocar el bote con oxígeno
    this.physics.add.overlap(this.diver, this.boat, () => {
      if (this.oxygen > 0) {
        this.scene.pause();
        this.add.text(W / 2 - 220, H / 2, `¡Victoria! Rescataste ${this.score} peces y llegaste al bote.`, {
          fontSize: '24px',
          color: '#000',
          wordWrap: { width: 440 }
        });
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    const swimSpeed = 220;
    const swimUp = -120;
    const maxFallSpeed = 100;

    // Movimiento horizontal
    this.diver.body.setVelocityX(0);
    if (this.cursors.left.isDown) this.diver.body.setVelocityX(-swimSpeed);
    if (this.cursors.right.isDown) this.diver.body.setVelocityX(swimSpeed);

    // Movimiento vertical
    if (this.cursors.up.isDown) {
      this.diver.body.setVelocityY(swimUp);
    } else {
      if (this.diver.body.velocity.y < maxFallSpeed) {
        this.diver.body.setVelocityY(this.diver.body.velocity.y + 5);
      }
    }

    // Restricción: permitir que sobresalga hasta la mitad del cuerpo
    const maxAboveWater = this.seaLevel;
    if (this.diver.y < maxAboveWater) {
      this.diver.y = maxAboveWater;
      this.diver.body.setVelocityY(0);
    }

    // Calcular borde superior
    const diverTop = this.diver.y - this.diver.height / 2;

    // 🔥 Oxígeno: solo se reduce si la cabeza está bajo el agua
    if (diverTop > this.seaLevel) {
      this.oxygenCooldown += delta;
      if (this.oxygenCooldown >= 1000) {
        this.oxygenCooldown = 0;
        this.oxygen -= 5;
        this.oxygenBar.width = Math.max(this.oxygen * 2, 0);

        if (this.oxygen <= 0) {
          this.diver.fillColor = 0x0000ff;
          this.scene.pause();
          this.add.text(400 - 160, 300, '¡El buzo se quedó sin aire!', {
            fontSize: '28px',
            color: '#fff'
          });
        }
      }
    } else {
      this.oxygenCooldown = 0;
    }

    // Actualizar posición de las redes de peces
    this.fishes.getChildren().forEach(fish => {
      if (fish.trapped && fish.net) {
        fish.net.x = fish.x;
        fish.net.y = fish.y;
      }
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 } }
  },
  scene: [MainScene]
};

new Phaser.Game(config);
