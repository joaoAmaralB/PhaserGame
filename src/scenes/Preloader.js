import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', './tiles/dungeon_tiles.png')
        this.load.tilemapTiledJSON('dungeon', './tiles/dungeon-01.json')
        
        this.load.spritesheet('player', './character/players.png', {frameWidth: 32, frameHeight: 32})

        this.load.spritesheet('big-demon', './enemies/big-demon.png', {frameWidth: 32, frameHeight: 36})
        this.load.spritesheet('mid-demon', './enemies/mid-demon.png', {frameWidth: 16, frameHeight: 23})
        this.load.spritesheet('mini-demon', './enemies/mini-demon.png', {frameWidth: 16, frameHeight: 19})
        this.load.spritesheet('orc', './enemies/orc.png', {frameWidth: 31.2, frameHeight: 35})
        this.load.spritesheet('dino', './enemies/dino.png', {frameWidth: 16, frameHeight: 28})

        this.load.spritesheet('life', './ui/ui-life.png', {frameWidth: 96, frameHeight: 91})

        this.load.image('projectile', './projectile/01.png')
    }

    create () {
        this.scene.start('game')
    }
}