import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent, catchApiError, ErrorListComponent, SuccessApiResponse, throwIfApiError } from "@core";
import { RoutePipe } from "@routing";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { map } from "rxjs";
import { TradeClassUserInfosDisplay } from "src/app/trade-requests/models/trade-class-user-infos-display";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";
import { ConfirmPopupComponent } from "../../../../core/components/controls/confirm-popup/confirm-popup.component";
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
    ConfirmPopupComponent,
    ClassInfoComponent,
    TradeClassUserInfosDisplayComponent
],
})
export class IncomingSwapsComponent {
  #tradeRequestService = inject(TradeRequestService);
  tradeClassUserInfos$ = this.#tradeRequestService.getMyTradeRequestsReceived().pipe(
    throwIfApiError(),
    map((response) => {
      return new SuccessApiResponse(response.result.filter(tradeRequest => tradeRequest.status === "Pending").map(tradeRequest => <TradeClassUserInfosDisplay> { tradeClassUserInfos: tradeRequest, flip: true }));
    }),
    catchApiError()
  );
  errors = new Array<string>();
}
