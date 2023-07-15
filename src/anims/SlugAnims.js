const createSlugAnims = (anims) => {
    anims.create({
        key: 'slug_anim',
        frames: anims.generateFrameNumbers('slug', {start: 0, end: 3}),
        frameRate: 4,
        repeat: -1
    })
}

export {
    createSlugAnims
}