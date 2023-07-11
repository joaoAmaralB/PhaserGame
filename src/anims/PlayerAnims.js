import Phaser from "phaser";

const createPlayerAnims = (anims) => {
    anims.create({
        key: 'player_idle',
        frames: anims.generateFrameNumbers('player', {start: 56, end: 56}),
        frameRate: 4,
        repeat: -1
    })

    anims.create({
        key: 'player_run',
        frames: anims.generateFrameNumbers('player', {start: 80, end: 83}),
        frameRate: 6,
        repeat: -1
    })

    anims.create({
        key: 'player_shoot',
        frames: anims.generateFrameNumbers('player', {start: 88, end: 91}),
        frameRate: 10
    })

    anims.create({
        key: 'player_death',
        frames: anims.generateFrameNumbers('player', {start: 96, end: 102}),
        frameRate: 10
    })
}

export {
    createPlayerAnims
}