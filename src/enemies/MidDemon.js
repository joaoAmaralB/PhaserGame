import Phaser from "phaser";

export default class MidDemon extends Phaser.Physics.Arcade.Sprite {
    damage = 2;

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setSize(this.width * 0.5, this.height * 0.6);
        this.body.setOffset(4, 8);
    }

    update() {
        
        if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
            this.anims.play('mid-demon_run', true)

            if (this.body.velocity.x < 0) {
                this.flipX = true
            }
            else {
                this.flipX = false
            }
        }
        else {
            this.anims.play('mid-demon_idle', true)
        }
    }
}