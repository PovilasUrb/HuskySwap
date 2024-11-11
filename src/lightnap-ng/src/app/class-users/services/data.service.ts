
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL_ROOT, ApiResponse, PagedResponse } from "@core";
import { tap } from "rxjs";
import {ClassUserHelper } from "../helpers/class-user.helper";
import { CreateClassUserRequest } from "../models/request/create-class-user-request";
import { SearchClassUsersRequest } from "../models/request/search-class-users-request";
import { UpdateClassUserRequest } from "../models/request/update-class-user-request";
import { ClassUser } from "../models/response/class-user";

@Injectable({
  providedIn: "root",
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrlRoot = `${inject(API_URL_ROOT)}ClassUsers/`;

  getClassUser(id: number) {
    return this.#http.get<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}${id}`).pipe(
      tap(response => {
        if (response.result) {
          ClassUserHelper.rehydrate(response.result);
        }
      })
    );
  }

  searchClassUsers(request: SearchClassUsersRequest) {
    return this.#http.post<ApiResponse<PagedResponse<ClassUser>>>(`${this.#apiUrlRoot}search`, request).pipe(
      tap(response => {
        if (response.result) {
          response.result.data.forEach(ClassUserHelper.rehydrate);
        }
      })
    );
  }

  createClassUser(request: CreateClassUserRequest) {
    return this.#http.post<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}`, request);
  }

  getMyClasses() {
    return this.#http.get<ApiResponse<ClassUser[]>>(`${this.#apiUrlRoot}my-classes`);
  }

  addMeToClass(classId: number) {
    return this.#http.post<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}my-classes/${classId}`, undefined);
  }

  removeMeFromClass(classId: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}my-classes/${classId}`);
  }

  updateClassUser(id: number, request: UpdateClassUserRequest) {
    return this.#http.put<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}${id}`, request);
  }

  deleteClassUser(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}${id}`);
  }
}
