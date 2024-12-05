
import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ApiResponse, ErrorListComponent, SuccessApiResponse } from "@core";
import { RouteAliasService } from "@routing";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { forkJoin, map, Observable } from "rxjs";
import { ClassUserInfo } from "src/app/class-infos/models/class-user-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { CreateTradeRequestRequest } from "src/app/trade-requests/models/request/create-trade-request-request";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";
import { ApiResponseComponent } from "../../../../core/components/controls/api-response/api-response.component";

@Component({
  standalone: true,
  templateUrl: "./offer-swap.component.html",
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
    ApiResponseComponent,
    ClassInfoComponent
],
})
export class OfferSwapComponent implements OnInit {
  #tradeRequestService = inject(TradeRequestService);
  #classInfoService = inject(ClassInfoService);
  #routeAliasService = inject(RouteAliasService);
  #fb = inject(FormBuilder);
  readonly requestingClassUserId = input<number>(undefined);
  readonly targetClassUserId = input<number>(undefined);
  classUserInfos$?: Observable<ApiResponse<{requestingClassUser: ClassUserInfo, targetClassUser: ClassUserInfo}>>;
  errors = new Array<string>();

  form = this.#fb.group({
    // TODO: Update these fields to match the right parameters.
    notes: this.#fb.control("string", [Validators.required]),
  });
  
  createClicked() {
    this.errors = [];

    const request = <CreateTradeRequestRequest>this.form.value;

    this.#tradeRequestService.makeATradeRequest({
      requestingClassUserId: this.requestingClassUserId(),
      targetClassUserId: this.targetClassUserId(),
      notes: this.form.value.notes
    }).subscribe(response => {
      if (!response.result) {
        this.errors = response.errorMessages;
        return;
      }
      this.#routeAliasService.navigate('my-classes');
    });
  }

  ngOnInit(): void {
    this.classUserInfos$ = forkJoin([this.#classInfoService.getClassUserInfo(this.requestingClassUserId()), this.#classInfoService.getClassUserInfo(this.targetClassUserId())]).pipe(
      map(([requestingClassUser, targetClassUser]) => 
        {
          if (!requestingClassUser.result) return requestingClassUser as any as ApiResponse<{requestingClassUser: ClassUserInfo, targetClassUser: ClassUserInfo}>;
          if (!targetClassUser.result) return targetClassUser as any as ApiResponse<{requestingClassUser: ClassUserInfo, targetClassUser: ClassUserInfo}>;
          return new SuccessApiResponse({
            requestingClassUser: requestingClassUser.result,
            targetClassUser: targetClassUser.result
          });
        }
    ),      
    );
  }
}
