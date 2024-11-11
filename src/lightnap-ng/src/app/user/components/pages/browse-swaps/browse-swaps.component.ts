import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-browse-swaps',
    standalone: true,
    templateUrl: './browse-swaps.component.html',
    imports: [CardModule]
})
export class IndexComponent {
}
