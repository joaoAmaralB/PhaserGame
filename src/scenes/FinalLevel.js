import Phaser from "phaser";
import { createBigDemonAnims } from "../anims/BigDemonAnims";
import { createPlayerAnims } from "../anims/PlayerAnims";
import Player from "../character/Player";
import { sceneEvents } from "../events/EventsCenter";
import EnemyFollowPlayer from "../utils/EnemyFollowPlayer";
import { createMidDemonAnims } from "../anims/MidDemonAnims";
import { createMiniDemonAnims } from "../anims/MiniDemonAnims";
import BigDemon from "../enemies/BigDemon";
import MidDemon from "../enemies/MidDemon";
import MiniDemon from "../enemies/MiniDemon";
import Coin from "../character/Coin";

export default class LevelOne extends Phaser.Scene {
  cursors;
  player;
  bigDemon;
  midDemons;
  miniDemons;
  projectile;
  coins;
  playerCoins;
  playerHealth;

  playerEnemiesCollider;

  constructor() {
    super("final-lvl");
  }

  init(data) {
    this.data = data;

    this.playerCoins = this.data.get("coins");
    this.playerHealth = this.data.get("health");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui");

    sceneEvents.emit("player-coins-changed", this.playerCoins);
    sceneEvents.emit("player-health-changed", 0);

    createPlayerAnims(this.anims);
    createBigDemonAnims(this.anims);
    createMidDemonAnims(this.anims);
    createMiniDemonAnims(this.anims);

    const map = this.make.tilemap({ key: "dungeon2" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collides: true });

    this.projectile = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.player = new Player(this, 112, 54, "player-idle");
    this.player.setProjectile(this.projectile);

    this.bigDemon = this.physics.add.group({
      classType: BigDemon,
    });

    this.midDemons = this.physics.add.group({
      classType: MidDemon,
    });

    this.miniDemons = this.physics.add.group({
      classType: MiniDemon,
    });

    this.coins = this.physics.add.group({
      classType: Coin,
    });

    this.projectile.damage = 1;

    this.bigDemon.get(480, 344, "big-demon").setScale(2);

    this.physics.add.collider(this.player, wallsLayer);

    this.physics.add.collider(
      this.projectile,
      wallsLayer,
      this.handleProjectileWallsCollision,
      undefined,
      this
    );

    this.cameras.main.startFollow(this.player, true);

    this.player.coins = this.playerCoins;

    this.player.health = this.playerHealth;
    console.log(this.player.health);
    sceneEvents.emit("player-health-new-level", this.player.health);
  }

  handleProjectileEnemyCollision(projectile, enemy) {
    this.projectile.killAndHide(projectile);
    enemy.body.enable = false;
  }

  handleProjectileWallsCollision(projectile) {
    this.projectile.killAndHide(projectile);
  }

  handleOrcCollision(projectile, enemy) {
    const dx = enemy.x - projectile.x;
    const dy = enemy.y - projectile.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    enemy.handleDamage(dir, projectile.damage);

    if (enemy.health <= 0) {
      enemy.body.enable = false;
    }
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

    EnemyFollowPlayer(this.bigDemon, this.player, this, 40, 200);
  }
}
