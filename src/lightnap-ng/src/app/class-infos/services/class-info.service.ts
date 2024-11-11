
import { inject, Injectable } from "@angular/core";
import { CreateClassInfoRequest } from "../models/request/create-class-info-request";
import { SearchClassInfosRequest } from "../models/request/search-class-infos-request";
import { UpdateClassInfoRequest } from "../models/request/update-class-info-request";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class ClassInfoService {
  #dataService = inject(DataService);

    getClassInfo(id: number) {
        return this.#dataService.getClassInfo(id);
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
