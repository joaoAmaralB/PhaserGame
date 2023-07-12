import Phaser from "phaser";
import { createBigDemonAnims } from "../anims/BigDemonAnims";
import { createPlayerAnims } from "../anims/PlayerAnims";
import BigDemon from "../enemies/BigDemon";
import Player from "../character/Player";
import { sceneEvents } from "../events/EventsCenter";
import EnemyFollowPlayer from "../utils/EnemyFollowPlayer";
import { createMidDemonAnims } from "../anims/MidDemonAnims";
import { createMiniDemonAnims } from "../anims/MiniDemonAnims";
import { createDinoAnims } from "../anims/DinoAnims";
import { createOrcAnims } from "../anims/OrcAnims";
import MidDemon from "../enemies/MidDemon";
import MiniDemon from "../enemies/MiniDemon";
import Dino from "../enemies/Dino";
import Orc from "../enemies/Orc";

export default class Game extends Phaser.Scene {
  cursors;
  player;
  bigDemons;
  midDemons;
  miniDemons;
  dinos;
  orcs;
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
    createMidDemonAnims(this.anims);
    createMiniDemonAnims(this.anims);
    createDinoAnims(this.anims);
    createOrcAnims(this.anims);

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

    this.midDemons = this.physics.add.group({
      classType: MidDemon,
    });

    this.miniDemons = this.physics.add.group({
      classType: MiniDemon,
    });

    this.dinos = this.physics.add.group({
      classType: Dino,
    });

    this.orcs = this.physics.add.group({
      classType: Orc,
    });


    this.bigDemons.get(208, 208, "big-demon");
    this.midDemons.get(308, 208, "mid-demon");
    this.miniDemons.get(408, 208, "mini-demon");
    this.dinos.get(508, 108, "dino");
    this.orcs.get(608, 108, "orc");

    this.physics.add.collider(this.player, wallsLayer);
    this.playerEnemiesCollider = this.physics.add.collider(
      this.player,
      this.bigDemons,
      this.handlePlayerCollision,
      undefined,
      this
    );
    this.physics.add.collider(this.bigDemons, wallsLayer);
    this.physics.add.collider(
      this.projectile,
      wallsLayer,
      this.handleProjectileWallsCollision,
      undefined,
      this
    );
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

    EnemyFollowPlayer(this.bigDemons, this.player, this, 40);
    EnemyFollowPlayer(this.midDemons, this.player, this, 45);
    EnemyFollowPlayer(this.miniDemons, this.player, this, 50);
    EnemyFollowPlayer(this.dinos, this.player, this, 45);
    EnemyFollowPlayer(this.orcs, this.player, this, 40);
  }
}
