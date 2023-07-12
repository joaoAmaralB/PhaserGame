const createMidDemonAnims = (anims) => {
    anims.create({
        key: 'mid-demon_idle',
        frames: anims.generateFrameNumbers('mid-demon', {start: 4, end: 7}),
        frameRate: 6,
        repeat: -1
    })

    anims.create({
        key: 'mid-demon_run',
        frames: anims.generateFrameNumbers('mid-demon', {start: 0, end: 3}),
        frameRate: 7,
        repeat: -1
    })
}

export {
    createMidDemonAnims
}