import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ConfirmPopupComponent, ErrorListComponent, ToastService } from "@core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { Observable, tap } from "rxjs";
import { UpdateClassInfoRequest } from "src/app/class-infos/models/request/update-class-info-request";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./edit.component.html",
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    ApiResponseComponent,
    ConfirmPopupComponent,
    RouterLink,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ErrorListComponent,
  ],
})
export class EditComponent implements OnInit {
  #classInfoService = inject(ClassInfoService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #confirmationService = inject(ConfirmationService);
  #toast = inject(ToastService);
  #fb = inject(FormBuilder);

  errors = new Array<string>();

  form = this.#fb.group({
    // TODO: Update these fields to match the right parameters.
    id: this.#fb.control("", [Validators.required]),
    title: this.#fb.control("string", [Validators.required]),
    description: this.#fb.control("string", [Validators.required]),
    instructor: this.#fb.control("string", [Validators.required]),
    notes: this.#fb.control("string", [Validators.required]),
  });

  readonly id = input<string>(undefined);
  classInfo$ = new Observable<ClassInfo>();

  ngOnInit() {
    this.classInfo$ = this.#classInfoService.getClassInfo(this.id()).pipe(
      tap(classInfo => {
        if (classInfo) {
          this.form.patchValue(classInfo);
        }
      })
    );
  }

  saveClicked() {
    this.errors = [];

    const request = <UpdateClassInfoRequest>this.form.value;

    this.#classInfoService.updateClassInfo(this.id(), request).subscribe({
      next: classInfo => this.#toast.success("Updated successfully"),
      error: response => (this.errors = response.errorMessages),
    });
  }

  deleteClicked(event: any) {
    this.errors = [];

    this.#confirmationService.confirm({
      header: "Confirm Delete Item",
      message: `Are you sure that you want to delete this item?`,
      target: event.target,
      key: "delete",
      accept: () => {
        this.#classInfoService.deleteClassInfo(this.id()).subscribe({
          next: success => {
            this.#toast.success("Deleted successfully");
            this.#router.navigate(["."], { relativeTo: this.#activeRoute.parent });
          },
          error: response => (this.errors = response.errorMessages),
        });
      },
    });
  }
}
