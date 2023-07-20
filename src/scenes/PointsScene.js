import axios from "axios";

export default class PointsScene extends Phaser.Scene {
    points = {}

    constructor() {
        super('points-scene')
    }

    getPastPoints = async () => {
        const res = await axios.get('');
        this.points = res
    }

    create() {
        this.add.text(200, 50, "Seus pontos anteriores:")

        this.points.forEach((point, idx) => {
            this.add.text(200, 70 + (10 * idx), `${point}`)
        })
    }
}