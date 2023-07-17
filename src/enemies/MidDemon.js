import Phaser from "phaser";

const HealthState = {
  IDLE: "IDLE",
  DAMAGE: "DAMAGE",
};

export default class MidDemon extends Phaser.Physics.Arcade.Sprite {
  damage = 1;
  healthState = HealthState.IDLE;
  damageTime = 0;
  health = 3;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setSize(this.width * 0.5, this.height * 0.6);
    this.body.setOffset(4, 8);
    this.setScale(1.5);
  }

  handleDamage(damage) {
    if (this.health <= 0) {
      return;
    }

    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    this.health = this.health - damage;

    if (this.health <= 0) {
      this.destroy(true);
    } else {
      this.setTint(0xe34b4b);

      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;

      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime > 300) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
        }
        break;
    }
  }

  update() {
    if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
      this.anims.play("mid-demon_run", true);

      if (this.body.velocity.x < 0) {
        this.flipX = true;
      } else {
        this.flipX = false;
      }
    } else {
      this.anims.play("mid-demon_idle", true);
    }
  }
}
