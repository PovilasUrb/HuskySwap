
import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ToastService } from "@core";
import { ShowByRolesDirective } from "@identity";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { map, Observable, of, tap } from "rxjs";
import { UserWishlist } from "src/app/class-desires/models/user-wishlist";
import { ClassDesireService } from "src/app/class-desires/services/class-desire.service";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { ClassUserService } from "src/app/class-users/services/class-user.service";
import { ClassInfoComponent } from "../../controls/class-info/class-info.component";
import { RoutePipe } from "../../../../routing/pipes/route.pipe";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule, ShowByRolesDirective, ClassInfoComponent, RoutePipe],
})
export class GetComponent implements OnInit {
  #classInfoService = inject(ClassInfoService);
  #classUserService = inject(ClassUserService);
  #classDesireService = inject(ClassDesireService);
  #toast = inject(ToastService);
  errors = new Array<string>();

  readonly id = input<number>(undefined);
  classInfo$?: Observable<ApiResponse<ClassInfo>>;
  userWishlists$?: Observable<ApiResponse<UserWishlist[]>>;
  inClass$?: Observable<boolean>;
  wishingClass$?: Observable<boolean>;
  myClassUserId?: number;

  ngOnInit() {
    this.classInfo$ = this.#classInfoService.getClassInfo(this.id());
    this.userWishlists$ = this.#classDesireService.getUsersInClasses(this.id());
    this.#refreshClassStatus();
  }

  #refreshClassStatus() {
    this.inClass$ = this.#classUserService.getMyClasses().pipe(
      map(response => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return false;
        }
        this.myClassUserId = response.result.find(classUser => classUser.classInfo.id == this.id())?.classUser.id;
        return this.myClassUserId != null;
      })
    );
    this.wishingClass$ = this.#classDesireService.getMyWishlist().pipe(
      map(response => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return false;
        }
        return response.result.some(classInfo => classInfo.id == this.id());
      })
    );
  }

  addClassForMe() {
    this.#classUserService.addMeToClass(this.id()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return;
        }
        this.#toast.success("Class added successfully to My Classes.");
        this.#refreshClassStatus();
      },
    });
  }

  removeClassForMe() {
    this.#classUserService.removeMeFromClass(this.id()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return;
        }
        this.#toast.success("Class removed successfully from My Classes.");
        this.#refreshClassStatus();
      },
    });
  }

  addClassToWishlist() {
    this.#classDesireService.addClassToWishlist(this.id()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return;
        }
        this.#toast.success("Class added successfully to My Wishlist.");
        this.#refreshClassStatus();
      },
    });
  }

  removeClassFromWishlist() {
    this.#classDesireService.removeClassFromWishlist(this.id()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return;
        }
        this.#toast.success("Class removed successfully from My Wishlist.");
        this.#refreshClassStatus();
      },
    });
  }
}
