import Phaser from "phaser";

export default class Coin extends Phaser.Physics.Arcade.Sprite {
  value;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.anims.play("coin_anim");

    this.value = Math.round(Math.random() * 100);

    scene.physics.world.enable(this);
    scene.add.existing(this);
  }
}
