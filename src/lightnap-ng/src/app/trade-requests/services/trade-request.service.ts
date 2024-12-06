import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { CreateTradeRequestRequest } from "../models/request/create-trade-request-request";
import { SearchTradeRequestsRequest } from "../models/request/search-trade-requests-request";
import { UpdateTradeRequestRequest } from "../models/request/update-trade-request-request";
import { TradeRequest } from "../models/response/trade-request";
import { TradeClassUserInfos } from "../models/trade-class-user-infos";
import { DataService } from "./data.service";
import { CreateChatMessageRequest } from "../models/request/create-chat-message-request";

@Injectable({
  providedIn: "root",
})
export class TradeRequestService {
  #dataService = inject(DataService);
  #classInfoService = inject(ClassInfoService);

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

  getTradeClassUserInfos(tradeRequest: TradeRequest): Observable<TradeClassUserInfos> {
    return forkJoin([
      this.#classInfoService.getClassUserInfo(tradeRequest.requestingClassUserId),
      this.#classInfoService.getClassUserInfo(tradeRequest.targetClassUserId),
    ]).pipe(
      map(([requestingClassUser, targetClassUser]) => {
        if (!requestingClassUser) return requestingClassUser as any as TradeClassUserInfos;
        if (!targetClassUser) return targetClassUser as any as TradeClassUserInfos;
        return <TradeClassUserInfos>{
          id: tradeRequest.id,
          notes: tradeRequest.notes,
          status: tradeRequest.status,
          requestingClassUser: requestingClassUser,
          targetClassUser: targetClassUser,
        };
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
    return this.#dataService.getMyTradeRequestsSent().pipe(switchMap(tradeRequests => this.getMyTradeRequestInfosArray(tradeRequests)));
  }

  getMyTradeRequestsReceived() {
    return this.#dataService.getMyTradeRequestsReceived().pipe(switchMap(tradeRequests => this.getMyTradeRequestInfosArray(tradeRequests)));
  }

  getMyTradeClassUserInfo(id: number) {
    return this.#dataService.getTradeRequest(id).pipe(switchMap(tradeRequest => this.getTradeClassUserInfos(tradeRequest)));
  }

  getMyTradeRequestInfosArray(tradeRequests: TradeRequest[]): Observable<TradeClassUserInfos[]> {
    if (tradeRequests.length === 0) {
      return of(<TradeClassUserInfos[]>[]);
    }
    return forkJoin(tradeRequests.map(tradeRequest => this.getTradeClassUserInfos(tradeRequest)));
  }

  createChatMessage(id: number, request: CreateChatMessageRequest) {
    return this.#dataService.createChatMessage(id, request);
  }

  getChatMessages(id: number, sinceMessageId: number) {
    return this.#dataService.getChatMessages(id, sinceMessageId);
  }
}
