import Phaser from "phaser";
import { createBigDemonAnims } from "../anims/BigDemonAnims";
import { createPlayerAnims } from "../anims/PlayerAnims";
import BigDemon from "../enemies/BigDemon";
import Player from "../character/Player";

export default class Game extends Phaser.Scene {
  cursors;
  player;
  bigDemons;
  hit = 0;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
	this.scene.run('game-ui')

    createPlayerAnims(this.anims);
    createBigDemonAnims(this.anims);

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Ground", tileset, 0, 0);
    const wallsLayer = map.createLayer("Walls", tileset, 0, 0);

    wallsLayer.setCollisionByProperty({ collides: true });

	this.player = new Player(this, 128, 128, "player-idle")

    this.bigDemons = this.physics.add.group({
      classType: BigDemon,
    });

    this.bigDemons.get(208, 208, "big-demon");

	this.physics.add.collider(this.player, wallsLayer);
	this.physics.add.collider(this.player, this.bigDemons, this.handlePlayerCollision, undefined, this);
	this.physics.add.collider(this.bigDemons, wallsLayer);

    this.cameras.main.startFollow(this.player, true);
  }

  handlePlayerCollision(player, bigDemons) {

	const dx = player.x - bigDemons.x
	const dy = player.y - bigDemons.y

	const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

	player.handleDamage(dir)

	this.hit = 1
  }

  update(t, dt) {

	if (this.hit > 0) {
		++this.hit
		if (this.hit > 10) {
			this.hit = 0
		}
		return
	}

    this.player.update(this.cursors)

    this.bigDemons.getChildren().forEach((bigDemon) => {
		bigDemon.update()
      const distance = Phaser.Math.Distance.Between(
        bigDemon.x,
        bigDemon.y,
        this.player.x,
        this.player.y
      );
      if (distance < 150) {
        this.physics.moveToObject(bigDemon, this.player, 40);
      } else {
        bigDemon.body.stop();
      }
    });
  }
}
