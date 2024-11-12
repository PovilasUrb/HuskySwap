import { inject, Injectable } from "@angular/core";
import { CreateClassDesireRequest } from "../models/request/create-class-desire-request";
import { SearchClassDesiresRequest } from "../models/request/search-class-desires-request";
import { UpdateClassDesireRequest } from "../models/request/update-class-desire-request";
import { DataService } from "./data.service";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { map, of, switchMap } from "rxjs";
import { ApiResponse } from "@core";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";

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
