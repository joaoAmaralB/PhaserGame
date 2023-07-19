const createChestAnims = (anims) => {
    anims.create({
        key: 'chest_anim',
        frames: anims.generateFrameNumbers('chest', {start: 0, end: 2}),
        frameRate: 10
    })
}

export {
    createChestAnims
}