import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent, ErrorListComponent, ToastService } from "@core";
import { RoutePipe } from "@routing";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { ConfirmPopupComponent } from "../../../../core/components/controls/confirm-popup/confirm-popup.component";
import { ConfirmationService } from "primeng/api";
import { ClassDesireService } from "src/app/class-desires/services/class-desire.service";
import { ClassInfoComponent } from "src/app/class-infos/components/controls/class-info/class-info.component"

@Component({
  standalone: true,
  templateUrl: "./my-classes.component.html",
  imports: [
    CommonModule,
    CardModule,
    RouterLink,
    ApiResponseComponent,
    ButtonModule,
    TableModule,
    RoutePipe,
    ErrorListComponent,
    ConfirmPopupComponent,
    ClassInfoComponent
  ],
})
export class MyClassesComponent {
  #classDesireService = inject(ClassDesireService);
  classInfos$ = this.#classDesireService.getMyWishlist();
  #toast = inject(ToastService);
  errors = new Array<string>();
  #confirmationService = inject(ConfirmationService);

  #loadClasses() {
    this.classInfos$ = this.#classDesireService.getMyWishlist();
  }

  removeClassForMe(event: any, classId: number) {
    this.errors = [];

    this.#confirmationService.confirm({
      header: "Confirm Role Removal",
      message: `Are you sure that you want to remove this class from your wishlist?`,
      target: event.target,
      key: classId as any,
      accept: () => {
        this.#classDesireService.removeClassFromWishlist(classId).subscribe({
          next: response => {
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
