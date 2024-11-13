
import { inject, Injectable } from "@angular/core";
import { CreateTradeRequestRequest } from "../models/request/create-trade-request-request";
import { SearchTradeRequestsRequest } from "../models/request/search-trade-requests-request";
import { UpdateTradeRequestRequest } from "../models/request/update-trade-request-request";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class TradeRequestService {
  #dataService = inject(DataService);

    getTradeRequest(id: number) {
        return this.#dataService.getTradeRequest(id);
    }

    searchTradeRequests(request: SearchTradeRequestsRequest) {
        return this.#dataService.searchTradeRequests(request);
    }

    createTradeRequest(request: CreateTradeRequestRequest) {
        return this.#dataService.createTradeRequest(request);
    }

    makeATradeRequest(request: CreateTradeRequestRequest) {
        return this.#dataService.makeATradeRequest(request);
    }

    updateTradeRequest(id: number, request: UpdateTradeRequestRequest) {
        return this.#dataService.updateTradeRequest(id, request);
    }

    deleteTradeRequest(id: number) {
        return this.#dataService.deleteTradeRequest(id);
    }
}
