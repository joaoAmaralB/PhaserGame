import Phaser from "phaser";
import { createPlayerAnims } from "../anims/PlayerAnims";
import Player from "../character/Player";
import { sceneEvents } from "../events/EventsCenter";
import EnemyFollowPlayer from "../utils/EnemyFollowPlayer";
import { createDinoAnims } from "../anims/DinoAnims";
import { createOrcAnims } from "../anims/OrcAnims";
import Dino from "../enemies/Dino";
import Orc from "../enemies/Orc";
import { createCoinAnims } from "../anims/CoinAnims";
import Coin from "../items/Coin";
import Slug from "../enemies/Slug";
import { createSlugAnims } from "../anims/SlugAnims";
import SlugPotion from "../items/SlugPotion";

export default class LevelOne extends Phaser.Scene {
  cursors;
  player;
  dinos;
  orcs;
  projectile;
  door;
  slugs;
  coins;
  potions;

  playerEnemiesCollider;

  constructor() {
    super("lvl-one");

    sceneEvents.on("player-death", () => {
      this.scene.stop('game-ui')
      this.scene.start('death-scene')
    });
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui");

    createCoinAnims(this.anims);
    createPlayerAnims(this.anims);
    createDinoAnims(this.anims);
    createOrcAnims(this.anims);
    createSlugAnims(this.anims);

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    this.projectile = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.potions = this.physics.add.group({
      classType: SlugPotion,
    });

    wallsLayer.setCollisionByProperty({ collides: true });

    this.player = new Player(this, 58, 128, "player-idle");
    this.player.setProjectile(this.projectile);

    this.dinos = this.physics.add.group({
      classType: Dino,
    });

    this.orcs = this.physics.add.group({
      classType: Orc,
    });

    this.slugs = this.physics.add.group({
      classType: Slug,
    });

    this.coins = this.physics.add.group({
      classType: Coin,
    });

    this.projectile.damage = 1;

    this.dinos.get(458, 108, "dino");
    this.dinos.get(408, 108, "dino");
    this.dinos.get(408, 208, "dino");
    this.dinos.get(320, 158, "dino");
    this.dinos.get(308, 208, "dino");
    this.dinos.get(328, 58, "dino");
    this.dinos.get(160, 228, "dino");
    this.orcs.get(608, 108, "orc");
    this.orcs.get(160, 108, "orc");
    this.dinos.get(628, 128, "dino");
    this.dinos.get(688, 138, "dino");
    this.slugs.get(608, 308, "slug");
    this.slugs.get(658, 378, "slug");

    this.door = this.add.rectangle(816, 84, 40, 5, 0xffffff);
    this.physics.world.enable(this.door);
    this.door.setVisible(false);

    this.physics.add.collider(this.player, wallsLayer);

    this.playerEnemiesCollider = this.physics.add.collider(
      this.player,
      this.dinos,
      this.handlePlayerCollision,
      undefined,
      this
    );
    this.playerEnemiesCollider = this.physics.add.collider(
      this.player,
      this.orcs,
      this.handlePlayerCollision,
      undefined,
      this
    );

    this.physics.add.collider(this.dinos, wallsLayer);
    this.physics.add.collider(this.orcs, wallsLayer);
    this.physics.add.collider(this.slugs, wallsLayer);
    this.physics.add.collider(
      this.projectile,
      wallsLayer,
      this.handleProjectileWallsCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.projectile,
      this.dinos,
      this.handleProjectileEnemyCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.projectile,
      this.orcs,
      this.handleProjectileEnemyCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.projectile,
      this.slugs,
      this.handleProjectileSlugCollision,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.door,
      this.handleDoorCollision,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.handlePlayerCoinsOverlap,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.potions,
      this.handlePlayerPotionCollide,
      undefined,
      this
    );

    this.cameras.main.startFollow(this.player, true);
  }

  handlePlayerPotionCollide(player, potion) {
    player.handleHeal(potion.heal);
    sceneEvents.emit("player-heal", player.health);
    potion.destroy();
  }

  handleProjectileSlugCollision(projectile, enemy) {
    projectile.destroy(true);
    enemy.handleDamage(this.projectile.damage);

    if (enemy.health <= 0) {
      this.potions.get(enemy.x, enemy.y, "slug-potion");
      enemy.destroy(true);
    }
  }

  handlePlayerCoinsOverlap(player, coin) {
    coin.destroy(true);
    player.coins += coin.value;
    sceneEvents.emit("player-coins-changed", player.coins);
  }

  handleDoorCollision(player, door) {
    this.add.image(816, 34, "botao").setScale(0.5);

    const X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    if (Phaser.Input.Keyboard.JustDown(X)) {
      this.data.set("coins", player.coins);
      this.data.set("health", player.health);
      this.scene.stop("lvl-one");
      this.scene.start("lvl-two", this.data);
    }
  }

  handleProjectileWallsCollision(projectile) {
    projectile.destroy(true);
  }

  handleProjectileEnemyCollision(projectile, enemy) {
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

    EnemyFollowPlayer(this.dinos, this.player, this, 45, 150);
    EnemyFollowPlayer(this.orcs, this.player, this, 40, 150);
    EnemyFollowPlayer(this.slugs, this.player, this, -10, 70);
  }
}
