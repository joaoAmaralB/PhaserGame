import Phaser from "phaser";

export default class Orc extends Phaser.Physics.Arcade.Sprite {
    damage = 2;

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setSize(this.width * 0.7, this.height * 0.8);
        this.body.setOffset(9, 9);
    }

    update() {
        
        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            this.anims.play('orc_run', true)

            if (this.body.velocity.x < 0) {
                this.flipX = true
                this.body.setOffset(4, 9);
            }
            else {
                this.flipX = false
                this.body.setOffset(5, 9);
            }
        }
        else {
            this.anims.play('orc_idle', true)
        }
    }
}