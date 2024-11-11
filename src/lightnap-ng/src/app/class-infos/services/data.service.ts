
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL_ROOT, ApiResponse, PagedResponse } from "@core";
import { tap } from "rxjs";
import {ClassInfoHelper } from "../helpers/class-info.helper";
import { CreateClassInfoRequest } from "../models/request/create-class-info-request";
import { SearchClassInfosRequest } from "../models/request/search-class-infos-request";
import { UpdateClassInfoRequest } from "../models/request/update-class-info-request";
import { ClassInfo } from "../models/response/class-info";

@Injectable({
  providedIn: "root",
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrlRoot = `${inject(API_URL_ROOT)}ClassInfos/`;

  getClassInfo(id: number) {
    return this.#http.get<ApiResponse<ClassInfo>>(`${this.#apiUrlRoot}${id}`).pipe(
      tap(response => {
        if (response.result) {
          ClassInfoHelper.rehydrate(response.result);
        }
      })
    );
  }

  searchClassInfos(request: SearchClassInfosRequest) {
    return this.#http.post<ApiResponse<PagedResponse<ClassInfo>>>(`${this.#apiUrlRoot}search`, request).pipe(
      tap(response => {
        if (response.result) {
          response.result.data.forEach(ClassInfoHelper.rehydrate);
        }
      })
    );
  }

  createClassInfo(request: CreateClassInfoRequest) {
    return this.#http.post<ApiResponse<ClassInfo>>(`${this.#apiUrlRoot}`, request);
  }

  updateClassInfo(id: number, request: UpdateClassInfoRequest) {
    return this.#http.put<ApiResponse<ClassInfo>>(`${this.#apiUrlRoot}${id}`, request);
  }

  deleteClassInfo(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}${id}`);
  }
}
