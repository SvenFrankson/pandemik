import { Component } from '@angular/core';
import { Pandemik as Pandemik } from '../pandemik-core/pandemik';

@Component({
  selector: 'app-pandemik-ui',
  templateUrl: './pandemik-ui.html',
  styleUrls: ['./pandemik-ui.css'],
})
export class PandemikUi {

	constructor(private pandemik: Pandemik) {

	}

	ngOnInit() {
		if (this.pandemik) {
			this.pandemik.initialize(document.querySelector("#game-canvas") as HTMLCanvasElement).then(() => {
				this.pandemik.start();
			});
		}
	}
}
