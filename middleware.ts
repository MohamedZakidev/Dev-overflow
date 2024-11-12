import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/ask-question(.*)",
  "/profile(.*)",
  "/question(.*)",
  "/collection(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/api/webhook"
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  if (isPublicRoute(req)) {
    // eslint-disable-next-line no-useless-return
    return
  }
});

export const config = {
  matcher: [
    "/question(.*)",
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|api/webhook|api/chatgbt)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
