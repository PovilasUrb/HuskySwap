import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ApiResponseComponent, ErrorListComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { forkJoin, map, Observable } from "rxjs";
import { TradeClassUserInfosDisplay } from "src/app/trade-requests/models/trade-class-user-infos-display";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { TradeClassUserInfosDisplayComponent } from "../../controls/trade-class-user-infos-display/trade-class-user-infos-display.component";

@Component({
  standalone: true,
  templateUrl: "./completed-swaps.component.html",
  imports: [CommonModule, CardModule, ApiResponseComponent, ButtonModule, TableModule, ErrorListComponent, TradeClassUserInfosDisplayComponent],
})
export class CompletedSwapsComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  tradeClassUserInfos$: Observable<TradeClassUserInfosDisplay[]>;

  ngOnInit(): void {
    this.tradeClassUserInfos$ = forkJoin([
      this.#tradeRequestService.getMyTradeRequestsSent().pipe(
        map(tradeClassUserInfos => {
          if (tradeClassUserInfos.length === 0) {
            return [];
          }
          return tradeClassUserInfos
            .filter(tradeRequest => tradeRequest.status === "Accepted")
            .map(tradeRequest => <TradeClassUserInfosDisplay>{ tradeClassUserInfos: tradeRequest, flip: false });
        })
      ),
      this.#tradeRequestService.getMyTradeRequestsReceived().pipe(
        map(response => {
          if (response.length === 0) {
            return [];
          }
          return response
            .filter(tradeRequest => tradeRequest.status === "Accepted")
            .map(tradeRequest => <TradeClassUserInfosDisplay>{ tradeClassUserInfos: tradeRequest, flip: true });
        })
      ),
    ])
      .pipe(
        map(([tradeClassUserInfos1, tradeClassUserInfos2]) => {
          return [...tradeClassUserInfos1, ...tradeClassUserInfos2];
        })
      )
      .pipe(
        map(tradeClassUserInfos => {
          tradeClassUserInfos.sort((a, b) => {
            return a.tradeClassUserInfos.id < b.tradeClassUserInfos.id ? -1 : 1;
          });
          return tradeClassUserInfos;
        })
      );
  }

  errors = new Array<string>();
}
