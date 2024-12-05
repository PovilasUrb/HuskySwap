
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL_ROOT, ApiResponse, PagedResponse } from "@core";
import { tap } from "rxjs";
import {ClassInfoHelper } from "../helpers/class-info.helper";
import { CreateClassInfoRequest } from "../models/request/create-class-info-request";
import { SearchClassInfosRequest } from "../models/request/search-class-infos-request";
import { UpdateClassInfoRequest } from "../models/request/update-class-info-request";
import { ClassInfo } from "../models/response/class-info";
import { ClassDesire } from "../models/response/class-desire";
import { CreateClassDesireRequest } from "../models/request/create-class-desire-request";
import { SearchClassDesiresRequest } from "../models/request/search-class-desires-request";
import { UpdateClassDesireRequest } from "../models/request/update-class-desire-request";
import { ClassUserHelper } from "src/app/class-infos/helpers/class-user.helper";
import { CreateClassUserRequest } from "src/app/class-infos/models/request/create-class-user-request";
import { SearchClassUsersRequest } from "src/app/class-infos/models/request/search-class-users-request";
import { UpdateClassUserRequest } from "src/app/class-infos/models/request/update-class-user-request";
import { ClassUser } from "src/app/class-infos/models/response/class-user";

@Injectable({
  providedIn: "root",
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrlRoot = `${inject(API_URL_ROOT)}`;

  getClassInfo(id: string) {
    return this.#http.get<ApiResponse<ClassInfo>>(`${this.#apiUrlRoot}ClassInfos/${id}`).pipe(
      tap(response => {
        if (response.result) {
          ClassInfoHelper.rehydrate(response.result);
        }
      })
    );
  }

  searchClassInfos(request: SearchClassInfosRequest) {
    return this.#http.post<ApiResponse<PagedResponse<ClassInfo>>>(`${this.#apiUrlRoot}ClassInfos/search`, request).pipe(
      tap(response => {
        if (response.result) {
          response.result.data.forEach(ClassInfoHelper.rehydrate);
        }
      })
    );
  }

  createClassInfo(request: CreateClassInfoRequest) {
    return this.#http.post<ApiResponse<ClassInfo>>(`${this.#apiUrlRoot}ClassInfos/`, request);
  }

  updateClassInfo(id: string, request: UpdateClassInfoRequest) {
    return this.#http.put<ApiResponse<ClassInfo>>(`${this.#apiUrlRoot}ClassInfos/${id}`, request);
  }

  deleteClassInfo(id: string) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}ClassInfos/${id}`);
  }

  getClassDesire(id: number) {
    return this.#http.get<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}ClassDesires/${id}`);
  }

  searchClassDesires(request: SearchClassDesiresRequest) {
    return this.#http.post<ApiResponse<PagedResponse<ClassDesire>>>(`${this.#apiUrlRoot}ClassDesires/search`, request);
  }

  createClassDesire(request: CreateClassDesireRequest) {
    return this.#http.post<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}ClassDesires/`, request);
  }

  updateClassDesire(id: number, request: UpdateClassDesireRequest) {
    return this.#http.put<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}ClassDesires/${id}`, request);
  }

  getMyClassDesires() {
    return this.#http.get<ApiResponse<ClassDesire[]>>(`${this.#apiUrlRoot}ClassDesires/my-classes`);
  }

  addClassToMyWishlist(classId: string) {
    return this.#http.post<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}ClassDesires/my-classes/${classId}`, undefined);
  }

  removeClassFromMyWishlist(classId: string) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}ClassDesires/my-classes/${classId}`);
  }

  deleteClassDesire(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}ClassDesires/${id}`);
  }

  getClassUser(id: number) {
    return this.#http.get<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}ClassUsers/${id}`).pipe(
      tap(response => {
        if (response.result) {
          ClassUserHelper.rehydrate(response.result);
        }
      })
    );
  }

  searchClassUsers(request: SearchClassUsersRequest) {
    return this.#http.post<ApiResponse<PagedResponse<ClassUser>>>(`${this.#apiUrlRoot}ClassUsers/search`, request).pipe(
      tap(response => {
        if (response.result) {
          response.result.data.forEach(ClassUserHelper.rehydrate);
        }
      })
    );
  }

  createClassUser(request: CreateClassUserRequest) {
    return this.#http.post<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}ClassUsers/`, request);
  }

  getMyClasses() {
    return this.#http.get<ApiResponse<ClassUser[]>>(`${this.#apiUrlRoot}ClassUsers/my-classes`);
  }

  addMeToClass(classId: string) {
    return this.#http.post<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}ClassUsers/my-classes/${classId}`, undefined);
  }

  removeMeFromClass(classId: string) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}ClassUsers/my-classes/${classId}`);
  }

  updateClassUser(id: number, request: UpdateClassUserRequest) {
    return this.#http.put<ApiResponse<ClassUser>>(`${this.#apiUrlRoot}ClassUsers/${id}`, request);
  }

  deleteClassUser(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}ClassUsers/${id}`);
  }
}
