import { AppRoute } from "@routing";

// TODO: Add this route list to app/routing/routes.ts.
//
// At the top of the file, import the routes:
//
// import { Routes as ClassDesireRoutes } from "../class-desires/components/pages/routes";
//
// Then add the routes to the list:
//
// { path: "class-desires", children: ClassDesireRoutes }
//
export const Routes: AppRoute[] = [
  { path: "create", loadComponent: () => import("./create/create.component").then(m => m.CreateComponent) },
  { path: "my-classes", data: {alias: "wishlist"}, loadComponent: () => import("./my-classes/my-classes.component").then(m => m.MyClassesComponent)},
  { path: ":id", loadComponent: () => import("./get/get.component").then(m => m.GetComponent) },
  { path: ":id/edit", loadComponent: () => import("./edit/edit.component").then(m => m.EditComponent) },
];
