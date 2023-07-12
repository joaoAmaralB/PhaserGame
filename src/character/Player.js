import Phaser from "phaser";

const HealthState = {
  IDLE: "IDLE",
  DAMAGE: "DAMAGE",
  DEAD: "DEAD",
  SHOOTING: "SHOOTING",
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  healthState = HealthState.IDLE;
  damageTime = 0;
  health = 9;
  projectile;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setSize(this.width * 0.5, this.height * 0.6);
    this.body.setOffset(8, 12);
    this.anims.play("player_idle", true);

    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "player_shoot",
      function () {
        this.shootProjectile();
      },
      this
    );
  }

  setProjectile(projectile) {
    this.projectile = projectile;
  }

  handleDamage(dir, damage) {
    if (this.health <= 0) {
      return;
    }

    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    this.health = this.health - damage;

    if (this.health <= 0) {
      this.healthState = HealthState.DEAD;
      this.scene.cameras.main.zoomTo(1.5, 100);
      this.anims.play("player_death");
    } else {
      this.setVelocity(dir.x, dir.y);

      this.setTint(0xe34b4b);

      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  shootProjectile() {
    const vec = new Phaser.Math.Vector2(0, 0);

    if (this.flipX) {
      vec.x = -1;
    } else {
      vec.x = 1;
    }

    const angle = vec.angle();
    const projectile = this.projectile
      .get(this.x + (10 * vec.x), this.y + 8, "projectile")
      .setScale(0.3);
    projectile.setSize(projectile.width * 0.2, projectile.height * 0.2);

    projectile.setActive(true);
    projectile.setVisible(true);

    projectile.setRotation(angle);
    projectile.setVelocity(vec.x * 350, vec.y * 200);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;

      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime > 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
        }
        break;

      case HealthState.SHOOTING:
        this.anims.play("player_shoot", true);
        this.setVelocity(0, 0);
        this.shootProjectile()
        this.healthState = HealthState.IDLE
    }
  }

  update(cursors) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

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
    } else if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.healthState = HealthState.SHOOTING
    } else {
      this.anims.play("player_idle", true);
      this.setVelocity(0, 0);
    }
  }
}
