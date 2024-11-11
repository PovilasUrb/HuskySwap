import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-my-trades',
    standalone: true,
    templateUrl: './my-trades.component.html',
    imports: [CardModule]
})
export class IndexComponent {
}
