import { Component, input, signal, ViewChild } from '@angular/core';
import { Pandemik as Pandemik } from '../pandemik-core/pandemik';
import { CityNametag } from '../city-nametag/city-nametag';
import { CityInfection } from '../city-infection/city-infection';
import { City } from '../pandemik-core/city';
import { CityActionMenu } from '../city-action-menu/city-action-menu';
import { BreakingNews } from '../breaking-news/breaking-news';
import { PlayerInfo } from '../player-info/player-info';

@Component({
  selector: 'app-pandemik-ui',
  templateUrl: './pandemik-ui.html',
  styleUrls: ['./pandemik-ui.css'],
  imports: [CityNametag, CityInfection, CityActionMenu, BreakingNews, PlayerInfo],
})
export class PandemikUi {

	private pandemik: Pandemik | null = null;

	@ViewChild(CityActionMenu) cityActionMenu!: CityActionMenu;
	@ViewChild(BreakingNews) breakingNews!: BreakingNews;
	@ViewChild(PlayerInfo) playerInfo!: PlayerInfo;
	public cities = signal<City[]>([]);

	constructor() {

	}

	ngOnInit() {
		this.pandemik = new Pandemik(document.querySelector("#game-canvas") as HTMLCanvasElement);
		this.pandemik.onPlayerAdded = (player) => {
			this.playerInfo.player.set(player);
		};
		this.pandemik.initialize().then(() => {
			this.pandemik!.start();
			this.cities.set(this.pandemik!.map?.cities ?? []);
			this.cityActionMenu.connector = this.pandemik!.cityActionMenuConnector;
			this.breakingNews.connector = this.pandemik!.breakingNewsConnector;
		});
	}
}
