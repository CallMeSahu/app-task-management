import { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const authMiddleware: MiddlewareHandler<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string,
    };
    Variables: {
        userId: string
    };
}> = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.split(" ")[1];

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const payload = await verify(token, c.env.JWT_SECRET) as { id: string };
        const user = await prisma.user.findUnique({
            where: { id: payload.id }
        });

        if (!user) {
            return c.json({ error: "Unauthorized - User not found" }, 401);
        }
        c.set("userId", payload.id);
        
        await next();
    } catch (error) {
        return c.json({ error: "Invalid or expired token" }, 403);
    }
};