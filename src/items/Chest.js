import Phaser from "phaser";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  value = 100;
  id;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.scene.add.sprite(this.x - 12, this.y - 16.5, "coin").setScale(1.1).setFrame(0);
    
    this.scene.add.text(this.x - 6, this.y - 24, "100").setFont('10');
  }

  open() {
    this.anims.play('chest_anim', true);
  }
}
