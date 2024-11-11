import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-my-swap',
    standalone: true,
    templateUrl: './my-swap.component.html',
    imports: [CardModule]
})
export class IndexComponent {
}