import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";
import { RouteAliasService } from "@routing";
@Component({
    selector: 'app-home-index',
    standalone: true,
    templateUrl: './index.component.html',
    imports: [CardModule, ButtonModule, RouterLink]
})
export class IndexComponent {
    items = [
        { label: "All Classes", icon: "pi pi-fw pi-book", routerLink: this.routeAliasService.getRoute("class-infos") },
        { label: "My Classes", icon: "pi pi-fw pi-book", routerLink: this.routeAliasService.getRoute("my-classes") },
        { label: "My Wishlist", icon: "pi pi-fw pi-gift", routerLink: this.routeAliasService.getRoute("wishlist") },
        { label: "Incoming Swaps", icon: "pi pi-fw pi-search", routerLink: this.routeAliasService.getRoute("incoming-swaps") },
        { label: "Outgoing Swaps", icon: "pi pi-fw pi-sync", routerLink: this.routeAliasService.getRoute("outgoing-swaps") },
        { label: "Completed Swaps", icon: "pi pi-fw pi-verified", routerLink: this.routeAliasService.getRoute("completed-swaps") }
      ];
      constructor(private routeAliasService: RouteAliasService) {}
}
