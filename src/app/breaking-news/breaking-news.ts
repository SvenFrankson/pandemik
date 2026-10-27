import { Component } from '@angular/core';
import { BreakingNewsConnector } from '../pandemik-core/ui-connectors/breaking-news-connector';

@Component({
	selector: 'app-breaking-news',
	imports: [],
	templateUrl: './breaking-news.html',
	styleUrl: './breaking-news.css',
})
export class BreakingNews {

	connector: BreakingNewsConnector | null = null;
}
