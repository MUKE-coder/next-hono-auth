import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { parseEnv } from "@/env";
import { logger } from "@/middlewares/pino-logger";

import type { AppBindings } from "./types";
import { cors } from "hono/cors";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook
  });
}
export default function createApp() {
  const app = createRouter();
  app.use((c, next) => {
    // eslint-disable-next-line node/no-process-env
    c.env = parseEnv(Object.assign(c.env || {}, process.env));
    return next();
  });
  app.use(
    "/api/*",
    cors({
      origin: "*"
    })
  );
  app.use(logger());
  app.use(serveEmojiFavicon("🅿️"));

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
