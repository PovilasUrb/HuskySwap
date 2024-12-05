import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { BlockUiService, ErrorListComponent, ToastService } from "@core";
import { ApiResponseComponent } from "@core/components/controls/api-response/api-response.component";
import { ProfileService } from "@profile/services/profile.service";
import { RouteAliasService } from "@routing";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { PasswordModule } from "primeng/password";
import { tap } from "rxjs";
import { IdentityService } from "src/app/identity/services/identity.service";
import { confirmPasswordValidator } from "@core/helpers/form-helpers";

@Component({
  standalone: true,
  templateUrl: "./index.component.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ApiResponseComponent,
    ErrorListComponent,
    PasswordModule,
  ],
})
export class IndexComponent {
  #identityService = inject(IdentityService);
  #profileService = inject(ProfileService);
  #routeAlias = inject(RouteAliasService);
  #blockUi = inject(BlockUiService);
  #toast = inject(ToastService);
  #fb = inject(FormBuilder);

  profileForm = this.#fb.group({});
  profileErrors = new Array<string>();
  profile$ = this.#profileService.getProfile().pipe(
    tap(response => {
      if (!response.result) return;
    })
  );

  changePasswordForm = this.#fb.nonNullable.group(
    {
      currentPassword: this.#fb.control("", [Validators.required]),
      newPassword: this.#fb.control("", [Validators.required]),
      confirmNewPassword: this.#fb.control("", [Validators.required]),
    },
    { validators: [confirmPasswordValidator("newPassword", "confirmNewPassword")] }
  );
  changePasswordErrors = new Array<string>();

  updateProfile() {
    this.#blockUi.show({ message: "Updating profile..." });
    this.#profileService.updateProfile({}).subscribe({
      next: response => {
        if (!response.result) {
          this.profileErrors = response.errorMessages;
          return;
        }
        this.#toast.success("Profile updated successfully.");
      },
      complete: () => this.#blockUi.hide(),
    });
  }

  logOut() {
    this.#blockUi.show({ message: "Logging out..." });
    this.#identityService.logOut().subscribe({
      next: response => {
        if (!response.result) {
          this.profileErrors = response.errorMessages;
          return;
        }
        this.#routeAlias.navigate("landing");
      },
      complete: () => this.#blockUi.hide(),
    });
  }

  changePassword() {
    this.#blockUi.show({ message: "Changing password..." });
    this.#profileService.changePassword({
      confirmNewPassword: this.changePasswordForm.value.confirmNewPassword,
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    }).subscribe({
      next: response => {
        if (!response.result) {
          this.changePasswordErrors = response.errorMessages;
          return;
        }
        this.#toast.success("Password changed successfully.");
        this.changePasswordForm.reset();
      },
      complete: () => this.#blockUi.hide(),
    });
  }
}
