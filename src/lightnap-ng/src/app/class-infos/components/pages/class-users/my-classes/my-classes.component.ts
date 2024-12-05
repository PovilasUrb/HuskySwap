
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent, ConfirmPopupComponent, ErrorListComponent, ToastService } from "@core";
import { RoutePipe } from "@routing";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { ClassInfoComponent } from "../../../controls/class-info/class-info.component";

@Component({
  standalone: true,
  templateUrl: "./my-classes.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule, TableModule, RoutePipe, ErrorListComponent, ConfirmPopupComponent, ClassInfoComponent],
})
export class MyClassesComponent {
  #classInfoService = inject(ClassInfoService);
  classInfos$ = this.#classInfoService.getMyClasses();
  #toast = inject(ToastService);
  errors = new Array<string>();
  #confirmationService = inject(ConfirmationService);

  #loadClasses() {
    this.classInfos$ = this.#classInfoService.getMyClasses();
  }

  removeClassForMe(event: any, classId: string) {
    this.errors = [];

    this.#confirmationService.confirm({
        header: "Confirm Role Removal",
      message: `Are you sure that you want to remove this class?`,
      target: event.target,
      key: classId as any,
      accept: () => {
        this.#classInfoService.removeMeFromClass(classId).subscribe({
          next: (response) => {
            if (!response.result) {
              this.errors = response.errorMessages;
              return;
            }
            this.#toast.success("Class removed successfully.");
            this.#loadClasses();
          },
        });
      },
    });
    
  }
}
