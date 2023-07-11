import Phaser from 'phaser'

import Game from './scenes/Game'
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
	scene: [Preloader, Game, GameUi],
	scale: {
		zoom: 2
	}
})
