import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { API_URL_ROOT } from "@core";
import { apiResponseInterceptor } from "@core/interceptors/api-response-interceptor";
import { tokenInterceptor } from "@core/interceptors/token-interceptor";
import { RouteConfig, Routes } from "@routing/routes";
import { ConfirmationService, MessageService } from "primeng/api";
import { BlockUIModule } from "primeng/blockui";
import { ToastModule } from "primeng/toast";
import { environment } from "src/environments/environment";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(Routes, RouteConfig),
    BrowserModule, ToastModule, BlockUIModule],
  providers: [
    provideAnimations(),
    { provide: API_URL_ROOT, useValue: environment.apiUrlRoot },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(withInterceptors([tokenInterceptor, apiResponseInterceptor])),
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
