export default class InitialScene extends Phaser.Scene {
  constructor() {
    super("initial-scene");
  }

  create() {
    const x = 100;
    const y = 100;
    this.add.text(x, y - 50, "PHASER GAME", { fontSize: 32 });

    this.add
      .text(x + 75, y + 50, "PLAY")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("lvl-one");
      });

    this.add
      .text(x + 16, y + 100, "YOUR OTHER SCORES")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("points-scene");
      });
  }
}
