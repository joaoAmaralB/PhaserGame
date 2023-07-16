import Phaser from "phaser";
import { createPlayerAnims } from "../anims/PlayerAnims";
import Player from "../character/Player";
import { sceneEvents } from "../events/EventsCenter";
import Coin from "../items/Coin";
import { createFoxAnims } from "../anims/MerchantFoxAnims";
import { createChestAnims } from "../anims/ChestAnims";
import Fox from "../npcs/MerchantFox";
import Chest from "../items/Chest";

export default class LevelOne extends Phaser.Scene {
  cursors;
  player;
  fox;
  projectile;
  coins;
  door;
  playerCoins;
  playerHealth;

  playerEnemiesCollider;

  constructor() {
    super("lvl-two");
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

    //Anims
    createPlayerAnims(this.anims);
    createFoxAnims(this.anims);
    createChestAnims(this.anims);

    //Map
    const map = this.make.tilemap({ key: "dungeon3" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collides: true });

    //Chests
    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    const chestOverlap = this.physics.add.group();

    const chestLayer = map.getObjectLayer("Chests");
    chestLayer.objects.forEach((chestObj) => {
      chests.get(chestObj.x + 9, chestObj.y - 9, "chest");
      const rectangle = this.add.rectangle(
        chestObj.x + 9,
        chestObj.y,
        16,
        16,
        0xffffff
      );
      this.physics.world.enable(rectangle);
      rectangle.setVisible(false);

      chestOverlap.add(rectangle);
    });

    this.projectile = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    //Player
    this.player = new Player(this, 130, 200, "player-idle");
    this.player.setProjectile(this.projectile);

    this.fox = new Fox(this, 385, 125, "idle_fox");

    this.coins = this.physics.add.group({
      classType: Coin,
    });

    this.projectile.damage = 1;

    //Door
    this.door = this.add.rectangle(818, 199, 40, 5, 0xffffff);
    this.physics.world.enable(this.door);
    this.door.setVisible(false);

    this.physics.add.collider(this.player, wallsLayer);

    this.physics.add.collider(
      this.projectile,
      wallsLayer,
      this.handleProjectileWallsCollision,
      undefined,
      this
    );

    this.physics.add.collider(this.player, chests);
    this.physics.add.overlap(this.player, chestOverlap, this.handlePlayerChestOVerlap, undefined, this);

    this.physics.add.overlap(
      this.player,
      this.door,
      this.handleDoorCollision,
      undefined,
      this
    );

    this.cameras.main.startFollow(this.player, true);

    this.player.coins = this.playerCoins;

    this.player.health = this.playerHealth;
    console.log(this.player.health);
    sceneEvents.emit("player-health-new-level", this.player.health);
  }

  handlePlayerChestOVerlap(player, chest) {
    const X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    if (Phaser.Input.Keyboard.JustDown(X)) {
      chest.open();
    }
  }

  handleDoorCollision(player, door) {
    this.add.image(815, 145, "botao").setScale(0.5);

    const X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    if (Phaser.Input.Keyboard.JustDown(X)) {
      this.data.set("coins", player.coins);
      this.data.set("health", player.health);
      this.scene.start("final-lvl", this.data);
    }
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

    if (this.player.x > this.fox.x) {
      this.time.delayedCall(50, () => {
        this.fox.flipX = true;
      });
    } else {
      this.time.delayedCall(50, () => {
        this.fox.flipX = false;
      });
    }
  }
}
