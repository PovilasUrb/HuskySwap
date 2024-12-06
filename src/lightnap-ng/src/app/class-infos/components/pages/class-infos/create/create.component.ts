import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ErrorListComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { CreateClassInfoRequest } from "src/app/class-infos/models/request/create-class-info-request";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./create.component.html",
  imports: [
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    RouterLink,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ErrorListComponent,
  ],
})
export class CreateComponent {
  #classInfoService = inject(ClassInfoService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #fb = inject(FormBuilder);

  errors = new Array<string>();

  form = this.#fb.group({
    // TODO: Update these fields to match the right parameters.
    title: this.#fb.control("string", [Validators.required]),
    description: this.#fb.control("string", [Validators.required]),
    instructor: this.#fb.control("string", [Validators.required]),
    id: this.#fb.control("string", [Validators.required]),
    notes: this.#fb.control("string", [Validators.required]),
  });

  createClicked() {
    this.errors = [];

    const request = <CreateClassInfoRequest>this.form.value;

    this.#classInfoService.createClassInfo(request).subscribe({
      next: classInfo => this.#router.navigate([classInfo.id], { relativeTo: this.#activeRoute.parent }),
      error: response => (this.errors = response.errorMessages),
    });
  }
}
