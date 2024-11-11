
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
import { CreateClassUserRequest } from "src/app/class-users/models/request/create-class-user-request";
import { ClassUserService } from "src/app/class-users/services/class-user.service";

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
  #classUserService = inject(ClassUserService);
  #router = inject(Router);
  #activeRoute = inject(ActivatedRoute);
  #fb = inject(FormBuilder);

  errors = new Array<string>();

  form = this.#fb.group({
	// TODO: Update these fields to match the right parameters.
	classId: this.#fb.control(0, [Validators.required]),
	isActive: this.#fb.control(false, [Validators.required]),
  });

  createClicked() {
    this.errors = [];

    const request = <CreateClassUserRequest>this.form.value;

    this.#classUserService.createClassUser(request).subscribe(response => {
      if (!response.result) {
        this.errors = response.errorMessages;
        return;
      }

      this.#router.navigate([response.result.id], { relativeTo: this.#activeRoute.parent });
    });
  }
}
