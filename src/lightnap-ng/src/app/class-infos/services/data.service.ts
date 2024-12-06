
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
    return this.#http.get<ClassInfo>(`${this.#apiUrlRoot}ClassInfos/${id}`).pipe(
      tap(classInfo => {
        if (classInfo) {
          ClassInfoHelper.rehydrate(classInfo);
        }
      })
    );
  }

  searchClassInfos(request: SearchClassInfosRequest) {
    return this.#http.post<PagedResponse<ClassInfo>>(`${this.#apiUrlRoot}ClassInfos/search`, request).pipe(
      tap(results => {
        if (results) {
          results.data.forEach(ClassInfoHelper.rehydrate);
        }
      })
    );
  }

  createClassInfo(request: CreateClassInfoRequest) {
    return this.#http.post<ClassInfo>(`${this.#apiUrlRoot}ClassInfos/`, request);
  }

  updateClassInfo(id: string, request: UpdateClassInfoRequest) {
    return this.#http.put<ClassInfo>(`${this.#apiUrlRoot}ClassInfos/${id}`, request);
  }

  deleteClassInfo(id: string) {
    return this.#http.delete<boolean>(`${this.#apiUrlRoot}ClassInfos/${id}`);
  }

  getClassDesire(id: number) {
    return this.#http.get<ClassDesire>(`${this.#apiUrlRoot}ClassDesires/${id}`);
  }

  searchClassDesires(request: SearchClassDesiresRequest) {
    return this.#http.post<PagedResponse<ClassDesire>>(`${this.#apiUrlRoot}ClassDesires/search`, request);
  }

  createClassDesire(request: CreateClassDesireRequest) {
    return this.#http.post<ClassDesire>(`${this.#apiUrlRoot}ClassDesires/`, request);
  }

  updateClassDesire(id: number, request: UpdateClassDesireRequest) {
    return this.#http.put<ClassDesire>(`${this.#apiUrlRoot}ClassDesires/${id}`, request);
  }

  getMyClassDesires() {
    return this.#http.get<ClassDesire[]>(`${this.#apiUrlRoot}ClassDesires/my-classes`);
  }

  addClassToMyWishlist(classId: string) {
    return this.#http.post<ClassDesire>(`${this.#apiUrlRoot}ClassDesires/my-classes/${classId}`, undefined);
  }

  removeClassFromMyWishlist(classId: string) {
    return this.#http.delete<boolean>(`${this.#apiUrlRoot}ClassDesires/my-classes/${classId}`);
  }

  deleteClassDesire(id: number) {
    return this.#http.delete<boolean>(`${this.#apiUrlRoot}ClassDesires/${id}`);
  }

  getClassUser(id: number) {
    return this.#http.get<ClassUser>(`${this.#apiUrlRoot}ClassUsers/${id}`).pipe(
      tap(classUser => {
        if (classUser) {
          ClassUserHelper.rehydrate(classUser);
        }
      })
    );
  }

  searchClassUsers(request: SearchClassUsersRequest) {
    return this.#http.post<PagedResponse<ClassUser>>(`${this.#apiUrlRoot}ClassUsers/search`, request).pipe(
      tap(results => {
        if (results) {
          results.data.forEach(ClassUserHelper.rehydrate);
        }
      })
    );
  }

  createClassUser(request: CreateClassUserRequest) {
    return this.#http.post<ClassUser>(`${this.#apiUrlRoot}ClassUsers/`, request);
  }

  getMyClasses() {
    return this.#http.get<ClassUser[]>(`${this.#apiUrlRoot}ClassUsers/my-classes`);
  }

  addMeToClass(classId: string) {
    return this.#http.post<ClassUser>(`${this.#apiUrlRoot}ClassUsers/my-classes/${classId}`, undefined);
  }

  removeMeFromClass(classId: string) {
    return this.#http.delete<boolean>(`${this.#apiUrlRoot}ClassUsers/my-classes/${classId}`);
  }

  updateClassUser(id: number, request: UpdateClassUserRequest) {
    return this.#http.put<ClassUser>(`${this.#apiUrlRoot}ClassUsers/${id}`, request);
  }

  deleteClassUser(id: number) {
    return this.#http.delete<boolean>(`${this.#apiUrlRoot}ClassUsers/${id}`);
  }
}
