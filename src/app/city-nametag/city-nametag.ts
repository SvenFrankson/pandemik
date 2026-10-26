import { Component, input, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { City } from '../pandemik-core/city';

@Component({
	selector: 'app-city-nametag',
	imports: [
		UpperCasePipe
	],
	templateUrl: './city-nametag.html',
	styleUrl: './city-nametag.css',
})
export class CityNametag {
	
	city = input.required<City>();
}
