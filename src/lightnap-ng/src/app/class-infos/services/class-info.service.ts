
import { inject, Injectable } from "@angular/core";
import { CreateClassInfoRequest } from "../models/request/create-class-info-request";
import { SearchClassInfosRequest } from "../models/request/search-class-infos-request";
import { UpdateClassInfoRequest } from "../models/request/update-class-info-request";
import { DataService } from "./data.service";
import { ClassInfo } from "../models/response/class-info";
import { ApiResponse, SuccessApiResponse } from "@core";
import { forkJoin, map, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClassInfoService {
    #dataService = inject(DataService);
    #classInfos = new Map<number, ClassInfo>();

    getClassInfo(id: number): Observable<ApiResponse<ClassInfo>> {
        const classInfo = this.#classInfos.get(id);
        if (classInfo) {
            return of(new SuccessApiResponse(classInfo));
        }
        return this.#dataService.getClassInfo(id).pipe(
            tap((response) => {
                if (response.result) {
                    this.#classInfos.set(id, response.result);
                }
            })
        );
    }

    getClassInfos(ids: number[]): Observable<ApiResponse<ClassInfo[]>> {
        if (!ids.length) {
            return of(new SuccessApiResponse(new Array<ClassInfo>()));
        }
        return forkJoin(ids.map((id) => this.getClassInfo(id))).pipe(
            map((responses) => {
                const errorResponse = responses.find((response) => !response.result);
                if (errorResponse) {
                    return errorResponse as any as ApiResponse<ClassInfo[]>;
                }
                const classInfos = responses.map((response) => response.result);
                return new SuccessApiResponse(classInfos);
            }));
    }

    searchClassInfos(request: SearchClassInfosRequest) {
        return this.#dataService.searchClassInfos(request);
    }

    createClassInfo(request: CreateClassInfoRequest) {
        return this.#dataService.createClassInfo(request);
    }

    updateClassInfo(id: number, request: UpdateClassInfoRequest) {
        return this.#dataService.updateClassInfo(id, request);
    }

    deleteClassInfo(id: number) {
        return this.#dataService.deleteClassInfo(id);
    }
}
