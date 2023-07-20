import Phaser from "phaser";
import { createBigDemonAnims } from "../anims/BigDemonAnims";
import Player from "../character/Player";
import { sceneEvents } from "../events/EventsCenter";
import EnemyFollowPlayer from "../utils/EnemyFollowPlayer";
import { createMidDemonAnims } from "../anims/MidDemonAnims";
import { createMiniDemonAnims } from "../anims/MiniDemonAnims";
import BigDemon from "../enemies/BigDemon";
import MidDemon from "../enemies/MidDemon";
import MiniDemon from "../enemies/MiniDemon";
import Coin from "../items/Coin";

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
  playerSpeed
  projectileDamage

  playerEnemiesCollider;

  constructor() {
    super("final-lvl");
  }

  init(data) {
    this.data = data;

    this.playerCoins = this.data.get("coins");
    this.playerHealth = this.data.get("health");
    this.playerSpeed = this.data.get("speed");
    this.projectileDamage = this.data.get("projectileDamage");

    console.log('Damage: ' + this.projectileDamage);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui");

    sceneEvents.emit("player-coins-changed", this.playerCoins);
    sceneEvents.emit("player-health-changed", 0);

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

    this.player.coins = this.playerCoins;

    this.player.health = this.playerHealth;

    this.player.speed = this.playerSpeed;

    this.cameras.main.startFollow(this.player, true);

    this.player.setProjectile(this.projectile);

    this.projectile.damage = this.projectileDamage;

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

    this.bigDemon.get(480, 344, "big-demon").setScale(2);

    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.bigDemon, wallsLayer);
    this.physics.add.collider(this.midDemons, wallsLayer);
    this.physics.add.collider(this.miniDemons, wallsLayer);

    this.physics.add.collider(
      this.player,
      this.bigDemon,
      this.handlePlayerCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.player,
      this.midDemons,
      this.handlePlayerCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.player,
      this.miniDemons,
      this.handlePlayerCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.projectile,
      wallsLayer,
      this.handleProjectileWallsCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.projectile,
      this.bigDemon,
      this.handleProjectileBigEnemyCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.projectile,
      this.midDemons,
      this.handleProjectileMidEnemyCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.projectile,
      this.miniDemons,
      this.handleProjectileMiniEnemyCollision,
      undefined,
      this
    );

    sceneEvents.on("player-death", () => {
      // Escureça a tela gradualmente ao longo de 1 segundo
      this.tweens.add({
        targets: this.player.darkOverlay,
        alpha: 0.7,
        duration: 1000,
        onComplete: () => {
          // Quando a tela estiver completamente escura, após 1 segundo, exiba o texto de reinício
          this.player.restartText.setVisible(true);
        },
      });
    });

    console.log('tudo certo')
  }

  handleProjectileWallsCollision(projectile) {
    projectile.destroy();
  }

  handleProjectileBigEnemyCollision(projectile, enemy) {
    projectile.destroy(true);
    enemy.handleDamage(this.projectile.damage);

    if (enemy.health <= 0) {
      this.midDemons.get(enemy.x - 10, enemy.y, "mid-demon");
      this.midDemons.get(enemy.x + 10, enemy.y, "mid-demon");
      enemy.destroy(true);
    }
  }

  handleProjectileMidEnemyCollision(projectile, enemy) {
    projectile.destroy(true);
    enemy.handleDamage(this.projectile.damage);

    if (enemy.health <= 0) {
      this.miniDemons.get(enemy.x - 20, enemy.y + 20, "mini-demon");
      this.miniDemons.get(enemy.x + 20, enemy.y + 20, "mini-demon");
      enemy.destroy(true);
    }
  }

  handleProjectileMiniEnemyCollision(projectile, enemy) {
    projectile.destroy(true);
    enemy.handleDamage(this.projectile.damage);

    if (enemy.health <= 0) {
      this.coins.get(enemy.x, enemy.y, "coin");
      enemy.destroy(true);
    }
  }

  handlePlayerCollision(player, enemy) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    player.handleDamage(dir, enemy.damage);

    sceneEvents.emit("player-health-changed", enemy.damage);

    if (this.player.health <= 0) {
      this.player.body.stop();
      //this.scene.pause()
    }
  }

  update(t, dt) {
    this.player.update(this.cursors);

    EnemyFollowPlayer(this.bigDemon, this.player, this, 30, 200);
    EnemyFollowPlayer(this.midDemons, this.player, this, 40, 200);
    EnemyFollowPlayer(this.miniDemons, this.player, this, 45, 200);
  }
}
