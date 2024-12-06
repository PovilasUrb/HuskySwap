import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ToastService } from "@core";
import { ShowByRolesDirective } from "@identity";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { map, Observable, of, tap } from "rxjs";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { ClassInfoComponent } from "../../../controls/class-info/class-info.component";
import { RoutePipe } from "../../../../../routing/pipes/route.pipe";
import { UserClasses } from "src/app/class-infos/models/user-classes";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule, ShowByRolesDirective, ClassInfoComponent, RoutePipe],
})
export class GetComponent implements OnInit {
  #classInfoService = inject(ClassInfoService);
  #toast = inject(ToastService);
  errors = new Array<string>();

  readonly id = input<string>(undefined);
  classInfo$?: Observable<ClassInfo>;
  classOffers$?: Observable<UserClasses[]>;
  inClass$?: Observable<boolean>;
  wishingClass$?: Observable<boolean>;
  myClassUserId?: number;

  ngOnInit() {
    this.classInfo$ = this.#classInfoService.getClassInfo(this.id());
    this.classOffers$ = this.#classInfoService.getOffersForClass(this.id());
    this.#refreshClassStatus();
  }

  #refreshClassStatus() {
    this.inClass$ = this.#classInfoService.getMyClasses().pipe(
      map(classUserInfos => {
        this.myClassUserId = classUserInfos.find(classUser => classUser.classInfo.id == this.id())?.classUser.id;
        return this.myClassUserId != null;
      })
    );
    this.wishingClass$ = this.#classInfoService.getMyWishlist().pipe(map(classInfos => classInfos.some(classInfo => classInfo.id == this.id())));
  }

  addClassForMe() {
    this.#classInfoService.addMeToClass(this.id()).subscribe({
      next: classUser => {
        this.#toast.success("Class added successfully to My Classes.");
        this.#refreshClassStatus();
      },
      error: response => (this.errors = response.errorMessages),
    });
  }

  removeClassForMe() {
    this.#classInfoService.removeMeFromClass(this.id()).subscribe({
      next: success => {
        this.#toast.success("Class removed successfully from My Classes.");
        this.#refreshClassStatus();
      },
      error: response => (this.errors = response.errorMessages),
    });
  }

  addClassToWishlist() {
    this.#classInfoService.addClassToWishlist(this.id()).subscribe({
      next: classDesire => {
        this.#toast.success("Class added successfully to My Wishlist.");
        this.#refreshClassStatus();
      },
      error: response => (this.errors = response.errorMessages),
    });
  }

  removeClassFromWishlist() {
    this.#classInfoService.removeClassFromWishlist(this.id()).subscribe({
      next: success => {
        this.#toast.success("Class removed successfully from My Wishlist.");
        this.#refreshClassStatus();
      },
      error: response => (this.errors = response.errorMessages),
    });
  }
}
