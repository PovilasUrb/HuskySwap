
import { AppRoute } from "@routing";

// TODO: Add this route list to app/routing/routes.ts.
//
// At the top of the file, import the routes:
//
// import { Routes as TradeRequestRoutes } from "../trade-requests/components/pages/routes";
//
// Then add the routes to the list:
//
// { path: "trade-requests", children: TradeRequestRoutes }
//
export const Routes: AppRoute[] = [
  { path: "", loadComponent: () => import("./index/index.component").then(m => m.IndexComponent) },
  { path: "create", loadComponent: () => import("./create/create.component").then(m => m.CreateComponent) },
  { path: "incoming-swaps", data: {alias: "incoming-swaps"}, loadComponent: () => import("./incoming-swaps/incoming-swaps.component").then(m => m.IncomingSwapsComponent) },
  { path: "outgoing-swaps", data: {alias: "outgoing-swaps"}, loadComponent: () => import("./outgoing-swaps/outgoing-swaps.component").then(m => m.OutgoingSwapsComponent) },
  { path: "completed-swaps", data: {alias: "completed-swaps"}, loadComponent: () => import("./completed-swaps/completed-swaps.component").then(m => m.CompletedSwapsComponent) },
  { path: "offer-swap/:requestingClassUserId/:targetClassUserId", data: {alias: 'offer-swap'}, loadComponent: () => import("./offer-swap/offer-swap.component").then(m => m.OfferSwapComponent) },
  { path: ":id/respond", data: {alias: "respond"}, loadComponent: () => import("./view-incoming-swap/view-incoming-swap.component").then(m => m.RespondComponent) },
  { path: ":id/view-sent", data: {alias: "view-sent"}, loadComponent: () => import("./view-outgoing-swap/view-outgoing-swap.component").then(m => m.ViewOutgoingSwapComponent) },
  { path: ":id", loadComponent: () => import("./get/get.component").then(m => m.GetComponent) },
  { path: ":id/edit", loadComponent: () => import("./edit/edit.component").then(m => m.EditComponent) },
];
