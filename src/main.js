import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('main');
  }

  create() {
    const W = 800, H = 600;
    this.cameras.main.setBackgroundColor('#0b4f6c');

    // HUD
    this.score = 0;
    this.timeLeft = 30;
    this.scoreText = this.add.text(12, 12, 'Peces liberados: 0', { fontSize: '20px', color: '#ffffff' });
    this.timerText = this.add.text(600, 12, 'Tiempo: 30', { fontSize: '20px', color: '#ffffff' });

    // physics world
    this.physics.world.setBounds(0, 0, W, H);

    // buzo (rectángulo amarillo)
    this.diver = this.add.rectangle(120, H / 2, 48, 28, 0xffd166);
    this.physics.add.existing(this.diver);
    this.diver.body.setCollideWorldBounds(true);

    // peces atrapados
    this.fishes = this.physics.add.group();
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(240, W - 40);
      const y = Phaser.Math.Between(60, H - 60);
      const fish = this.add.rectangle(x, y, 36, 20, 0xff6b6b);
      this.physics.add.existing(fish);
      fish.trapped = true;
      fish.net = this.add.rectangle(x, y, 44, 28, 0x6c757d, 0.5);
      fish.net.setStrokeStyle(2, 0x343a40);
      this.fishes.add(fish);
    }

    // liberar peces al tocar
    this.physics.add.overlap(this.diver, this.fishes, (diver, fish) => {
      if (fish.trapped) {
        fish.trapped = false;
        fish.net.destroy();
        this.score += 1;
        this.scoreText.setText('Peces liberados: ' + this.score);
      }
    });

    // input
    this.cursors = this.input.keyboard.createCursorKeys();

    // timer
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText('Tiempo: ' + this.timeLeft);
        if (this.timeLeft <= 0) {
          this.scene.pause();
          this.add.text(W / 2 - 120, H / 2, '¡Tiempo terminado!', { fontSize: '32px', color: '#fff' });
        }
      },
      loop: true
    });
  }

  update() {
    const speed = 220;
    this.diver.body.setVelocity(0);
    if (this.cursors.left.isDown) this.diver.body.setVelocityX(-speed);
    if (this.cursors.right.isDown) this.diver.body.setVelocityX(speed);
    if (this.cursors.up.isDown) this.diver.body.setVelocityY(-speed);
    if (this.cursors.down.isDown) this.diver.body.setVelocityY(speed);
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
