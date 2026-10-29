import { Component, input, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Player } from '../pandemik-core/player';

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
}
