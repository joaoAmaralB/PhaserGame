import Phaser from "phaser";

const HealthState = {
  IDLE: "IDLE",
  DAMAGE: "DAMAGE",
};

export default class Slug extends Phaser.Physics.Arcade.Sprite {
  damage = 2;
  healthState = HealthState.IDLE;
  damageTime = 0;
  health = 3;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setSize(this.width * 0.7, this.height * 0.8);
    this.body.setOffset(9, 9);

    this.anims.play("slug_anim", true);
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
    if (this.body.velocity.x < 0) {
      this.flipX = true;
      this.body.setOffset(4, 9);
    } else {
      this.flipX = false;
      this.body.setOffset(5, 9);
    }
  }
}
