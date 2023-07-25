export default class DeathScene extends Phaser.Scene {
    constructor() {
        super('death-scene')
    }

    create() {
        this.add.text(110, 100, "YOU DIED", { fontSize: 40, color: '#e34b4b' })

        this.add.text(180, 250, "MENU").setInteractive().on('pointerdown', () => {
            window.location.reload();
          });
    }
}