import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ConfirmPopupComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable } from "rxjs";
import { TradeRequest } from "src/app/trade-requests/models/response/trade-request";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ConfirmPopupComponent, ButtonModule],
})
export class GetComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  errors = new Array<string>();

  @Input() id: number;
  tradeRequest$ = new Observable<ApiResponse<TradeRequest>>();

  ngOnInit() {
    this.tradeRequest$ = this.#tradeRequestService.getTradeRequest(this.id);
  }
}
