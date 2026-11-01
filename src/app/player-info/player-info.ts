import { Component, input, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Player } from '../pandemik-core/player';
import { GameMaster } from '../pandemik-core/game-master';

@Component({
	selector: 'app-player-info',
	imports: [
		UpperCasePipe
	],
	templateUrl: './player-info.html',
	styleUrls: ['../app.css', './player-info.css'],
})
export class PlayerInfo {

	player = input.required<Player>()
	gameMaster = input.required<GameMaster>()

	discardPlayerCard(cardIndex: number): void {
		this.gameMaster().doDiscardPlayerCard(this.player(), cardIndex);
	}
}
