import { Component, signal } from '@angular/core';
import { PandemikUi } from './pandemik-ui/pandemik-ui';

@Component({
  selector: 'app-root',
  imports: [PandemikUi],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('pandemik');
}
