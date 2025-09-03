import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPI(app: OpenAPIHono) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "UNMN Database Management System API",
      description: "A comprehensive API for managing UNMN organizational operations including user management, regional administration, and member services. This system handles member registration, administrative functions, and organizational data management for the Uganda National Medical Nurses (UNMN) organization.",
    },
    tags: [
      {
        name: "Users",
        description: "User management operations including member and admin creation, authentication, and profile management",
      },
      {
        name: "Authentication",
        description: "Authentication and authorization endpoints for secure access to the system",
      },
      {
        name: "Regions",
        description: "Regional administration and geographic organization management",
      },
      {
        name: "Vote Names",
        description: "Electoral constituency and voting district management",
      },
      {
        name: "Reports",
        description: "Analytics and reporting endpoints for organizational insights",
      },
    ],
  
  });

  app.get("/scalar", apiReference({
    url: "/doc",
    theme: "kepler",
    layout: "modern",
    defaultHttpClient: {
      targetKey: "js",
      clientKey: "fetch",
    },
    metaData: {
      title: "UNMN Database Management API Documentation",
      description: "Interactive API documentation for the Uganda National Medical Nurses (UNMN) Database Management System. Explore endpoints for user management, regional administration, and organizational data operations.",
      favicon: "/favicon.ico",
    },
    
  }));
}