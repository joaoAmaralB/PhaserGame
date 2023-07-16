import Phaser from 'phaser'

import LevelOne from './scenes/LevelOne'
import LevelTwo from './scenes/LevelTwo'
import FinalLevel from './scenes/FinalLevel'
import Preloader from './scenes/Preloader'
import GameUi from './scenes/GameUI'



export default new Phaser.Game({
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		},
	},
	scene: [Preloader, LevelOne, LevelTwo, FinalLevel, GameUi],
	scale: {
		zoom: 2
	}
})
