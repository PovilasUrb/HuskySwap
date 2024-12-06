import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL_ROOT, PagedResponse } from "@core";
import { tap } from "rxjs";
import { TradeRequestHelper } from "../helpers/trade-request.helper";
import { CreateTradeRequestRequest } from "../models/request/create-trade-request-request";
import { SearchTradeRequestsRequest } from "../models/request/search-trade-requests-request";
import { UpdateTradeRequestRequest } from "../models/request/update-trade-request-request";
import { TradeRequest } from "../models/response/trade-request";

@Injectable({
  providedIn: "root",
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrlRoot = `${inject(API_URL_ROOT)}TradeRequests/`;

  getTradeRequest(id: number) {
    return this.#http.get<TradeRequest>(`${this.#apiUrlRoot}${id}`).pipe(
      tap(tradeRequest => {
        if (tradeRequest) {
          TradeRequestHelper.rehydrate(tradeRequest);
        }
      })
    );
  }

  searchTradeRequests(request: SearchTradeRequestsRequest) {
    return this.#http.post<PagedResponse<TradeRequest>>(`${this.#apiUrlRoot}search`, request).pipe(
      tap(results => {
        if (results) {
          results.data.forEach(TradeRequestHelper.rehydrate);
        }
      })
    );
  }

  createTradeRequest(request: CreateTradeRequestRequest) {
    return this.#http.post<TradeRequest>(`${this.#apiUrlRoot}`, request);
  }

  makeATradeRequest(request: CreateTradeRequestRequest) {
    return this.#http.post<TradeRequest>(`${this.#apiUrlRoot}my-trades`, request);
  }

  updateTradeRequest(id: number, request: UpdateTradeRequestRequest) {
    return this.#http.put<TradeRequest>(`${this.#apiUrlRoot}${id}`, request);
  }

  deleteTradeRequest(id: number) {
    return this.#http.delete<boolean>(`${this.#apiUrlRoot}${id}`);
  }

  getMyTradeRequestsSent() {
    return this.#http.get<TradeRequest[]>(`${this.#apiUrlRoot}sent`);
  }

  acceptMyTradeRequest(id: number) {
    return this.#http.post<boolean>(`${this.#apiUrlRoot}${id}/accept`, null);
  }

  rejectMyTradeRequest(id: number) {
    return this.#http.post<boolean>(`${this.#apiUrlRoot}${id}/reject`, null);
  }

  cancelMyTradeRequest(id: number) {
    return this.#http.post<boolean>(`${this.#apiUrlRoot}${id}/cancel`, null);
  }

  getMyTradeRequestsReceived() {
    return this.#http.get<TradeRequest[]>(`${this.#apiUrlRoot}received`);
  }
}
