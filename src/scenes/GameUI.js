import Phaser from "phaser";
import { sceneEvents } from "../events/EventsCenter";

export default class GameUi extends Phaser.Scene {
    health
    healthNum

    constructor() {
        super({ key: 'game-ui' })
    }

    create() {
        this.health = this.add.sprite(40, 15, 'life').setScale(0.8);
        this.health.setFrame(9)
        this.healthNum = 9

        sceneEvents.on('player-health-changed', this.handleHealthChange, this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.on('player-health-changed', this.handleHealthChange, this)
        })
    }

    handleHealthChange(damage) {
        var newHealth = this.healthNum - damage

        if (newHealth < 0) {
            newHealth = 0
        }

        this.healthNum = newHealth

        this.health.setFrame(this.healthNum)
    }
}