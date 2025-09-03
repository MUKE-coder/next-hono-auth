import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

// src/routes/home/home.index.ts
import { createRouter } from "@/lib/create-app";

const router = createRouter()
  .openapi(
    createRoute({
      tags: ["Home"],
      method: "get",
      path: "/",
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          z.object({
            message: z.string(),
            description: z.string(),
            features: z.array(z.string()),
            developmentTime: z.string(),
            gettingStarted: z.array(z.string()),
            deployment: z.object({
              vercel: z.object({
                steps: z.array(z.string()),
                note: z.string(),
              }),
              cloudflare: z.object({
                steps: z.array(z.string()),
                note: z.string(),
              }),
              railway: z.object({
                steps: z.array(z.string()),
                note: z.string(),
              }),
            }),
            documentation: z.string(),
            routes: z.object({
              products: z.string(),
              users: z.string(),
              apiKeys: z.string(),
              auth: z.string(),
            }),
          }),
          "API Starter Kit Home",
        ),
      },
    }),
    (c) => {
      return c.json(
        {
          message: "Welcome to the Product API Starter Kit",
          description:
            "A robust, production-ready API starter built with Hono, Prisma, and OpenAPI specifications.",
          features: [
            "⚡ Blazing fast Hono.js server",
            "🔐 Built-in authentication system",
            "🗝️ API key management",
            "🛒 Complete products API",
            "👥 User role management",
            "📝 OpenAPI documentation with Scalar",
            "📊 PostgreSQL database with Prisma ORM",
            "🌱 Database seeding",
            "📜 Request logging with Pino",
            "🚀 Ready for deployment on Vercel, Cloudflare, and Railway",
          ],
          developmentTime:
            "This starter kit represents approximately 40-60 hours of development time, including research, implementation, testing, and documentation.",
          gettingStarted: [
            "1. Clone the repository",
            "2. Run `npm install`",
            "3. Set up your .env file (copy .env.example)",
            "4. Run `npx prisma migrate dev` to set up database",
            "5. Run `npm run dev` to start the server",
          ],
          deployment: {
            vercel: {
              steps: [
                "1. Install Vercel CLI: `npm install -g vercel`",
                "2. Run `vercel` and follow prompts",
                "3. Set environment variables in Vercel dashboard",
                "4. Configure database connection",
                "5. Deploy!",
              ],
              note: "Ensure your database is properly configured for production.",
            },
            cloudflare: {
              steps: [
                "1. Install Wrangler: `npm install -g wrangler`",
                "2. Authenticate: `wrangler login`",
                "3. Configure wrangler.toml",
                "4. Set environment variables",
                "5. Deploy with `wrangler publish`",
              ],
              note: "Works great with Cloudflare Workers and Pages.",
            },
            railway: {
              steps: [
                "1. Install Railway CLI: `npm install -g @railway/cli`",
                "2. Run `railway login`",
                "3. Create new project: `railway init`",
                "4. Link your database",
                "5. Deploy with `railway up`",
              ],
              note: "Railway provides seamless PostgreSQL integration.",
            },
          },
          documentation: "Visit /docs for interactive API documentation",
          routes: {
            products: "/products",
            users: "/users",
            apiKeys: "/api-keys",
            auth: "/auth",
          },
        },
        HttpStatusCodes.OK,
      );
    },
  );

export default router;
