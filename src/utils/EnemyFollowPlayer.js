import Phaser from "phaser";

const EnemyFollowPlayer = (enemyGroup, player, scene, speed) => {
  enemyGroup.getChildren().forEach((enemy) => {
    enemy.update();
    const distance = Phaser.Math.Distance.Between(
      enemy.x,
      enemy.y,
      player.x,
      player.y
    );
    if (distance < 150 && player.health > 0) {
      scene.physics.moveToObject(enemy, player, speed);
    } else {
      enemy.body.stop();
    }
  });
};

export default EnemyFollowPlayer
