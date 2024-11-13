import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TradeClassUserInfos } from "src/app/trade-requests/models/trade-class-user-infos";
import { ClassInfoComponent } from "../../../../class-infos/components/controls/class-info/class-info.component";

@Component({
  standalone: true,
  templateUrl: "./trade-class-user-infos.component.html",
  selector: "trade-class-user-infos",
  imports: [CommonModule, RouterLink, ButtonModule, ClassInfoComponent],
})
export class TradeClassUserInfosComponent {
  readonly tradeClassUserInfos = input<TradeClassUserInfos>(undefined);
}
