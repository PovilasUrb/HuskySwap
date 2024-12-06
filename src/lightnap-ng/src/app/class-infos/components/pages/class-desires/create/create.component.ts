import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ErrorListComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CreateClassDesireRequest } from "src/app/class-infos/models/request/create-class-desire-request";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./create.component.html",
  imports: [CommonModule, CardModule, ReactiveFormsModule, RouterLink, ButtonModule, InputTextareaModule, ErrorListComponent],
})
export class CreateComponent {
  #classInfoService = inject(ClassInfoService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #fb = inject(FormBuilder);

  errors = new Array<string>();

  form = this.#fb.group({
    json: this.#fb.control(
      JSON.stringify(
        <CreateClassDesireRequest>{
          // TODO: Initialize this with some default values for testing.
        },
        undefined,
        4
      ),
      [Validators.required]
    ),
  });

  createClicked() {
    this.errors = [];

    let request: CreateClassDesireRequest;
    try {
      request = <CreateClassDesireRequest>JSON.parse(this.form.value.json);
    } catch (e) {
      this.errors = ["The JSON is invalid."];
      return;
    }

    this.#classInfoService.createClassDesire(request).subscribe({
      next: classDesire => this.#router.navigate([classDesire.id], { relativeTo: this.#activeRoute.parent }),
      error: response => (this.errors = response.errorMessages),
    });
  }
}
