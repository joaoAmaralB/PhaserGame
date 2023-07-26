export default class HowToPlay extends Phaser.Scene {
  constructor() {
    super("how-to-play");
  }

  create() {
    this.add.text(120, 100, ' ↑ - UP\n ↓ - DOWN\n → - RIGHT\n ← - LEFT\n x - INTERACTION\n SPACE - SHOOT');

    this.add
      .text(20, 270, "Back")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("initial-scene");
      });
  }
}
