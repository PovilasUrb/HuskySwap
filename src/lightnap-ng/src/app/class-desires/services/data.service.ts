import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { API_URL_ROOT, ApiResponse, PagedResponse } from "@core";
import { CreateClassDesireRequest } from "../models/request/create-class-desire-request";
import { SearchClassDesiresRequest } from "../models/request/search-class-desires-request";
import { UpdateClassDesireRequest } from "../models/request/update-class-desire-request";
import { ClassDesire } from "../models/response/class-desire";

@Injectable({
  providedIn: "root",
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrlRoot = `${inject(API_URL_ROOT)}ClassDesires/`;

  getClassDesire(id: number) {
    return this.#http.get<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}${id}`);
  }

  searchClassDesires(request: SearchClassDesiresRequest) {
    return this.#http.post<ApiResponse<PagedResponse<ClassDesire>>>(`${this.#apiUrlRoot}search`, request);
  }

  createClassDesire(request: CreateClassDesireRequest) {
    return this.#http.post<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}`, request);
  }

  updateClassDesire(id: number, request: UpdateClassDesireRequest) {
    return this.#http.put<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}${id}`, request);
  }

  getMyClasses() {
    return this.#http.get<ApiResponse<ClassDesire[]>>(`${this.#apiUrlRoot}my-classes`);
  }

  addMeToClass(classId: number) {
    return this.#http.post<ApiResponse<ClassDesire>>(`${this.#apiUrlRoot}my-classes/${classId}`, undefined);
  }

  removeMeFromClass(classId: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}my-classes/${classId}`);
  }

  deleteClassDesire(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrlRoot}${id}`);
  }
}
