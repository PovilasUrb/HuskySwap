
import { inject, Injectable } from "@angular/core";
import { CreateClassUserRequest } from "../models/request/create-class-user-request";
import { SearchClassUsersRequest } from "../models/request/search-class-users-request";
import { UpdateClassUserRequest } from "../models/request/update-class-user-request";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class ClassUserService {
  #dataService = inject(DataService);

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
        return this.#dataService.getMyClasses();
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
