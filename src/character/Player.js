import Phaser from "phaser";

const HealthState = {
    IDLE: "IDLE",
    DAMAGE: "DAMAGE"
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
    healthState = HealthState.IDLE
    damageTime = 0

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setSize(this.width * 0.5, this.height * 0.6);
        this.body.setOffset(8, 12);
        this.anims.play("player_idle", true);
    }

    handleDamage(dir) {
        if (this.healthState === HealthState.DAMAGE) {
            return
        }

        this.setVelocity(dir.x, dir.y)

        this.setTint(0xFF0000)

        this.healthState = HealthState.DAMAGE
        this.damageTime = 0
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt)

        switch (this.healthState) {
            case HealthState.IDLE:
                
                break;
        
            case HealthState.DAMAGE:
                this.damageTime += dt
                if (this.damageTime > 250) {
                    this.healthState = HealthState.IDLE
                    this.setTint(0xFFFFFF)
                }
                break;
        }
    }

    update(cursors) {
        const speed = 120;

        if (cursors.left.isDown) {
            this.anims.play("player_run", true);
            this.flipX = true;
            this.setVelocity(-speed, 0);
            this.body.setOffset(9, 12);
          } else if (cursors.right.isDown) {
            this.anims.play("player_run", true);
            this.flipX = false;
            this.setVelocity(speed, 0);
            this.body.setOffset(8, 12);
          } else if (cursors.up.isDown) {
            this.anims.play("player_run", true);
            this.setVelocity(0, -speed);
          } else if (cursors.down.isDown) {
            this.anims.play("player_run", true);
            this.setVelocity(0, speed);
          } else if (cursors.space.isDown) {
            this.anims.play("player_shoot", true);
            this.setVelocity(0, 0);
          } else {
            this.anims.play("player_idle", true);
            this.setVelocity(0, 0);
          }
    }
}