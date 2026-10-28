import { Component, input } from '@angular/core';
import { CanDoStatus } from '../pandemik-core/game-master';
import type { CityActionMenuConnector } from '../pandemik-core/ui-connectors/city-action-menu-connector';
import { UpperCasePipe } from '@angular/common';
import { City } from '../pandemik-core/city';

@Component({
	selector: 'app-city-action-menu',
	imports: [
		UpperCasePipe
	],
	templateUrl: './city-action-menu.html',
	styleUrls: ['../app.css', './city-action-menu.css'],
})
export class CityActionMenu {

	connector: CityActionMenuConnector | null = null;
}
