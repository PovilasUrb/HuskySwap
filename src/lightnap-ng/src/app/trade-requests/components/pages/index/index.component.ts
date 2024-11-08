import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ApiResponseComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";

@Component({
  standalone: true,
  templateUrl: "./index.component.html",
  imports: [CommonModule, CardModule, ApiResponseComponent, RouterModule, ButtonModule],
})
export class IndexComponent {
  #tradeRequestService = inject(TradeRequestService);
  tradeRequests$ = this.#tradeRequestService.searchTradeRequests({ pageNumber: 1, pageSize: 10 });
}
