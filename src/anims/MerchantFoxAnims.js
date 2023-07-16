const createFoxAnims = (anims) => {
  anims.create({
    key: "idle_fox",
    frames: anims.generateFrameNumbers("fox", { start: 0, end: 9 }),
    frameRate: 10,
    repeat: -1,
  });
};

export { createFoxAnims };
