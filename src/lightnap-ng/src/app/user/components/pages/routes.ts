import { AppRoute } from "@routing";

export const Routes: AppRoute[] = [
  { path: "", data: { alias: "user-home" }, loadComponent: () => import("./index/index.component").then(m => m.IndexComponent) },
  { path: "my-trades", data: { alias: "my-trades" }, loadComponent: () => import("./my-trades/my-trades.component").then(m => m.IndexComponent) },
  { path: "my-offers", data: { alias: "my-offers" }, loadComponent: () => import("./my-offers/my-offers.component").then(m => m.IndexComponent) },
  { path: "other-offers", data: { alias: "other-offers" }, loadComponent: () => import("./other-offers/other-offers.component").then(m => m.IndexComponent) },
];
