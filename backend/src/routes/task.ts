import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import zod from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

route.get("/", (c) => c.text("Task route"));

route.use("*", authMiddleware);

const createTaskSchema = zod.object({
    title: zod.string().min(1, "Title is required"),
    description: zod.string().optional(),
    status: zod.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});

route.post("/", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const { title, description, status } = await c.req.json();
        const { success, error } = createTaskSchema.safeParse({ title, description, status });
        if (!success) {
            return c.json({ message: "Invalid data", error: error.format() }, 400);
        }

        const userId = c.get("userId") as string;
        const createdTask = await prisma.task.create({
            data: { title, description, status, userId },
        });

        return c.json({ task: createdTask }, 201);
    } catch (error) {
        return c.json({ error: "Error creating task" }, 500);
    }
});

export { route as taskRoute };