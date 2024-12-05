import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ApiResponseComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ClassInfoService } from "src/app/class-infos/services/class-info.service";

@Component({
  standalone: true,
  templateUrl: "./index.component.html",
  imports: [CommonModule, CardModule, ApiResponseComponent, RouterModule, ButtonModule],
})
export class IndexComponent {
  #classInfoService = inject(ClassInfoService);
  classDesires$ = this.#classInfoService.searchClassDesires({ pageNumber: 1, pageSize: 10 });
}
