import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ApiResponse, ApiResponseComponent, catchApiError, ErrorListComponent, SuccessApiResponse, throwIfApiError } from "@core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { map, Observable } from "rxjs";
import { TradeClassUserInfosDisplay } from "src/app/trade-requests/models/trade-class-user-infos-display";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { ConfirmPopupComponent } from "../../../../core/components/controls/confirm-popup/confirm-popup.component";
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
    ConfirmPopupComponent,
    TradeClassUserInfosDisplayComponent,
  ],
})
export class OutgoingSwapsComponent implements OnInit {
  #confirmationService = inject(ConfirmationService);
  #tradeRequestService = inject(TradeRequestService);
  tradeClassUserInfos$: Observable<ApiResponse<TradeClassUserInfosDisplay[]>>;
  
  errors = new Array<string>();

  refresh() {
    this.tradeClassUserInfos$ = this.#tradeRequestService.getMyTradeRequestsSent().pipe(
      throwIfApiError(),
      map(response => {
        return new SuccessApiResponse(response.result
        .filter(tradeRequest => tradeRequest.status === "Pending")
        .map(tradeRequest => <TradeClassUserInfosDisplay>{ tradeClassUserInfos: tradeRequest, flip: false }))
      }),
      catchApiError()
    );
  }

  cancelRequest(id: number) {
    this.#confirmationService.confirm({
      header: "Confirm Delete Item",
      message: `Are you sure that you want to delete this item?`,
      target: event.target,
      key: "delete",
      accept: () => {
        this.#tradeRequestService.cancelMyTradeRequest(id).subscribe({
          next: (response) => {
            if (!response.result) {
              this.errors = response.errorMessages;
              return;
            }
            this.refresh();
          },
        });
      },
    });
  }

  ngOnInit() {
    this.refresh();
  }
}