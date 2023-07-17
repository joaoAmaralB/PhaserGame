import Phaser from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  value;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    //scene.physics.world.enable(this);
    //scene.add.existing(this);
    //this.body.setOffset(0, 16)

  }

  open() {
    this.anims.play('chest_anim', true);
  }
}
