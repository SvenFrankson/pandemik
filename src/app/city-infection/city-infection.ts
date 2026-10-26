import { Component, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { City } from '../pandemik-core/city';

@Component({
	selector: 'app-city-infection',
	imports: [
		UpperCasePipe
	],
	templateUrl: './city-infection.html',
	styleUrl: './city-infection.css',
})
export class CityInfection {
  	city = input.required<City>();
}
