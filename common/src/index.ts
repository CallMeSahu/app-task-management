import zod from "zod";

export const signupSchema = zod.object({
    email: zod.string().email("Invalid email format"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    name: zod.string().optional(),  
});
export type SignupSchema = zod.infer<typeof signupSchema>;

export const signinSchema = zod.object({
    email: zod.string().email("Invalid email format"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
});
export type SigninSchema = zod.infer<typeof signinSchema>;

export const taskSchema = zod.object({
    title: zod.string().min(1, "Title is required"),
    description: zod.string().optional(),
    status: zod.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});
export type TaskSchema = zod.infer<typeof taskSchema>;