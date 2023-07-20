import Phaser from "phaser";
import { sceneEvents } from "../events/EventsCenter";

const HealthState = {
  IDLE: "IDLE",
  DAMAGE: "DAMAGE",
  DEAD: "DEAD",
  SHOOTING: "SHOOTING",
  HEAL: "HEAL",
  SPEED: "SPEED",
  DAMAGE_INCREASE: "DAMAGE_INCREASE"
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  healthState = HealthState.IDLE;
  damageTime = 0;
  health = 9;
  projectile;
  coins = 0;
  speed = 120;

  restartText;
  darkOverlay;

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

  handleDamageIncrease() {
    this.setTint(0xEF8E38);

    this.healthState = HealthState.DAMAGE_INCREASE;
    this.damageTime = 0;
  }

  handleSpeed() {
    this.speed += 20;

    this.setTint(0xFBF24B);

    this.healthState = HealthState.SPEED;
    this.damageTime = 0;
  }

  handleHeal(heal) {
    if (this.health > 9) {
      this.health = 9
    }
    else {
      this.health += heal;
    }
    
    this.setTint(0x4cfd4c);

    this.healthState = HealthState.HEAL;
    this.damageTime = 0;
  }

  handleDamage(dir, damage) {
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;

    this.health = this.health - damage;

    if (this.health <= 0) {
      this.healthState = HealthState.DEAD;
      this.scene.cameras.main.zoomTo(1.5, 100);
      this.anims.play("player_death");

      this.darkOverlay = this.scene.add.rectangle(
        0,
        0,
        Number(this.scene.cameras.main.width),
        Number(this.scene.cameras.main.height),
        0x000000
      );
      this.darkOverlay.setOrigin(0);
      this.darkOverlay.setAlpha(0); // Defina a transparência inicialmente como 0

      // Crie um texto para exibir a mensagem de reinício
      this.restartText = this.scene.add.text(
        Number(this.scene.cameras.main.width) / 2 + 10,
        Number(this.scene.cameras.main.height) / 2,
        "REINICAR JOGO",
        {
          fontSize: "12px",
          color: "#ffffff",
        }
      ).setInteractive().on('pointerdown', () => {
        sceneEvents.emit('restart-level');
      });
      this.restartText.setOrigin(0.5);
      this.restartText.setVisible(false);
      sceneEvents.emit("player-death");
      return;
    }

    this.setVelocity(dir.x, dir.y);

    this.setTint(0xe34b4b);
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
      .get(this.x + 10 * vec.x, this.y + 8, "projectile")
      .setScale(0.3);
    projectile.setSize(projectile.width * 0.2, projectile.height * 0.2);

    projectile.setActive(true);
    projectile.setVisible(true);

    projectile.setRotation(angle);
    projectile.setVelocity(vec.x * 250, vec.y * 200);
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

      case HealthState.HEAL:
        this.damageTime += dt;
        if (this.damageTime > 400) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
        }
        break;

        case HealthState.SPEED:
          this.damageTime += dt;
          if (this.damageTime > 400) {
            this.healthState = HealthState.IDLE;
            this.setTint(0xffffff);
          }
          break;

        case HealthState.DAMAGE_INCREASE:
          this.damageTime += dt;
          if (this.damageTime > 400) {
            this.healthState = HealthState.IDLE;
            this.setTint(0xffffff);
          }
        break;

        case HealthState.SHOOTING:
          this.anims.play("player_shoot", true);
          this.setVelocity(0, 0);
          this.shootProjectile();
          this.healthState = HealthState.IDLE;
    }
  }

  update(cursors) {
    console.log('player-update')

    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

    if (cursors.left.isDown) {
      this.anims.play("player_run", true);
      this.flipX = true;
      this.setVelocity(-this.speed, 0);
      this.body.setOffset(9, 12);
    } else if (cursors.right.isDown) {
      this.anims.play("player_run", true);
      this.flipX = false;
      this.setVelocity(this.speed, 0);
      this.body.setOffset(8, 12);
    } else if (cursors.up.isDown) {
      this.anims.play("player_run", true);
      this.setVelocity(0, -this.speed);
    } else if (cursors.down.isDown) {
      this.anims.play("player_run", true);
      this.setVelocity(0, this.speed);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.healthState = HealthState.SHOOTING;
    } else {
      this.anims.play("player_idle", true);
      this.setVelocity(0, 0);
    }
  }
}
