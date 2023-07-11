import Phaser from "phaser";

export default class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: 'game-ui' })
    }

    create() {
        const life = this.add.sprite(40, 15, 'life').setScale(0.8);
        life.setFrame(9)
    }
}