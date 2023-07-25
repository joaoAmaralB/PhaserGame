export default class WinnerScene extends Phaser.Scene {
    coins

  constructor() {
    super("winner-scene");
  }

  init(data) {
    this.data = data

    this.coins = this.data.get("coins");
  }

  create() {
    this.add.text(100, 25, "YOU WIN!", { fontSize: 42 });

    this.add.text(125, 120, 'POINTS:')

    this.add.sprite(215, 127, 'coin')
    this.add.text(225, 121, `${this.coins}`)

    this.add
      .text(180, 250, "MENU")
      .setInteractive()
      .on("pointerdown", () => {
        window.location.reload();
      });
  }
}
