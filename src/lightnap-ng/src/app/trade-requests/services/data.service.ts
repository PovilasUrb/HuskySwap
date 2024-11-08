import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL_ROOT, ApiResponse, PagedResponse } from "@core";
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
    return this.#http.get<ApiResponse<TradeRequest>>(`${this.#apiUrlRoot}${id}`);
  }

  searchTradeRequests(request: SearchTradeRequestsRequest) {
    return this.#http.post<ApiResponse<PagedResponse<TradeRequest>>>(`${this.#apiUrlRoot}search`, request);
  }

  createTradeRequest(request: CreateTradeRequestRequest) {
    return this.#http.post<ApiResponse<TradeRequest>>(`${this.#apiUrlRoot}`, request);
  }

  updateTradeRequest(id: number, request: UpdateTradeRequestRequest) {
    return this.#http.put<ApiResponse<TradeRequest>>(`${this.#apiUrlRoot}${id}`, request);
  }

  deleteTradeRequest(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}${id}`);
  }
}
