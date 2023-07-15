import Phaser from "phaser";

const EnemyFollowPlayer = (enemyGroup, player, scene, speed, dist) => {
  enemyGroup.getChildren().forEach((enemy) => {
    enemy.update();
    const distance = Phaser.Math.Distance.Between(
      enemy.x,
      enemy.y,
      player.x,
      player.y
    );
    if (distance < dist && player.health > 0) {
      scene.physics.moveToObject(enemy, player, speed);
    } else {
      enemy.body.stop();
    }
  });
};

export default EnemyFollowPlayer
