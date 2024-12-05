import { ExtraOptions } from "@angular/router";
import { adminGuard } from "@core/guards/admin.guard";
import { authGuard } from "@core/guards/auth.guard";
import { Routes as AdminRoutes } from "../admin/components/pages/routes";
import { Routes as IdentityRoutes } from "../identity/components/pages/routes";
import { AppLayoutComponent } from "../layout/components/layouts/app-layout/app-layout.component";
import { Routes as ProfileRoutes } from "../profile/components/pages/routes";
import { Routes as PublicRoutes } from "../public/components/pages/routes";
import { Routes as UserRoutes } from "../user/components/pages/routes";
import { Routes as ClassInfoRoutes } from "../class-infos/components/pages/class-infos/routes";
import { Routes as TradeRequestRoutes } from "../trade-requests/components/pages/routes";
import { Routes as ClassUserRoutes } from "../class-infos/components/pages/class-users/routes";
import { Routes as ClassDesireRoutes } from "../class-infos/components/pages/class-desires/routes";
import { AppRoute } from "./models/app-route";

export const Routes: AppRoute[] = [
  { path: "", children: PublicRoutes },
  {
    path: "",
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "home", data: { breadcrumb: "Home" }, children: UserRoutes },
      { path: "profile", data: { breadcrumb: "Profile" }, children: ProfileRoutes },
      { path: "class-infos", data: { breadcrumb: "Classes" }, children: ClassInfoRoutes },      
      { path: "trade-requests", children: TradeRequestRoutes },
      { path: "class-users", children: ClassUserRoutes },
      { path: "class-desires", children: ClassDesireRoutes }
    ],
  },
  {
    path: "admin",
    component: AppLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [{ path: "", data: { breadcrumb: "Admin" }, children: AdminRoutes }],
  },
  { path: "identity", data: { breadcrumb: "Identity" }, children: IdentityRoutes },
  { path: "**", redirectTo: "/not-found" },
];

export const RouteConfig: ExtraOptions = {
  bindToComponentInputs: true,
  scrollPositionRestoration: "enabled",
  anchorScrolling: "enabled",
  onSameUrlNavigation: "reload",
};
