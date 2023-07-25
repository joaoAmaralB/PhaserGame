import axios from "axios";

export default class PointsScene extends Phaser.Scene {
  points = [];
  record;

  constructor() {
    super("points-scene");

    this.getPastPoints();
    this.getRecord();
  }

  getRecord = async () => {
    const res = await axios.get("http://localhost:8800/record");
    this.record = res.data;
    console.log(this.record)
  };

  getPastPoints = async () => {
    const res = await axios.get("http://localhost:8800/ranking");
    this.points = res.data;

    if (this.points.length > 10) {
      this.points = this.points.slice(
        this.points.length - 10,
        this.points.length
      );
    }

    this.points = this.points.reverse();

    console.log(this.points);
  };

  create() {
    this.add.text(240, 141, `RECORD:${this.record[0].max}`);

    this.add.text(125, 25, "YOUR PAST POINTS:");

    this.createPoint(this.points);

    this.add
      .text(20, 270, "Back")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("initial-scene");
      });
  }

  createPoint(points) {
    points.forEach((point, idx) => {
      this.add.text(180, 70 + 20 * idx, `${point.pontos}`);
    });
  }
}
