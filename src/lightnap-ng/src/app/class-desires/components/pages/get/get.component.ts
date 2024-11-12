import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiResponse, ApiResponseComponent, ConfirmPopupComponent } from "@core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { Observable } from "rxjs";
import { ClassDesire } from "src/app/class-desires/models/response/class-desire";
import { ClassDesireService } from "src/app/class-desires/services/class-desire.service";

@Component({
  standalone: true,
  templateUrl: "./get.component.html",
  imports: [CommonModule, CardModule, RouterLink, ApiResponseComponent, ConfirmPopupComponent, ButtonModule],
})
export class GetComponent implements OnInit {
  #classDesireService = inject(ClassDesireService);
  errors = new Array<string>();

  @Input() id: number;
  classDesire$ = new Observable<ApiResponse<ClassDesire>>();

  ngOnInit() {
    this.classDesire$ = this.#classDesireService.getClassDesire(this.id);
  }
}
