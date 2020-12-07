import { lazy } from "react";

export function generateRoute(routesConfig) {
  return routesConfig.map((item) => {
    const { page, path, title } = item;
    let component = APP_ENV === "local" ? require(`../pages/${page}/index`).default : lazy(() => import(`../pages/${page}/index`));

    return {
      path: path,
      component,
      title,
      exact: true,
    };
  });
}
