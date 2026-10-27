import { Component, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Player } from '../pandemik-core/player';

@Component({
	selector: 'app-player-info',
	imports: [
		UpperCasePipe
	],
	templateUrl: './player-info.html',
	styleUrl: './player-info.css',
})
export class PlayerInfo {

	player = signal<Player | null>(null);
}
