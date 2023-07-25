import Phaser from 'phaser'

import LevelOne from './scenes/LevelOne'
import LevelTwo from './scenes/LevelTwo'
import FinalLevel from './scenes/FinalLevel'
import Preloader from './scenes/Preloader'
import GameUi from './scenes/GameUI'
import InitialScene from './scenes/InitialScene'
import PointsScene from './scenes/PointsScene'
import DeathScene from './scenes/DeathScene'
import WinnerScene from './scenes/WinnerScene'



export default new Phaser.Game({
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		},
	},
	scene: [Preloader, InitialScene, PointsScene, LevelOne, LevelTwo, FinalLevel, GameUi, DeathScene, WinnerScene],
	scale: {
		zoom: 2
	}
})
