import { Component } from '@angular/core';
import { GameMaster } from '../pandemik-core/game-master';

@Component({
	selector: 'app-game-master-ui',
	imports: [],
	templateUrl: './game-master-ui.html',
	styleUrls: ['../app.css', './game-master-ui.css'],
})
export class GameMasterUi {

	gameMaster: GameMaster | null = null;

	diseaseStatusString(v: number) {
		if (v === 0) {
			return "ACTIVE";
		}
		if (v === 1) {
			return "RESEARCHED";
		}
		if (v === 2) {
			return "ERRADICATED";
		}
		return v.toString();
	}
}
