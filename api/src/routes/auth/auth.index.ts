import { createRouter } from "@/lib/create-app";

import * as handlers from "./auth.handlers";
import { authMiddleware } from "./auth.middleware";
import * as routes from "./auth.routes";

const router = createRouter()
  .openapi(routes.login, handlers.login)
  .openapi(routes.refreshToken, handlers.refreshToken)
  .openapi(routes.logout, handlers.logout)
  .openapi(routes.forgotPassword, handlers.forgotPassword)
  .openapi(routes.resetPassword, handlers.resetPassword);
// .openapi(routes.verifyToken, authMiddleware, handlers.verifyToken); // Protected route
router.use("/auth/verify", authMiddleware);
router.openapi(routes.verifyToken, handlers.verifyToken);
export default router;
