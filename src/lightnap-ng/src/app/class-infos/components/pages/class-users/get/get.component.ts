import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponseComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable } from "rxjs";
import { ClassUser } from "src/app/class-infos/models/response/class-user";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ButtonModule],
})
export class GetComponent implements OnInit {
  #classInfoService = inject(ClassInfoService);
  errors = new Array<string>();

  readonly id = input<number>(undefined);
  classUser$?: Observable<ClassUser>;

  ngOnInit() {
    this.classUser$ = this.#classInfoService.getClassUser(this.id());
  }
}
