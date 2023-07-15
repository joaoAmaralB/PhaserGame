const createBigDemonAnims = (anims) => {
    anims.create({
        key: 'big-demon_idle',
        frames: anims.generateFrameNumbers('big-demon', {start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
    })

    anims.create({
        key: 'big-demon_run',
        frames: anims.generateFrameNumbers('big-demon', {start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
    })
}

export {
    createBigDemonAnims
}