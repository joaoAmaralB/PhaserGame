const createCoinAnims = (anims) => {
    anims.create({
        key: 'coin_anim',
        frames: anims.generateFrameNumbers('coin', {start: 0, end: 3}),
        frameRate: 4,
        repeat: -1
    })
}

export {
    createCoinAnims
}