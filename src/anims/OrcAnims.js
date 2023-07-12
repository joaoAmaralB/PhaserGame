const createOrcAnims = (anims) => {
    anims.create({
        key: 'orc_idle',
        frames: anims.generateFrameNumbers('orc', {start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    })

    anims.create({
        key: 'orc_run',
        frames: anims.generateFrameNumbers('orc', {start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    })
}

export {
    createOrcAnims
}