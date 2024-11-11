
import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable } from "rxjs";
import { ClassUser } from "src/app/class-users/models/response/class-user";
import { ClassUserService } from "src/app/class-users/services/class-user.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule],
})
export class GetComponent implements OnInit {
  #classUserService = inject(ClassUserService);
  errors = new Array<string>();

  readonly id = input<number>(undefined);
  classUser$?: Observable<ApiResponse<ClassUser>>;

  ngOnInit() {
    this.classUser$ = this.#classUserService.getClassUser(this.id());
  }
}
