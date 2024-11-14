import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ErrorListComponent, ToastService } from "@core";
import { RoutePipe } from "@routing";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { Observable } from "rxjs";
import { TradeClassUserInfos } from "src/app/trade-requests/models/trade-class-user-infos";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";
import { ConfirmPopupComponent } from "../../../../core/components/controls/confirm-popup/confirm-popup.component";

@Component({
  standalone: true,
  templateUrl: "./respond.component.html",
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
],
})
export class RespondComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  #toast = inject(ToastService);
  errors = new Array<string>();
  #confirmationService = inject(ConfirmationService);
  readonly id = input<number>(undefined);
  tradeClassUserInfos$: Observable<ApiResponse<TradeClassUserInfos>>;

  refresh() {
    this.tradeClassUserInfos$ = this.#tradeRequestService.getMyTradeClassUserInfo(this.id());
  }

  reject() {
    this.#tradeRequestService.rejectMyTradeRequest(this.id()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return;
        }
        this.#toast.success("Trade request rejected successfully.");
        this.refresh();
      },
    });
  }

  accept() {
    this.#tradeRequestService.acceptMyTradeRequest(this.id()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return;
        }
        this.#toast.success("Trade request accepted successfully.");
        this.refresh();
      },
    });
  }

  ngOnInit(): void {
    this.refresh();
  }
}
