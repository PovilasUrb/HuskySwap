
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ApiResponseComponent, EmptyPagedResponse, SuccessApiResponse } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { startWith, Subject, switchMap } from "rxjs";
import { TradeRequest } from "src/app/trade-requests/models/response/trade-request";
import { TradeRequestService } from "src/app/trade-requests/services/trade-request.service";

@Component({
  standalone: true,
  templateUrl: "./index.component.html",
  imports: [CommonModule, CardModule, ApiResponseComponent, TableModule, RouterModule, ButtonModule],
})
export class IndexComponent {
  pageSize = 10;

  #tradeRequestService = inject(TradeRequestService);

  #lazyLoadEventSubject = new Subject<TableLazyLoadEvent>();
  searchResults$ = this.#lazyLoadEventSubject.pipe(
    switchMap(event =>
      this.#tradeRequestService.searchTradeRequests({
        pageSize: this.pageSize,
        pageNumber: event.first / this.pageSize + 1,
      })
    ),
    // We need to bootstrap the p-table with a response to get the whole process running. We do it this way to
    // fake an empty response so we can avoid a redundant call to the API.
    startWith(new SuccessApiResponse(new EmptyPagedResponse<TradeRequest>()))
  );

  onLazyLoad(event: TableLazyLoadEvent) {
    this.#lazyLoadEventSubject.next(event);
  }
}
