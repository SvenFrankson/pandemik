import { Component } from '@angular/core';
import { GameMaster } from '../pandemik-core/game-master';

@Component({
	selector: 'app-game-master-ui',
	imports: [],
	templateUrl: './game-master-ui.html',
	styleUrl: './game-master-ui.css',
})
export class GameMasterUi {

	gameMaster: GameMaster | null = null;
}
