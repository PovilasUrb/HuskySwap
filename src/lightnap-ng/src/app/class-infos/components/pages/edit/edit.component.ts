import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ConfirmPopupComponent, ErrorListComponent, ToastService } from "@core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable, tap } from "rxjs";
import { UpdateClassInfoRequest } from "src/app/class-infos/models/request/update-class-info-request";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./edit.component.html",
  imports: [CommonModule, CardModule, ReactiveFormsModule, RouterLink, ApiResponseComponent, ConfirmPopupComponent, ButtonModule, ErrorListComponent],
})
export class EditComponent implements OnInit {
  #classInfoService = inject(ClassInfoService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #confirmationService = inject(ConfirmationService);
  #toast = inject(ToastService);
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    json: this.#fb.control("", [Validators.required]),
  });

  errors = new Array<string>();

  @Input() id: number;
  classInfo$ = new Observable<ApiResponse<ClassInfo>>();

  ngOnInit() {
    this.classInfo$ = this.#classInfoService.getClassInfo(this.id).pipe(
      tap(response => {
        if (response.result) {
          this.form.setValue({ json: JSON.stringify(response.result, undefined, 4) });
        }
      })
    );
  }

  saveClicked() {
    this.errors = [];

    let request: UpdateClassInfoRequest;
    try {
      request = <UpdateClassInfoRequest>JSON.parse(this.form.value.json);
    } catch (e) {
      this.errors = ["The JSON is invalid."];
      return;
    }

    this.#classInfoService.updateClassInfo(this.id, request).subscribe(response => {
      if (!response.result) {
        this.errors = response.errorMessages;
        return;
      }

      this.#toast.success("Updated successfully");
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
        this.#classInfoService.deleteClassInfo(this.id).subscribe(response => {
          if (!response.result) {
            this.errors = response.errorMessages;
            return;
          }

          this.#toast.success("Deleted successfully");
          this.#router.navigate(["."], { relativeTo: this.#activeRoute.parent });
        });
      },
    });
  }
}