import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TradeClassUserInfosDisplay } from "src/app/trade-requests/models/trade-class-user-infos-display";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";

@Component({
  standalone: true,
  templateUrl: "./trade-class-user-infos-display.component.html",
  selector: "trade-class-user-infos-display",
  imports: [CommonModule, RouterLink, ButtonModule, ClassInfoComponent],
})
export class TradeClassUserInfosDisplayComponent {
  readonly tradeClassUserInfosDisplay = input<TradeClassUserInfosDisplay>(undefined);
}
