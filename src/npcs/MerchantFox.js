import Phaser from "phaser";

export default class Fox extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setSize(this.width, this.height);
    this.setScale(0.8)
    this.body.setOffset(60, 70);

    this.anims.play("idle_fox", true);
  }

  update() {
    //TODO 
  }
}
