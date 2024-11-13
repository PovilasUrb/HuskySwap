import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent, catchApiError, ErrorListComponent, SuccessApiResponse, throwIfApiError } from "@core";
import { RoutePipe } from "@routing";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";
import { ConfirmPopupComponent } from "../../../../core/components/controls/confirm-popup/confirm-popup.component";
import { TradeClassUserInfosComponent } from "../../controls/trade-class-user-infos/trade-class-user-infos.component";
import { filter, map, switchMap, tap } from "rxjs";

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
    TradeClassUserInfosComponent,
  ],
})
export class IncomingSwapsComponent {
  #tradeRequestService = inject(TradeRequestService);
  tradeClassUserInfos$ = this.#tradeRequestService.getMyTradeRequestsReceived().pipe(
    throwIfApiError(),
    map((response) => {
      return new SuccessApiResponse(response.result.filter((tradeRequest) => tradeRequest.status === "Pending"));
    }),
    catchApiError()
  );
  errors = new Array<string>();
}
