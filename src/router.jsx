import { createRoute, createRouter, redirect } from "@tanstack/react-router";
import { Route as root } from "./routes/__root";
import { Route as home } from "./routes/index";
import { Route as cafes } from "./routes/cafes.index";
import { Route as cafe } from "./routes/cafes.$cafeId";
import { Route as map } from "./routes/map";
import { Route as about } from "./routes/about";
import { Route as passport } from "./routes/passport";

import { Route as privacy } from "./routes/privacy";
import { Route as terms } from "./routes/terms";
import { Route as declaration } from "./routes/data-declaration";

const mapsAlias = createRoute({ getParentRoute: () => root, path: "/maps", beforeLoad: () => { throw redirect({ to: "/map", replace: true }); } });
const userAlias = createRoute({ getParentRoute: () => root, path: "/user", beforeLoad: () => { throw redirect({ to: "/passport", replace: true }); } });
export const router = createRouter({
  routeTree: root.addChildren([home, cafes, cafe, map, passport, about, privacy, terms, declaration, mapsAlias, userAlias]),
  defaultPreload: "intent",
  scrollRestoration: true,
});
