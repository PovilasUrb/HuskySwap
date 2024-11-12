
import { inject, Injectable } from "@angular/core";
import { CreateClassUserRequest } from "../models/request/create-class-user-request";
import { SearchClassUsersRequest } from "../models/request/search-class-users-request";
import { UpdateClassUserRequest } from "../models/request/update-class-user-request";
import { DataService } from "./data.service";
import { forkJoin, map, Observable, of, switchMap } from "rxjs";
import { ApiResponse, SuccessApiResponse } from "@core";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { ClassDesireService } from "src/app/class-desires/services/class-desire.service";
import { UserWishlist } from "../../class-desires/models/user-wishlist";

@Injectable({
  providedIn: "root",
})
export class ClassUserService {
    #dataService = inject(DataService);
    #classInfoService = inject(ClassInfoService);
    #classDesireService = inject(ClassDesireService);

    getClassUser(id: number) {
        return this.#dataService.getClassUser(id);
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
                    return of(response as any as ApiResponse<ClassInfo[]>);
                }
                const classIds = response.result.map(classUser => classUser.classId);
                return this.#classInfoService.getClassInfos(classIds);
            })
        );
    }

    getUsersInClasses(classId: number): Observable<ApiResponse<UserWishlist[]>> {
        return this.#dataService.searchClassUsers({ classId }).pipe(
            switchMap(response => {
                if (!response.result) {
                    return of(response as any as ApiResponse<UserWishlist[]>);
                }
                const userIds = response.result.data.map(classUser => classUser.userId);
                if (!userIds.length) {
                    return of(new SuccessApiResponse<UserWishlist[]>([]));
                }
                return forkJoin(userIds.map(userId => this.#classDesireService.getUserWishlist(userId))).pipe(
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
