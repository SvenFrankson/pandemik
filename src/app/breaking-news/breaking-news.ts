import { Component } from '@angular/core';
import { BreakingNewsConnector } from '../pandemik-core/ui-connectors/breaking-news-connector';
import { UpperCasePipe } from '@angular/common';

@Component({
	selector: 'app-breaking-news',
	imports: [
		UpperCasePipe
	],
	templateUrl: './breaking-news.html',
	styleUrl: './breaking-news.css',
})
export class BreakingNews {

	connector: BreakingNewsConnector | null = null;
}
