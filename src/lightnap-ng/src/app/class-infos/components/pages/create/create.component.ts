import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CreateClassInfoRequest } from "src/app/class-infos/models/request/create-class-info-request";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";
import { ErrorListComponent } from "@core";

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
      JSON.stringify(<CreateClassInfoRequest>{
        // TODO: Initialize this with some default values for testing.
      }, undefined, 4),
      [Validators.required]
    ),
  });

  createClicked() {
    this.errors = [];

    let request: CreateClassInfoRequest;
    try {
      request = <CreateClassInfoRequest>JSON.parse(this.form.value.json);
    } catch (e) {
      this.errors = ["The JSON is invalid."];
      return;
    }

    this.#classInfoService.createClassInfo(request).subscribe(response => {
      if (!response.result) {
        this.errors = response.errorMessages;
        return;
      }

      this.#router.navigate([response.result.id], { relativeTo: this.#activeRoute.parent });
    });
  }
}
