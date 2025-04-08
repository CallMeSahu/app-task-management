import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rootRouter } from './routes/index.js';

const app = new Hono()

app.use("/*", cors());
app.route("/api/v1", rootRouter);

export default app
