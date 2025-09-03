import { createRouter } from "@/lib/create-app";

import * as handlers from "./stats.handlers";
import * as routes from "./stats.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.briefItems, handlers.briefItems);

export default router;
