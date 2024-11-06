import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-my-offers',
    standalone: true,
    templateUrl: './my-offers.component.html',
    imports: [CardModule]
})
export class IndexComponent {
}