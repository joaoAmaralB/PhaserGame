import Phaser from "phaser";
import { sceneEvents } from "../events/EventsCenter";

export default class GameUi extends Phaser.Scene {
  health;
  healthNum;
  coinUi;

  constructor() {
    super({ key: "game-ui" });
  }

  create() {
    this.health = this.add.sprite(40, 15, "life").setScale(0.8);
    this.health.setFrame(9);
    this.healthNum = 9;

    this.coinUi = this.add.sprite(15, 35, "coin").setScale(1.1);
    this.coinUi.setFrame(0);

    const coinsLabel = this.add.text(23, 28, "0");

    sceneEvents.on("player-coins-changed", (coins) => {
      console.log("Coins:" + coins);
      coinsLabel.text = coins.toString();
      this.scene.pause();
    });

    sceneEvents.on("player-heal", (newHealth) => {
      console.log("New Health:" + newHealth);
      if (newHealth > 9) {
        return;
      }
      this.healthNum = newHealth;
      this.health.setFrame(newHealth);
    });

    sceneEvents.on("player-health-changed", this.handleHealthChange, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off("player-health-damage", this.handleHealthChange, this);
      sceneEvents.off("player-coins-changed");
    });
  }

  handleHealthChange(damage) {
    var newHealth = this.healthNum - damage;
    console.log("Vida atual:" + this.healthNum);
    console.log("Dano:" + damage);
    console.log("Nova vida:" + newHealth);

    if (newHealth < 0) {
      newHealth = 0;
    }

    this.healthNum = newHealth;

    this.health.setFrame(this.healthNum);
  }
}
