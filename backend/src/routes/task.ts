import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => c.text("Task route"));

export { route as taskRoute };