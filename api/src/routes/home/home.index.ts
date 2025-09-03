/* eslint-disable style/comma-dangle */
/* eslint-disable style/indent */
/* eslint-disable style/arrow-parens */
import type { Context } from "hono";

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

// src/routes/home/home.index.ts
import { createRouter } from "@/lib/create-app";

const router = createRouter();

// Helper function to escape HTML
function escapeHtml(str: string) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        "''": "&quot;"
      }[tag] || tag)
  );
}

// Data
const features = [
  {
    icon: "👥",
    title: "Member Management",
    text: "Complete member lifecycle with profile system"
  },
  {
    icon: "🔐",
    title: "Authentication",
    text: "Role-based access control with JWT"
  },
  {
    icon: "📊",
    title: "Activity Tracking",
    text: "Comprehensive logging & monitoring"
  },
  {
    icon: "🏛️",
    title: "Organization",
    text: "Regional structure management"
  }
];

const keyEndpoints = [
  {
    method: "POST",
    path: "/auth/login",
    description: "Member authentication",
    color: "bg-red-100 text-red-800"
  },
  {
    method: "GET",
    path: "/users",
    description: "List all members",
    color: "bg-green-100 text-green-800"
  },
  {
    method: "GET",
    path: "/profiles/{userId}",
    description: "Get member profile",
    color: "bg-green-100 text-green-800"
  },
  {
    method: "POST",
    path: "/user-logs",
    description: "Create activity log",
    color: "bg-blue-100 text-blue-800"
  }
];

const gettingStarted = [
  "Clone the repository and install dependencies",
  "Configure your environment variables",
  "Set up PostgreSQL database and run migrations",
  "Seed the database with sample data",
  "Start the development server",
  "Explore API documentation at /scalar"
];

