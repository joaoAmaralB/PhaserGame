import Phaser from "phaser";
import { createBigDemonAnims } from "../anims/BigDemonAnims";
import { createPlayerAnims } from "../anims/PlayerAnims";
import BigDemon from "../enemies/BigDemon";
import Player from "../character/Player";
import { sceneEvents } from "../events/EventsCenter";

export default class Game extends Phaser.Scene {
  cursors;
  player;
  bigDemons;
  projectile;

  playerEnemiesCollider;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui");

    createPlayerAnims(this.anims);
    createBigDemonAnims(this.anims);

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    this.projectile = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    wallsLayer.setCollisionByProperty({ collides: true });

    this.player = new Player(this, 128, 128, "player-idle");
    this.player.setProjectile(this.projectile);

    this.bigDemons = this.physics.add.group({
      classType: BigDemon,
    });

    this.bigDemons.get(208, 208, "big-demon");

    this.physics.add.collider(this.player, wallsLayer);
    this.playerEnemiesCollider = this.physics.add.collider(
      this.player,
      this.bigDemons,
      this.handlePlayerCollision,
      undefined,
      this
    );
    this.physics.add.collider(this.bigDemons, wallsLayer);
    this.physics.add.collider(this.projectile, wallsLayer, this.handleProjectileWallsCollision, undefined, this);
    this.physics.add.collider(
      this.projectile,
      this.bigDemons,
      this.handleProjectileEnemyCollision,
      undefined,
      this
    );

    this.cameras.main.startFollow(this.player, true);
  }

  handleProjectileEnemyCollision(projectile, enemy) {
    this.projectile.killAndHide(projectile);
    this.bigDemons.killAndHide(enemy);
    enemy.body.enable = false;
  }

  handleProjectileWallsCollision(projectile) {
    this.projectile.killAndHide(projectile);
  }

  handlePlayerCollision(player, enemy) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    player.handleDamage(dir, enemy.damage);

    sceneEvents.emit("player-health-changed", enemy.damage);

    if (this.player.health <= 0) {
      this.playerEnemiesCollider.destroy();
      this.player.body.stop();
    }
  }

  update(t, dt) {
    this.player.update(this.cursors);

    this.bigDemons.getChildren().forEach((bigDemon) => {
      bigDemon.update();
      const distance = Phaser.Math.Distance.Between(
        bigDemon.x,
        bigDemon.y,
        this.player.x,
        this.player.y
      );
      if (distance < 150 && this.player.health > 0) {
        this.physics.moveToObject(bigDemon, this.player, 40);
      } else {
        bigDemon.body.stop();
      }
    });
  }
}
