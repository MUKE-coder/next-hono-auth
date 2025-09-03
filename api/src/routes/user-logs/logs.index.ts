/* eslint-disable perfectionist/sort-imports */
import { createRouter } from "@/lib/create-app";

import * as handlers from "./logs.handlers";
import * as routes from "./logs.routes";
import { authMiddleware } from "../auth/auth.middleware";

const router = createRouter();

// All user log operations require authentication
router.use("/user-logs/*", authMiddleware);

// Simple endpoints
router.openapi(routes.create, handlers.create);
router.openapi(routes.list, handlers.list);

export default router;
