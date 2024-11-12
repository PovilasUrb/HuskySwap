import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ApiResponseComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ClassDesireService } from "src/app/class-desires/services/class-desire.service";

@Component({
  standalone: true,
  templateUrl: "./index.component.html",
  imports: [CommonModule, CardModule, ApiResponseComponent, RouterModule, ButtonModule],
})
export class IndexComponent {
  #classDesireService = inject(ClassDesireService);
  classDesires$ = this.#classDesireService.searchClassDesires({ pageNumber: 1, pageSize: 10 });
}
