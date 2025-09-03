import { Environment } from "@/env";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export interface ContextUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MEMBER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  isVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppBindings {
  Bindings: Environment;
  Variables: {
    logger: PinoLogger;
    currentUser?: ContextUser;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
