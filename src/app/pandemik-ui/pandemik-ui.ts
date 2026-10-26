import { Component, signal } from '@angular/core';
import { Pandemik as Pandemik } from '../pandemik-core/pandemik';
import { CityNametag } from '../city-nametag/city-nametag';
import { City } from '../pandemik-core/city';

@Component({
  selector: 'app-pandemik-ui',
  templateUrl: './pandemik-ui.html',
  styleUrls: ['./pandemik-ui.css'],
  imports: [CityNametag],
})
export class PandemikUi {

	public cities = signal<City[]>([]);

	constructor(private pandemik: Pandemik) {

	}

	ngOnInit() {
		if (this.pandemik) {
			this.pandemik.initialize(document.querySelector("#game-canvas") as HTMLCanvasElement).then(() => {
				this.pandemik.start();
				this.cities.set(this.pandemik.map?.cities ?? []);
			});
		}
	}
}
