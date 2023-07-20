export default class InitialScene extends Phaser.Scene {
    constructor() {
        super('inital-scene')
    }

    create() {
        const x = 200
        const y = 50
        this.add.text(x, y, 'Phaser Game')


        this.add.text(x, y, 'Ver pontuações anteriores')
    }
}