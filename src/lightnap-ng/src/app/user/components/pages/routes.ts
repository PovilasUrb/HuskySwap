import { AppRoute } from "@routing";

export const Routes: AppRoute[] = [
  { path: "", data: { alias: "user-home" }, loadComponent: () => import("./index/index.component").then(m => m.IndexComponent) },
  { path: "create-swap", data: { alias: "create-swap" }, loadComponent: () => import("./create-swap/create-swap.component").then(m => m.CreateSwapComponent) },
  { path: "my-swaps", data: { alias: "my-swaps" }, loadComponent: () => import("./my-swaps/my-swap.component").then(m => m.MySwapsComponent) },
  { path: "browse-swaps", data: { alias: "browse-swaps" }, loadComponent: () => import("./browse-swaps/browse-swaps.component").then(m => m.BrowseSwapsComponent) },
];
