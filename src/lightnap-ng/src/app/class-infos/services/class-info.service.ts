import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { ClassUserInfo } from "src/app/class-infos/models/class-user-info";
import { CreateClassUserRequest } from "src/app/class-infos/models/request/create-class-user-request";
import { SearchClassUsersRequest } from "src/app/class-infos/models/request/search-class-users-request";
import { UpdateClassUserRequest } from "src/app/class-infos/models/request/update-class-user-request";
import { CreateClassDesireRequest } from "../models/request/create-class-desire-request";
import { CreateClassInfoRequest } from "../models/request/create-class-info-request";
import { SearchClassDesiresRequest } from "../models/request/search-class-desires-request";
import { SearchClassInfosRequest } from "../models/request/search-class-infos-request";
import { UpdateClassDesireRequest } from "../models/request/update-class-desire-request";
import { UpdateClassInfoRequest } from "../models/request/update-class-info-request";
import { ClassInfo } from "../models/response/class-info";
import { UserClasses } from "../models/user-classes";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class ClassInfoService {
  #dataService = inject(DataService);
  #classInfos = new Map<string, ClassInfo>();

  getClassInfo(id: string): Observable<ClassInfo> {
    const classInfo = this.#classInfos.get(id);
    if (classInfo) {
      return of(classInfo);
    }
    return this.#dataService.getClassInfo(id).pipe(
      tap(classInfo => {
        if (classInfo) {
          this.#classInfos.set(id, classInfo);
        }
      })
    );
  }

  getClassInfos(ids: string[]): Observable<ClassInfo[]> {
    if (!ids.length) {
      return of([]);
    }
    return forkJoin(ids.map(id => this.getClassInfo(id)));
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
      switchMap(classDesires => {
        const classIds = classDesires.map(classUser => classUser.classInfoId);
        return this.getClassInfos(classIds);
      })
    );
  }

  getOffersForClass(classId: string): Observable<UserClasses[]> {
    return this.searchClassDesires({ classInfoId: classId, isActive: true }).pipe(
      switchMap(results => {
        const userIds = results.data.map(classDesire => classDesire.userId);
        if (!userIds.length) {
          return of([]);
        }
        return forkJoin(userIds.map(userId => this.getUserClasses(userId)));
      })
    );
  }

  getUserClasses(userId: string): Observable<UserClasses> {
    // Only working with top 50, but that's fine for now
    return this.#dataService.searchClassUsers({ userId, isActive: true }).pipe(
      switchMap(results => {
        const classUserIds = results.data.map(classUser => classUser.id);
        // search for all class users with this class
        return this.getClassUserInfos(classUserIds).pipe(
          map(classUserInfos => {
            return <UserClasses>{ userId, classUserInfos: classUserInfos };
          })
        );
      })
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

  getClassUserInfos(ids: number[]): Observable<ClassUserInfo[]> {
    if (!ids.length) {
      return of([]);
    }
    return forkJoin(ids.map(id => this.getClassUserInfo(id)));
  }

  getClassUserInfo(id: number) {
    return this.#dataService.getClassUser(id).pipe(
      switchMap(classUser => {
        return this.getClassInfo(classUser.classInfoId).pipe(
          map(classInfo => {
            return <ClassUserInfo>{
              classUser,
              classInfo,
            };
          })
        );
      })
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
      switchMap(classUsers => {
        const classUserIds = classUsers.map(classUser => classUser.id);
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
