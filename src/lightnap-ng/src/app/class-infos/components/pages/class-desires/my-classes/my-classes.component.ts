import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent, ErrorListComponent, ToastService } from "@core";
import { RoutePipe } from "@routing";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ClassInfoComponent } from "src/app/class-infos/components/controls/class-info/class-info.component";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./my-classes.component.html",
  imports: [CommonModule, CardModule, ApiResponseComponent, ButtonModule, TableModule, ErrorListComponent, ClassInfoComponent, RouterLink, RoutePipe],
})
export class MyClassesComponent {
  #classInfoService = inject(ClassInfoService);
  classInfos$ = this.#classInfoService.getMyWishlist();
  #toast = inject(ToastService);
  errors = new Array<string>();
  #confirmationService = inject(ConfirmationService);

  #loadClasses() {
    this.classInfos$ = this.#classInfoService.getMyWishlist();
  }

  removeClassForMe(event: any, classId: string) {
    this.errors = [];

    this.#confirmationService.confirm({
      header: "Confirm Role Removal",
      message: `Are you sure that you want to remove this class from your wishlist?`,
      target: event.target,
      key: classId as any,
      accept: () => {
        this.#classInfoService.removeClassFromWishlist(classId).subscribe({
          next: success => {
            this.#toast.success("Class removed successfully.");
            this.#loadClasses();
          },
          error: response => (this.errors = response.errorMessages),
        });
      },
    });
  }
}
