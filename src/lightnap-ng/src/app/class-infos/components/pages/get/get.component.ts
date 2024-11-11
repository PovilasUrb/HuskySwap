import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ConfirmPopupComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable } from "rxjs";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ConfirmPopupComponent, ButtonModule],
})
export class GetComponent implements OnInit {
  #classInfoService = inject(ClassInfoService);
  errors = new Array<string>();

  @Input() id: number;
  classInfo$ = new Observable<ApiResponse<ClassInfo>>();

  ngOnInit() {
    this.classInfo$ = this.#classInfoService.getClassInfo(this.id);
  }
}
