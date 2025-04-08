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

route.use("*", authMiddleware);

const taskSchema = zod.object({
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
        const { success, error } = taskSchema.safeParse({ title, description, status });
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

route.get("/", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const userId = c.get("userId") as string;
        const tasks = await prisma.task.findMany({
            where: { userId },
        });

        return c.json({ tasks }, 200);

    } catch (error) {
        return c.json({ error: "Error fetching tasks" }, 500);
    }
});

route.put("/:id", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const id = c.req.param("id");
        const { title, description, status } = await c.req.json();
        const { success, error } = taskSchema.partial().safeParse({ title, description, status });

        if (!success) {
            return c.json({ message: "Invalid data", error: error.format() }, 400);
        };

        const userId = c.get("userId") as string;
        const existingTask = await prisma.task.findUnique({
            where: { id, userId }
        });
        if (!existingTask) {
            return c.json({ error: "Task not found" }, 404);
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, status },
        })

        return c.json({ task: updatedTask }, 200);

    } catch (error) {
        return c.json({ error: "Error updating task" }, 500);
    }
});

route.delete("/:id", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const id = c.req.param("id");
        const userId = c.get("userId") as string;
        const existingTask = await prisma.task.findUnique({
            where: { id, userId }
        });
        if (!existingTask) {
            return c.json({ error: "Task not found" }, 404);
        }

        await prisma.task.delete({
            where: { id },
        });
        return c.json({ message: "Task deleted successfully" }, 200);
        
    } catch (error) {
        return c.json({ error: "Error deleting task" }, 500);
        
    }
})

export { route as taskRoute };