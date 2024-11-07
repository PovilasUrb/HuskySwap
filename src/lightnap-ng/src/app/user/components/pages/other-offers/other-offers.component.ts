import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-other-offers',
    standalone: true,
    templateUrl: './other-offers.component.html',
    imports: [CardModule]
})
export class IndexComponent {
}
