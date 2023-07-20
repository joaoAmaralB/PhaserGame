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
  chests
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
    createFoxAnims(this.anims);
    createChestAnims(this.anims);

    //Map
    const map = this.make.tilemap({ key: "dungeon3" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collides: true });

    //Chests
    this.chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    const chestCollider = this.physics.add.group({
      immovable: true
    });

    const chestLayer = map.getObjectLayer("Chests");
    chestLayer.objects.forEach((chestObj) => {
      this.chests.get(chestObj.x + 9, chestObj.y - 9, "chest");
      const rectangle = this.add.rectangle(
        chestObj.x + 9,
        chestObj.y - 9,
        16,
        16,
        0xffffff
      );
      this.physics.world.enable(rectangle);
      rectangle.setVisible(false);

      chestCollider.add(rectangle);
    });

    this.chests.getChildren().forEach((chest, index) => {
      chest.body.setOffset(0, 16)
      chest.id = index
    })

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

    this.physics.add.overlap(this.player, this.chests, this.handlePlayerChestOpen, undefined, this);
    this.physics.add.collider(this.player, chestCollider);

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

  handlePlayerChestOpen(player, chest) {
    const X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    if (Phaser.Input.Keyboard.JustDown(X)) {

      console.log(player.coins)
      if (player.coins < 100) {
        return
      }

      chest.open();

      player.coins -= 100

      sceneEvents.emit("player-coins-changed", player.coins);

      this.time.delayedCall(300, () => {
        switch (chest.id) {
          case 0:
            const potion0 = this.add.image(chest.x + 20, chest.y, 'yellow_potion')
            this.physics.world.enable(potion0);
            this.add.existing(potion0);
            this.physics.add.collider(this.player, potion0, this.handleSpeedUp, undefined, this);
            break;
    
          case 1:
            const potion1 = this.add.image(chest.x + 20, chest.y, 'green_potion')
            this.physics.world.enable(potion1);
            this.add.existing(potion1);
            this.physics.add.collider(this.player, potion1, this.handleHealthUp, undefined, this);
            break;
    
          case 3:
            const potion2 = this.add.image(chest.x + 20, chest.y, 'red_potion')
            this.physics.world.enable(potion2);
            this.add.existing(potion2);
            this.physics.add.collider(this.player, potion2, this.handleDamageUp, undefined, this);
            break;
        }
      })
    }
  }

  handleHealthUp(player, potion) {
    player.handleHeal(9 - player.health)
    sceneEvents.emit("player-heal", player.health);
    potion.destroy()
  }

  handleSpeedUp(player, potion) {
    player.handleSpeed()
    this.data.set("speed", player.speed);
    potion.destroy()
  }

  handleDamageUp(player, potion) {
    this.projectile.damage = 2;
    player.handleDamageIncrease()
    this.data.set("projectileDamage", this.projectile.damage);
    potion.destroy()
  }

  handleDoorCollision(player, door) {
    this.add.image(815, 145, "botao").setScale(0.5);

    const X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    if (Phaser.Input.Keyboard.JustDown(X)) {
      this.data.set("coins", player.coins);
      this.data.set("health", player.health);
      this.data.set("projectileDamage", this.projectile.damage);
      this.data.set("speed", player.speed)
      console.log('Damage' + this.projectile.damage);
      this.scene.stop()
      this.scene.start("final-lvl", this.data);
    }
  }

  handleProjectileWallsCollision(projectile, walls) {
    projectile.destroy()
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
