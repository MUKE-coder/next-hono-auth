import { createRouter } from "@/lib/create-app";
import * as handlers from "./invite.handlers";
import * as routes from "./invite.routes";

const router = createRouter()
  .openapi(routes.getInviteInfo, handlers.getInvite)
  .openapi(routes.invite, handlers.createInvite);

export default router;
