const createDinoAnims = (anims) => {
    anims.create({
        key: 'dino_idle',
        frames: anims.generateFrameNumbers('dino', {start: 1, end: 4}),
        frameRate: 6,
        repeat: -1
    })

    anims.create({
        key: 'dino_run',
        frames: anims.generateFrameNumbers('dino', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    })

    anims.create({
        key: 'dino_hurt',
        frames: anims.generateFrameNumbers('dino', {start: 0, end: 1}),
        frameRate: 10
    })
}

export {
    createDinoAnims
}