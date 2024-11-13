
import { inject, Injectable } from "@angular/core";
import { ApiResponse, catchApiError, SuccessApiResponse, throwIfApiError } from "@core";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { ClassUserInfo } from "../models/class-user-info";
import { CreateClassUserRequest } from "../models/request/create-class-user-request";
import { SearchClassUsersRequest } from "../models/request/search-class-users-request";
import { UpdateClassUserRequest } from "../models/request/update-class-user-request";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class ClassUserService {
    #dataService = inject(DataService);
    #classInfoService = inject(ClassInfoService);

    getClassUser(id: number) {
        return this.#dataService.getClassUser(id);
    }

    getClassUserInfos(ids: number[]): Observable<ApiResponse<ClassUserInfo[]>> {
        if (!ids.length) {
            return of(new SuccessApiResponse(new Array<ClassUserInfo>()));
        }
        return forkJoin(ids.map((id) => this.getClassUserInfo(id))).pipe(
            map((responses) => {
                const errorResponse = responses.find((response) => !response.result);
                if (errorResponse) {
                    return errorResponse as any as ApiResponse<ClassUserInfo[]>;
                }
                const classUserInfos = responses.map((response) => response.result);
                return new SuccessApiResponse(classUserInfos);
            }));
    }

    getClassUserInfo(id: number) {
        return this.#dataService.getClassUser(id).pipe(
            throwIfApiError(),
            switchMap(response => {
                return this.#classInfoService.getClassInfo(response.result.classId).pipe(
                    throwIfApiError(),
                    map(classInfoResponse => {
                        return new SuccessApiResponse(<ClassUserInfo>{
                            classUser: response.result,
                            classInfo: classInfoResponse.result
                        });
                    })
                );
            }), 
            catchApiError());
    }

    searchClassUsers(request: SearchClassUsersRequest) {
        return this.#dataService.searchClassUsers(request);
    }

    createClassUser(request: CreateClassUserRequest) {
        return this.#dataService.createClassUser(request);
    }

    updateClassUser(id: number, request: UpdateClassUserRequest) {
        return this.#dataService.updateClassUser(id, request);
    }

    getMyClasses() {
        return this.#dataService.getMyClasses().pipe(
            switchMap(response => {
                if (!response.result) {
                    return of(response as any as ApiResponse<ClassUserInfo[]>);
                }
                const classIds = response.result.map(classUser => classUser.id);
                return this.getClassUserInfos(classIds);
            })
        );
    }
    
    removeMeFromClass(classId: number) {
        return this.#dataService.removeMeFromClass(classId);
    }

    addMeToClass(classId: number) {
        return this.#dataService.addMeToClass(classId);
    }

    deleteClassUser(id: number) {
        return this.#dataService.deleteClassUser(id);
    }
}
