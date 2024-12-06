import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ConfirmPopupComponent, ErrorListComponent, ToastService } from "@core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable, tap } from "rxjs";
import { UpdateClassDesireRequest } from "src/app/class-infos/models/request/update-class-desire-request";
import { ClassDesire } from "src/app/class-infos/models/response/class-desire";
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
  classDesire$ = new Observable<ClassDesire>();

  ngOnInit() {
    this.classDesire$ = this.#classInfoService.getClassDesire(this.id).pipe(
      tap(classDesire => {
        if (classDesire) {
          this.form.setValue({ json: JSON.stringify(classDesire, undefined, 4) });
        }
      })
    );
  }

  saveClicked() {
    this.errors = [];

    let request: UpdateClassDesireRequest;
    try {
      request = <UpdateClassDesireRequest>JSON.parse(this.form.value.json);
    } catch (e) {
      this.errors = ["The JSON is invalid."];
      return;
    }

    this.#classInfoService
      .updateClassDesire(this.id, request)
      .subscribe({ next: classDesire => this.#toast.success("Updated successfully"), error: response => (this.errors = response.errorMessages) });
  }

  deleteClicked(event: any) {
    this.errors = [];

    this.#confirmationService.confirm({
      header: "Confirm Delete Item",
      message: `Are you sure that you want to delete this item?`,
      target: event.target,
      key: "delete",
      accept: () => {
        this.#classInfoService.deleteClassDesire(this.id).subscribe({
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
