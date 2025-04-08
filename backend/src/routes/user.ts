import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const route = new Hono<{
    Bindings: {
        DATABASE_URL: string;
    }
}>();

route.get("/", (c) => c.text("User route"));

route.post("/signup", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    } catch (error) {
        return c.json({ error: "Error creating user" }, 500);
    }
});

route.post("/signin", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    } catch (error) {
        return c.json({ error: "Error signing in" }, 500);
    }
})

export { route as userRoute };