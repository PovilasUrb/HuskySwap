import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ConfirmPopupComponent, ErrorListComponent, ToastService } from "@core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable, tap } from "rxjs";
import { UpdateTradeRequestRequest } from "src/app/trade-requests/models/request/update-trade-request-request";
import { TradeRequest } from "src/app/trade-requests/models/response/trade-request";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";

@Component({
  standalone: true,
  templateUrl: "./edit.component.html",
  imports: [CommonModule, CardModule, ReactiveFormsModule, RouterLink, ApiResponseComponent, ConfirmPopupComponent, ButtonModule, ErrorListComponent],
})
export class EditComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #confirmationService = inject(ConfirmationService);
  #toast = inject(ToastService);
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    json: this.#fb.control("", [Validators.required]),
  });

  errors = new Array<string>();

  @Input() id: number;
  tradeRequest$ = new Observable<ApiResponse<TradeRequest>>();

  ngOnInit() {
    this.tradeRequest$ = this.#tradeRequestService.getTradeRequest(this.id).pipe(
      tap(response => {
        if (response.result) {
          this.form.setValue({ json: JSON.stringify(response.result, undefined, 4) });
        }
      })
    );
  }

  saveClicked() {
    this.errors = [];

    let request: UpdateTradeRequestRequest;
    try {
      request = <UpdateTradeRequestRequest>JSON.parse(this.form.value.json);
    } catch (e) {
      this.errors = ["The JSON is invalid."];
      return;
    }

    this.#tradeRequestService.updateTradeRequest(this.id, request).subscribe(response => {
      if (!response.result) {
        this.errors = response.errorMessages;
        return;
      }

      this.#toast.success("Updated successfully");
    });
  }

  deleteClicked(event: any) {
    this.errors = [];

    this.#confirmationService.confirm({
      header: "Confirm Delete Item",
      message: `Are you sure that you want to delete this item?`,
      target: event.target,
      key: "delete",
      accept: () => {
        this.#tradeRequestService.deleteTradeRequest(this.id).subscribe(response => {
          if (!response.result) {
            this.errors = response.errorMessages;
            return;
          }

          this.#toast.success("Deleted successfully");
          this.#router.navigate(["."], { relativeTo: this.#activeRoute.parent });
        });
      },
    });
  }
}