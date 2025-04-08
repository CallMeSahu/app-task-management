import { Hono } from "hono";
import { userRoute } from "./user";
import { taskRoute } from "./task";

const rootRouter = new Hono();

rootRouter.route("/user", userRoute);
rootRouter.route("/task", taskRoute);

export { rootRouter };