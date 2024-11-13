
import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ErrorListComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { CreateTradeRequestRequest } from "src/app/trade-requests/models/request/create-trade-request-request";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";

@Component({
  standalone: true,
  templateUrl: "./my-trades.component.html",
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    RouterLink,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ErrorListComponent,
  ],
})
export class MyTradesComponent {
  #tradeRequestService = inject(TradeRequestService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #fb = inject(FormBuilder);
  readonly requestingClassUserId = input<number>(undefined);
  readonly targetClassUserId = input<number>(undefined);

  errors = new Array<string>();

  form = this.#fb.group({
	// TODO: Update these fields to match the right parameters.
	requestingClassUserId: this.#fb.control(0, [Validators.required]),
	targetClassUserId: this.#fb.control(0, [Validators.required]),
	status: this.#fb.control("string", [Validators.required]),
	notes: this.#fb.control("string", [Validators.required]),
  });

  createClicked() {
    this.errors = [];

    const request = <CreateTradeRequestRequest>this.form.value;

    this.#tradeRequestService.createTradeRequest(request).subscribe(response => {
      if (!response.result) {
        this.errors = response.errorMessages;
        return;
      }

      this.#router.navigate([response.result.id], { relativeTo: this.#activeRoute.parent });
    });
  }
}
