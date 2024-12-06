import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent, ErrorListComponent } from "@core";
import { RoutePipe } from "@routing";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { map, Observable } from "rxjs";
import { TradeClassUserInfosDisplay } from "src/app/trade-requests/models/trade-class-user-infos-display";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { TradeClassUserInfosDisplayComponent } from "../../controls/trade-class-user-infos-display/trade-class-user-infos-display.component";

@Component({
  standalone: true,
  templateUrl: "./outgoing-swaps.component.html",
  imports: [
    CommonModule,
    CardModule,
    ApiResponseComponent,
    ButtonModule,
    TableModule,
    ErrorListComponent,
    TradeClassUserInfosDisplayComponent,
    RoutePipe,
    RouterLink
  ],
})
export class OutgoingSwapsComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  tradeClassUserInfos$: Observable<TradeClassUserInfosDisplay[]>;

  errors = new Array<string>();

  refresh() {
    this.tradeClassUserInfos$ = this.#tradeRequestService.getMyTradeRequestsSent().pipe(
      map(tradeClassUserInfos => {
        return tradeClassUserInfos
          .filter(tradeRequest => tradeRequest.status === "Pending")
          .map(tradeRequest => <TradeClassUserInfosDisplay>{ tradeClassUserInfos: tradeRequest, flip: false });
      })
    );
  }

  ngOnInit() {
    this.refresh();
  }
}
