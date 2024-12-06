import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent, ErrorListComponent } from "@core";
import { RoutePipe } from "@routing";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { map } from "rxjs";
import { TradeClassUserInfosDisplay } from "src/app/trade-requests/models/trade-class-user-infos-display";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { TradeClassUserInfosDisplayComponent } from "../../controls/trade-class-user-infos-display/trade-class-user-infos-display.component";

@Component({
  standalone: true,
  templateUrl: "./incoming-swaps.component.html",
  imports: [
    CommonModule,
    CardModule,
    RouterLink,
    ApiResponseComponent,
    ButtonModule,
    TableModule,
    RoutePipe,
    ErrorListComponent,
    TradeClassUserInfosDisplayComponent,
  ],
})
export class IncomingSwapsComponent {
  #tradeRequestService = inject(TradeRequestService);
  tradeClassUserInfos$ = this.#tradeRequestService.getMyTradeRequestsReceived().pipe(
    map(tradeClassUserInfos => {
      return tradeClassUserInfos
        .filter(tradeRequest => tradeRequest.status === "Pending")
        .map(tradeRequest => <TradeClassUserInfosDisplay>{ tradeClassUserInfos: tradeRequest, flip: true });
    })
  );
  errors = new Array<string>();
}
