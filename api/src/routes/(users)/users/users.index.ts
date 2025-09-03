import { createRouter } from "@/lib/create-app";
import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter()
  // ====================
  // USER LISTING ROUTES
  // ====================
  .openapi(routes.listUsers, handlers.listUsers)
  .openapi(routes.listAdmins, handlers.listAdmins)
  .openapi(routes.listMembers, handlers.listMembers)

  // ====================
  // INDIVIDUAL USER ROUTES
  // ====================
  .openapi(routes.getUserById, handlers.getUserById)
  .openapi(routes.getUserWithProfile, handlers.getUserWithProfile)

  // ====================
  // USER CREATION ROUTES
  // ====================
  .openapi(routes.createUser, handlers.createUser)

  // ====================
  // USER UPDATE ROUTES
  // ====================
  .openapi(routes.updateUser, handlers.updateUser)
  .openapi(routes.updateUserProfile, handlers.updateUserProfile)

  // ====================
  // USER DELETION
  // ====================
  .openapi(routes.deleteUser, handlers.deleteUser);

// ====================
// BACKWARD COMPATIBILITY
// ====================
// Add routes with old names for backward compatibility
const compatibilityRouter = createRouter()
  // Legacy route names
  .openapi(routes.listAdmins, handlers.listAdmins) // maps to old 'admins'
  .openapi(routes.listMembers, handlers.listMembers) // maps to old 'members'
  .openapi(routes.getUserById, handlers.getUserById) // maps to old 'getUser'
  .openapi(routes.getUserWithProfile, handlers.getUserWithProfile); // maps to old 'userWithProfile'

// Export main router with all optimized routes
export default router;

// Export compatibility router if needed
export { compatibilityRouter };
