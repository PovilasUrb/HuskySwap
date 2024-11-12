import { inject, Injectable } from "@angular/core";
import { CreateClassDesireRequest } from "../models/request/create-class-desire-request";
import { SearchClassDesiresRequest } from "../models/request/search-class-desires-request";
import { UpdateClassDesireRequest } from "../models/request/update-class-desire-request";
import { DataService } from "./data.service";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { map, Observable, of, switchMap } from "rxjs";
import { ApiResponse, SuccessApiResponse } from "@core";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { UserWishlist } from "../models/user-wishlist";

@Injectable({
  providedIn: "root",
})
export class ClassDesireService {
    #dataService = inject(DataService);
    #classInfoService = inject(ClassInfoService);

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

    getUserWishlist(userId: string): Observable<ApiResponse<UserWishlist>> {
        // Only working with top 50, but that's fine for now
        return this.#dataService.searchClassDesires({ userId, isActive: true }).pipe(
            switchMap(response => {
                if (!response.result) {
                    return of(response as any as ApiResponse<UserWishlist>);
                }
                const classIds = response.result.data.map(classUser => classUser.classId);
                return this.#classInfoService.getClassInfos(classIds).pipe(
                    map(response => {
                        if (!response.result) {
                            return response as any as ApiResponse<UserWishlist>;
                        }
                        return new SuccessApiResponse(<UserWishlist> {userId, classInfos: response.result});
                    }
                ));
            })
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
