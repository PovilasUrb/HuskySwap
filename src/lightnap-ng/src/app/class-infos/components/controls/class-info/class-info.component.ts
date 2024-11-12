import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { ClassInfo } from "src/app/class-infos/models/response/class-info";

@Component({
  standalone: true,
  templateUrl: "./class-info.component.html",
  selector: "class-info",
  imports: [CommonModule, RouterLink, ButtonModule],
})
export class ClassInfoComponent {
  readonly classInfo = input<ClassInfo>(undefined);
}
