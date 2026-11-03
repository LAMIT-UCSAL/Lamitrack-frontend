import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("eventos", "routes/eventos.tsx"),
  route("eventos/:id", "routes/evento.tsx"),
] satisfies RouteConfig;
