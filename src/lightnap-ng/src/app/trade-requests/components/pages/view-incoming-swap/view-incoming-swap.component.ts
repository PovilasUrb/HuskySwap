import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { ApiResponseComponent, ToastService } from "@core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { Observable } from "rxjs";
import { TradeClassUserInfos } from "src/app/trade-requests/models/trade-class-user-infos";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";
import { TradeRequestChatComponent } from "../../controls/trade-request-chat/trade-request-chat.component";
import { ConfirmPopupComponent } from "../../../../core/components/controls/confirm-popup/confirm-popup.component";
import { RoutePipe } from "@routing";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  templateUrl: "./view-incoming-swap.component.html",
  imports: [CommonModule, CardModule, ApiResponseComponent, RouterLink, RoutePipe, ButtonModule, TableModule, ClassInfoComponent, TradeRequestChatComponent, ConfirmPopupComponent],
})
export class RespondComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  #toast = inject(ToastService);
  errors = new Array<string>();
  #confirmationService = inject(ConfirmationService);
  readonly id = input<number>(undefined);
  tradeClassUserInfos$: Observable<TradeClassUserInfos>;

  refresh() {
    this.tradeClassUserInfos$ = this.#tradeRequestService.getMyTradeClassUserInfo(this.id());
  }

  reject() {
    this.#confirmationService.confirm({
      header: "Confirm Reject Trade Request",
      message: `Are you sure that you want to reject this trade request?`,
      target: event.target,
      key: "reject",
      accept: () => {
        this.#tradeRequestService.rejectMyTradeRequest(this.id()).subscribe({
          next: success => {
            this.#toast.success("Trade request rejected successfully.");
            this.refresh();
          },
          error: response => (this.errors = response.errorMessages),
        });
      },
    });
  }
  

  accept() {
    this.#confirmationService.confirm({
      header: "Confirm Accept Trade Request",
      message: `Are you sure that you want to accept this trade request?`,
      target: event.target,
      key: "accept",
      accept: () => {
        this.#tradeRequestService.acceptMyTradeRequest(this.id()).subscribe({
          next: success => {
            this.#toast.success("Trade request accepted successfully.");
            this.refresh();
          },
          error: response => (this.errors = response.errorMessages),
        });
      },
    });
  }

  ngOnInit(): void {
    this.refresh();
  }
}
