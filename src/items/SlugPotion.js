import Phaser from "phaser";

export default class SlugPotion extends Phaser.Physics.Arcade.Sprite {
  heal = 1;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.scene.tweens.add({
      targets: this,
      y: this.y + 5,
      duration: 800,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setScale(0.8);
    this.body.setSize(this.width * 0.6, this.height * 0.8);
  }
}
