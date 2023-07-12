const createMiniDemonAnims = (anims) => {
    anims.create({
        key: 'mini-demon_idle',
        frames: anims.generateFrameNumbers('mini-demon', {start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    })

    anims.create({
        key: 'mini-demon_run',
        frames: anims.generateFrameNumbers('mini-demon', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    })
}

export {
    createMiniDemonAnims
}