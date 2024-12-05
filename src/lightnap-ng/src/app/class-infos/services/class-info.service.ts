import { inject, Injectable } from "@angular/core";
import { CreateClassInfoRequest } from "../models/request/create-class-info-request";
import { SearchClassInfosRequest } from "../models/request/search-class-infos-request";
import { UpdateClassInfoRequest } from "../models/request/update-class-info-request";
import { DataService } from "./data.service";
import { ClassInfo } from "../models/response/class-info";
import { ApiResponse, catchApiError, SuccessApiResponse, throwIfApiError } from "@core";
import { forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { SearchClassDesiresRequest } from "../models/request/search-class-desires-request";
import { CreateClassDesireRequest } from "../models/request/create-class-desire-request";
import { UserClasses } from "../models/user-classes";
import { UpdateClassDesireRequest } from "../models/request/update-class-desire-request";
import { ClassUserInfo } from "src/app/class-infos/models/class-user-info";
import { CreateClassUserRequest } from "src/app/class-infos/models/request/create-class-user-request";
import { SearchClassUsersRequest } from "src/app/class-infos/models/request/search-class-users-request";
import { UpdateClassUserRequest } from "src/app/class-infos/models/request/update-class-user-request";

@Injectable({
  providedIn: "root",
})
export class ClassInfoService {
  #dataService = inject(DataService);
  #classInfos = new Map<string, ClassInfo>();

  getClassInfo(id: string): Observable<ApiResponse<ClassInfo>> {
    const classInfo = this.#classInfos.get(id);
    if (classInfo) {
      return of(new SuccessApiResponse(classInfo));
    }
    return this.#dataService.getClassInfo(id).pipe(
      tap(response => {
        if (response.result) {
          this.#classInfos.set(id, response.result);
        }
      })
    );
  }

  getClassInfos(ids: string[]): Observable<ApiResponse<ClassInfo[]>> {
    if (!ids.length) {
      return of(new SuccessApiResponse(new Array<ClassInfo>()));
    }
    return forkJoin(ids.map(id => this.getClassInfo(id))).pipe(
      map(responses => {
        const errorResponse = responses.find(response => !response.result);
        if (errorResponse) {
          return errorResponse as any as ApiResponse<ClassInfo[]>;
        }
        const classInfos = responses.map(response => response.result);
        return new SuccessApiResponse(classInfos);
      })
    );
  }

  searchClassInfos(request: SearchClassInfosRequest) {
    return this.#dataService.searchClassInfos(request);
  }

  createClassInfo(request: CreateClassInfoRequest) {
    return this.#dataService.createClassInfo(request);
  }

  updateClassInfo(id: string, request: UpdateClassInfoRequest) {
    return this.#dataService.updateClassInfo(id, request);
  }

  deleteClassInfo(id: string) {
    return this.#dataService.deleteClassInfo(id);
  }

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
    return this.#dataService.getMyClassDesires().pipe(
      switchMap(response => {
        if (!response.result) {
          return of(response as any as ApiResponse<ClassInfo[]>);
        }
        const classIds = response.result.map(classUser => classUser.classInfoId);
        return this.getClassInfos(classIds);
      })
    );
  }

  getOffersForClass(classId: string): Observable<ApiResponse<UserClasses[]>> {
    return this.searchClassDesires({ classInfoId: classId, isActive: true }).pipe(
      switchMap(response => {
        if (!response.result) {
          return of(response as any as ApiResponse<UserClasses[]>);
        }
        const userIds = response.result.data.map(classDesire => classDesire.userId);
        if (!userIds.length) {
          return of(new SuccessApiResponse<UserClasses[]>([]));
        }
        return forkJoin(userIds.map(userId => this.getUserClasses(userId))).pipe(
          map(responses => {
            const errorResponse = responses.find(response => !response.result);
            if (errorResponse) {
              return errorResponse as any as ApiResponse<UserClasses[]>;
            }
            return new SuccessApiResponse<UserClasses[]>(responses.map(response => response.result));
          })
        );
      })
    );
  }

  getUserClasses(userId: string): Observable<ApiResponse<UserClasses>> {
    // Only working with top 50, but that's fine for now
    return this.#dataService.searchClassUsers({ userId, isActive: true }).pipe(
      throwIfApiError(),
      switchMap(response => {
        const classUserIds = response.result.data.map(classUser => classUser.id);
        // search for all class users with this class
        return this.getClassUserInfos(classUserIds).pipe(
          throwIfApiError(),
          map(response => {
            return new SuccessApiResponse(<UserClasses>{ userId, classUserInfos: response.result });
          })
        );
      }),
      catchApiError()
    );
  }

  removeClassFromWishlist(classId: string) {
    return this.#dataService.removeClassFromMyWishlist(classId);
  }

  addClassToWishlist(classId: string) {
    return this.#dataService.addClassToMyWishlist(classId);
  }

  updateClassDesire(id: number, request: UpdateClassDesireRequest) {
    return this.#dataService.updateClassDesire(id, request);
  }

  deleteClassDesire(id: number) {
    return this.#dataService.deleteClassDesire(id);
  }

  getClassUser(id: number) {
    return this.#dataService.getClassUser(id);
  }

  getClassUserInfos(ids: number[]): Observable<ApiResponse<ClassUserInfo[]>> {
    if (!ids.length) {
      return of(new SuccessApiResponse(new Array<ClassUserInfo>()));
    }
    return forkJoin(ids.map(id => this.getClassUserInfo(id))).pipe(
      map(responses => {
        const errorResponse = responses.find(response => !response.result);
        if (errorResponse) {
          return errorResponse as any as ApiResponse<ClassUserInfo[]>;
        }
        const classUserInfos = responses.map(response => response.result);
        return new SuccessApiResponse(classUserInfos);
      })
    );
  }

  getClassUserInfo(id: number) {
    return this.#dataService.getClassUser(id).pipe(
      throwIfApiError(),
      switchMap(response => {
        return this.getClassInfo(response.result.classInfoId).pipe(
          throwIfApiError(),
          map(classInfoResponse => {
            return new SuccessApiResponse(<ClassUserInfo>{
              classUser: response.result,
              classInfo: classInfoResponse.result,
            });
          })
        );
      }),
      catchApiError()
    );
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
          return of(response as any as ApiResponse<ClassUserInfo[]>);
        }
        const classUserIds = response.result.map(classUser => classUser.id);
        return this.getClassUserInfos(classUserIds);
      })
    );
  }

  removeMeFromClass(classId: string) {
    return this.#dataService.removeMeFromClass(classId);
  }

  addMeToClass(classId: string) {
    return this.#dataService.addMeToClass(classId);
  }

  deleteClassUser(id: number) {
    return this.#dataService.deleteClassUser(id);
  }
}
