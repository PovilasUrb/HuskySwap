
import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable } from "rxjs";
import { TradeRequest } from "src/app/trade-requests/models/response/trade-request";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule],
})
export class GetComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  errors = new Array<string>();

  readonly id = input<number>(undefined);
  tradeRequest$?: Observable<ApiResponse<TradeRequest>>;

  ngOnInit() {
    this.tradeRequest$ = this.#tradeRequestService.getTradeRequest(this.id());
  }
}