// HTML Route
router.get("/", (c: Context) => {
  // Generate feature cards
  const featuresHtml = features
    .map(
      (feature) => `
    <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div class="flex items-start">
        <div class="bg-red-50 p-3 rounded-full mr-4">
          <span class="text-2xl text-red-600">${escapeHtml(feature.icon)}</span>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-1">${escapeHtml(
            feature.title
          )}</h3>
          <p class="text-gray-600">${escapeHtml(feature.text)}</p>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Generate endpoint cards
  const endpointsHtml = keyEndpoints
    .map(
      (endpoint) => `
    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div class="flex items-center mb-2">
        <span class="inline-block px-3 py-1 text-xs font-mono rounded-full ${
          endpoint.color
        }">
          ${escapeHtml(endpoint.method)}
        </span>
      </div>
      <code class="block font-mono text-sm text-gray-800 mb-2">${escapeHtml(
        endpoint.path
      )}</code>
      <p class="text-sm text-gray-600">${escapeHtml(endpoint.description)}</p>
    </div>
  `
    )
    .join("");

  // Generate getting started list
  const gettingStartedHtml = gettingStarted
    .map(
      (step) => `
    <li class="flex items-start mb-3">
      <span class="bg-red-100 text-red-600 rounded-full p-1 mr-3 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </span>
      <span class="text-gray-700">${escapeHtml(step)}</span>
    </li>
  `
    )
    .join("");

  const htmlContent = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Membership Management API</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                  }
                }
              }
            }
          }
        </script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
          }
          .gradient-bg {
            background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
          }
        </style>
      </head>
      <body class="gradient-bg">
        <div class="max-w-6xl mx-auto px-4 py-12">
          <!-- Header -->
          <header class="mb-16 text-center">
            <div class="inline-flex items-center justify-center bg-primary-100 px-6 py-3 rounded-full mb-6">
              <span class="text-primary-800 font-medium">UNMU Database Management System</span>
            </div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Membership Management <span class="text-primary-600">API</span></h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">Secure, scalable solution for member registration and organizational management</p>
            <div class="mt-8 flex justify-center space-x-4">
              <a href="/scalar" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                API Documentation
              </a>
              <a href="/auth/login" class="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors border border-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                Member Login
              </a>
            </div>
          </header>

          <!-- Features Section -->
          <section class="mb-16">
            <h2 class="text-2xl font-semibold text-gray-900 mb-8 text-center">Core Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              ${featuresHtml}
            </div>
          </section>

          <!-- Key Endpoints -->
          <section class="mb-16">
            <div class="flex flex-col md:flex-row items-start md:items-end justify-between mb-8">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-2">Key API Endpoints</h2>
                <p class="text-gray-600">Essential endpoints to get started with the API</p>
              </div>
              <a href="/scalar" class="text-primary-600 hover:text-primary-700 font-medium flex items-center mt-4 md:mt-0">
                View all endpoints
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              ${endpointsHtml}
            </div>
          </section>

          <!-- Getting Started -->
          <section class="mb-16 bg-white rounded-xl shadow-sm p-8">
            <div class="flex flex-col md:flex-row">
              <div class="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
                <p class="text-gray-600 mb-6">Follow these steps to set up and start using the API in your development environment.</p>
                <ul class="mt-4">
                  ${gettingStartedHtml}
                </ul>
              </div>
              <div class="md:w-1/2 bg-primary-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-primary-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
                  </svg>
                  Sample Credentials
                </h3>
                <div class="space-y-4">
                  <div class="bg-white p-4 rounded-lg shadow-xs border border-gray-100">
                    <h4 class="font-medium text-gray-800 mb-1">Admin User</h4>
                    <p class="text-sm text-gray-600">Email: admin@organization.com</p>
                    <p class="text-sm text-gray-600">Password: Admin@2025</p>
                  </div>
                  <div class="bg-white p-4 rounded-lg shadow-xs border border-gray-100">
                    <h4 class="font-medium text-gray-800 mb-1">Member User</h4>
                    <p class="text-sm text-gray-600">Email: john.doe@member.com</p>
                    <p class="text-sm text-gray-600">Password: Member@2025</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Call to Action -->
          <section class="bg-primary-600 rounded-xl p-8 text-center">
            <h2 class="text-2xl font-semibold text-white mb-4">Ready to get started?</h2>
            <p class="text-primary-100 mb-6 max-w-2xl mx-auto">Explore the full API documentation to learn about all available endpoints and features.</p>
            <a href="/scalar" class="inline-flex items-center bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              View API Documentation
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </section>

          <footer class="mt-16 text-center text-gray-500 text-sm">
            <p>🏛️ Membership Management System - Built with Hono.js, Prisma & PostgreSQL</p>
            <p class="mt-2">Version 1.0.0</p>
          </footer>
        </div>
      </body>
    </html>`;

  return c.html(htmlContent);
});

// Separate the OpenAPI handler to ensure proper typing
function openApiHandler(c: Context) {
  const accept = c.req.header("Accept");

  if (accept?.includes("text/html")) {
    // Return a proper redirect response
    return c.redirect("/", HttpStatusCodes.MOVED_TEMPORARILY);
  }

  // Explicitly return the JSON response
  return c.json({
    message: "Welcome to the Membership Management System API",
    version: "1.0.0",
    features: [
      "Multi-role member management",
      "Extended member profiles",
      "Regional organization structure",
      "Activity logging and monitoring",
      "Member categorization system",
      "Secure JWT authentication"
    ],
    documentation: "/scalar",
    html: "Visit this route in a browser for a complete system overview"
  });
}

// Keep the OpenAPI route for API clients
router.openapi(
  createRoute({
    tags: ["Home"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.object({
          message: z.string(),
          version: z.string(),
          features: z.array(z.string()),
          documentation: z.string(),
          html: z
            .string()
            .optional()
            .describe("Visit this route in a browser for HTML response")
        }),
        "Membership Management System API Home"
      ),
      [HttpStatusCodes.MOVED_TEMPORARILY]: {
        description:
          "Redirects to HTML version when Accept header includes text/html",
        headers: z.object({
          Location: z.string().url()
        })
      }
    }
  }),
  openApiHandler
);

export default router;
