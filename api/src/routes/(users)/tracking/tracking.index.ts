import { createRouter } from "@/lib/create-app";
import * as handlers from "./tracking.handlers";
import * as routes from "./tracking.routes";

const router = createRouter().openapi(routes.getTrackingInfo, handlers.getInfo);

export default router;
