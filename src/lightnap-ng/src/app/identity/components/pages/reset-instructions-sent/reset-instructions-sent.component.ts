import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FocusContentLayout } from "@layout/components/layouts/focus-content-layout/focus-content-layout.component";
import { RoutePipe } from "@routing";

@Component({
  standalone: true,
  templateUrl: "./reset-instructions-sent.component.html",
  imports: [RouterModule, RoutePipe, FocusContentLayout],
})
export class ResetInstructionsSentComponent {}
