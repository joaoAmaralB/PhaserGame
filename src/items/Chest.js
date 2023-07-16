import Phaser from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  value;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
  }

  open() {
    this.anims.play('chest_anim', true);
  }
}
