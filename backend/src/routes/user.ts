import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { signinSchema, signupSchema } from "@callmesahu/app-task-management-common";

const route = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

route.get("/", (c) => c.text("User route"));

route.post("/signup", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const { email, password, name } = await c.req.json();
        const { success, error } = signupSchema.safeParse({ email, password, name });
        if (!success) {
            return c.json({ message: "Invalid data", error: error.format() }, 400);
        }
        
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if(existingUser) {
            return c.json({ message: "Invalid data", error: "User already exists" }, 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await prisma.user.create({
            data: { email, password: hashedPassword, name}
        });
        const token = await sign({ id: createdUser.id }, c.env.JWT_SECRET);

        return c.json({ token }, 201); 

    } catch (error) {
        return c.json({ error: "Error creating user" }, 500);
    }
});

route.post("/signin", async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const { email, password } = await c.req.json();
        const { success, error } = signinSchema.safeParse({ email, password });
        if (!success) {
            return c.json({ message: "Invalid data", error: error.format() }, 400);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        const verifyPassword = await bcrypt.compare(password, existingUser?.password || "");
        if(!existingUser || !verifyPassword){
            c.status(401);
            return c.json({ error: "Invalid credentials" });
        };
        const token = await sign({ id: existingUser.id }, c.env.JWT_SECRET);

        return c.json({ token }, 200);

    } catch (error) {
        return c.json({ error: "Error signing in" }, 500);
    }
});

export { route as userRoute };