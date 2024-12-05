import { inject, Injectable } from "@angular/core";
import { ApiResponse, catchApiError, SuccessApiResponse, throwIfApiError } from "@core";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { ClassUserService } from "src/app/class-users/services/class-user.service";
import { CreateTradeRequestRequest } from "../models/request/create-trade-request-request";
import { SearchTradeRequestsRequest } from "../models/request/search-trade-requests-request";
import { UpdateTradeRequestRequest } from "../models/request/update-trade-request-request";
import { TradeClassUserInfos } from "../models/trade-class-user-infos";
import { DataService } from "./data.service";
import { TradeRequest } from "../models/response/trade-request";

@Injectable({
  providedIn: "root",
})
export class TradeRequestService {
  #dataService = inject(DataService);
  #classUserService = inject(ClassUserService);

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

  getTradeClassUserInfos(tradeRequest: TradeRequest): Observable<ApiResponse<TradeClassUserInfos>> {
    return forkJoin([
      this.#classUserService.getClassUserInfo(tradeRequest.requestingClassUserId),
      this.#classUserService.getClassUserInfo(tradeRequest.targetClassUserId),
    ]).pipe(
      map(([requestingClassUser, targetClassUser]) => {
        if (!requestingClassUser.result) return requestingClassUser as any as ApiResponse<TradeClassUserInfos>;
        if (!targetClassUser.result) return targetClassUser as any as ApiResponse<TradeClassUserInfos>;
        return new SuccessApiResponse<TradeClassUserInfos>({
          id: tradeRequest.id,
          notes: tradeRequest.notes,
          status: tradeRequest.status,
          requestingClassUser: requestingClassUser.result,
          targetClassUser: targetClassUser.result,
        });
      })
    );
  }

  acceptMyTradeRequest(id: number) {
    return this.#dataService.acceptMyTradeRequest(id);
  }

  rejectMyTradeRequest(id: number) {
    return this.#dataService.rejectMyTradeRequest(id);
  }

  cancelMyTradeRequest(id: number) {
    return this.#dataService.cancelMyTradeRequest(id);
  }

  getMyTradeRequestsSent() {
    return this.#dataService.getMyTradeRequestsSent().pipe(
      throwIfApiError(),
      switchMap(response => this.getMyTradeRequestInfosArray(response)),
      catchApiError()
    );
  }

  getMyTradeRequestsReceived() {
    return this.#dataService.getMyTradeRequestsReceived().pipe(
      throwIfApiError(),
      switchMap(response => this.getMyTradeRequestInfosArray(response)),
      catchApiError()
    );
  }

  getMyTradeClassUserInfo(id: number) {
    return this.#dataService.getTradeRequest(id).pipe(
        throwIfApiError(),
        switchMap(tradeRequest => this.getTradeClassUserInfos(tradeRequest.result)),
        catchApiError()
    )
  }

  getMyTradeRequestInfosArray(response: ApiResponse<TradeRequest[]>): Observable<ApiResponse<TradeClassUserInfos[]>> {
    if (response.result.length === 0) {
        return of(new SuccessApiResponse<TradeClassUserInfos[]>([]));
    }
    return forkJoin(response.result.map(tradeRequest => this.getTradeClassUserInfos(tradeRequest))).pipe(
      map(responses => {
        const errorResponse = responses.find(response => !response.result);
        if (errorResponse) {
          return errorResponse as any as ApiResponse<TradeClassUserInfos[]>;
        }
        return new SuccessApiResponse<TradeClassUserInfos[]>(responses.map(response => response.result));
      })
    );
  }
}
