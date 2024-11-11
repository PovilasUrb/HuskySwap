import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-create-swap',
    standalone: true,
    templateUrl: './create-swap.component.html',
    imports: [CardModule]
})
export class IndexComponent {
}
