
import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ToastService } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { map, Observable, of, tap } from "rxjs";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { ClassUserService } from "src/app/class-users/services/class-user.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule],
})
export class GetComponent implements OnInit {
  #classInfoService = inject(ClassInfoService);
  #classUserService = inject(ClassUserService);
  #toast = inject(ToastService);
  errors = new Array<string>();

  readonly id = input<number>(undefined);
  classInfo$?: Observable<ApiResponse<ClassInfo>>;
  inClass$?: Observable<boolean>;

  ngOnInit() {
    this.classInfo$ = this.#classInfoService.getClassInfo(this.id());
    this.#refreshClassStatus();
  }

  #refreshClassStatus() {
    this.inClass$ = this.#classUserService.getMyClasses().pipe(
      map(response => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return false;
        }
        return response.result.some(classUser => classUser.classId == this.id());
      })
    )
  }

  addClassForMe() {
    this.#classUserService.addMeToClass(this.id()).subscribe({
      next: (response) => {
        if (!response.result) {
          this.errors = response.errorMessages;
          return;
        }
        this.#toast.success("Class added successfully.");
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
        this.#toast.success("Class removed successfully.");
        this.#refreshClassStatus();
      },
    });
  }
}
