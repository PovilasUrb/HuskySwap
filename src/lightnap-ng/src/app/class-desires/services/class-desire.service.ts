import { inject, Injectable } from "@angular/core";
import { CreateClassDesireRequest } from "../models/request/create-class-desire-request";
import { SearchClassDesiresRequest } from "../models/request/search-class-desires-request";
import { UpdateClassDesireRequest } from "../models/request/update-class-desire-request";
import { DataService } from "./data.service";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { ApiResponse, catchApiError, SuccessApiResponse, throwIfApiError } from "@core";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { UserWishlist } from "../models/user-wishlist";
import { ClassUserService } from "src/app/class-users/services/class-user.service";

@Injectable({
  providedIn: "root",
})
export class ClassDesireService {
    #dataService = inject(DataService);
    #classInfoService = inject(ClassInfoService);
    #classUserService = inject(ClassUserService);

    getClassDesire(id: number) {
        return this.#dataService.getClassDesire(id);
    }

    searchClassDesires(request: SearchClassDesiresRequest) {
        return this.#dataService.searchClassDesires(request);
    }

    createClassDesire(request: CreateClassDesireRequest) {
        return this.#dataService.createClassDesire(request);
    }

    getMyWishlist() {
        return this.#dataService.getMyClasses().pipe(
            switchMap(response => {
                if (!response.result) {
                    return of(response as any as ApiResponse<ClassInfo[]>);
                }
                const classIds = response.result.map(classUser => classUser.classId);
                return this.#classInfoService.getClassInfos(classIds);
            })
        );
    }

    getUsersInClasses(classId: number): Observable<ApiResponse<UserWishlist[]>> {
        return this.#classUserService.searchClassUsers({ classId, isActive: true }).pipe(
            switchMap(response => {
                if (!response.result) {
                    return of(response as any as ApiResponse<UserWishlist[]>);
                }
                const userIds = response.result.data.map(classUser => classUser.userId);
                if (!userIds.length) {
                    return of(new SuccessApiResponse<UserWishlist[]>([]));
                }
                return forkJoin(userIds.map(userId => this.getUserWishlist(userId))).pipe(
                    map(responses => {
                        const errorResponse = responses.find((response) => !response.result);
                        if (errorResponse) {
                            return errorResponse as any as ApiResponse<UserWishlist[]>;
                        }
                        return new SuccessApiResponse<UserWishlist[]>(responses.map(response => response.result)                       );
                    }
                    )
                );
            })
        );
    }

    getUserWishlist(userId: string): Observable<ApiResponse<UserWishlist>> {
        // Only working with top 50, but that's fine for now
        return this.#dataService.searchClassDesires({ userId, isActive: true }).pipe(
            throwIfApiError(),
            switchMap(response => {
                const classIds = response.result.data.map(classUser => classUser.classId);
                return this.#classUserService.getClassUserInfos(classIds).pipe(
                    throwIfApiError(),
                    map(response => {
                        return new SuccessApiResponse(<UserWishlist> {userId, classUserInfos: response.result});
                    }
                ));
            }),
            catchApiError()
        );
    }
    
    removeClassFromWishlist(classId: number) {
        return this.#dataService.removeMeFromClass(classId);
    }

    addClassToWishlist(classId: number) {
        return this.#dataService.addMeToClass(classId);
    }

    updateClassDesire(id: number, request: UpdateClassDesireRequest) {
        return this.#dataService.updateClassDesire(id, request);
    }

    deleteClassDesire(id: number) {
        return this.#dataService.deleteClassDesire(id);
    }
}
