import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import home from "@/routes/home/home.index";

// User logs and users
import userLogs from "@/routes/user-logs/logs.index";
import users from "@/routes/(users)/users/users.index";
import { OpenAPIHono } from "@hono/zod-openapi";
import tracking from "@/routes/(users)/tracking/tracking.index";
import invites from "@/routes/(users)/invites/invite.index";

const app = createApp();
app.route("/", home);
// Register all routes
const routes = [auth, userLogs, users, tracking, invites];
configureOpenAPI(app as OpenAPIHono);
routes.forEach((route) => {
  app.route("/api", route);
});

export default app;
