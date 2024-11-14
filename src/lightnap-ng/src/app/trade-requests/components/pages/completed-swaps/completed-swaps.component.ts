import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, catchApiError, ErrorListComponent, SuccessApiResponse, throwIfApiError } from "@core";
import { RoutePipe } from "@routing";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { forkJoin, map, Observable, switchMap, tap } from "rxjs";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";
import { ConfirmPopupComponent } from "../../../../core/components/controls/confirm-popup/confirm-popup.component";
import { TradeClassUserInfosDisplayComponent } from "../../controls/trade-class-user-infos-display/trade-class-user-infos-display.component";
import { TradeClassUserInfosDisplay } from "src/app/trade-requests/models/trade-class-user-infos-display";

@Component({
  standalone: true,
  templateUrl: "./completed-swaps.component.html",
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
    TradeClassUserInfosDisplayComponent,
  ],
})
export class CompletedSwapsComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  tradeClassUserInfos$: Observable<ApiResponse<TradeClassUserInfosDisplay[]>>;

  ngOnInit(): void {
    this.tradeClassUserInfos$ = forkJoin([
      this.#tradeRequestService.getMyTradeRequestsSent().pipe(
        throwIfApiError(),
        map(response => {
          if (response.result.length === 0) {
            return new SuccessApiResponse([]);
          }
          return new SuccessApiResponse(
            response.result
              .filter(tradeRequest => tradeRequest.status === "Accepted")
              .map(tradeRequest => <TradeClassUserInfosDisplay>{ tradeClassUserInfos: tradeRequest, flip: false })
          );
        }),
        catchApiError()
      ),
      this.#tradeRequestService.getMyTradeRequestsReceived().pipe(
        throwIfApiError(),
        map(response => {
          if (response.result.length === 0) {
            return new SuccessApiResponse([]);
          }
          return new SuccessApiResponse(
            response.result
              .filter(tradeRequest => tradeRequest.status === "Accepted")
              .map(tradeRequest => <TradeClassUserInfosDisplay>{ tradeClassUserInfos: tradeRequest, flip: true })
          );
        }),
        catchApiError()
      ),
    ])
      .pipe(
        map(([tradeClassUserInfos1, tradeClassUserInfos2]) => {
          return new SuccessApiResponse([...tradeClassUserInfos1.result, ...tradeClassUserInfos2.result]);
        })
      )
      .pipe(
        map(response => {
          response.result.sort((a, b) => {
            return a.tradeClassUserInfos.id < b.tradeClassUserInfos.id ? -1 : 1;
          });
          return response;
        })
      );
  }

  errors = new Array<string>();
}
