import { RedirectToSignIn } from "@clerk/nextjs";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);

const isProtectedRoute = createRouteMatcher(["/select-org"]);

export default clerkMiddleware((auth, req) => {
  if (auth().userId && isPublicRoute(req)) {
    let path = "/select-org";

    if (auth().userId) {
      let path = `/organization/${auth().orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!auth().userId && !isPublicRoute(req)) {
    return RedirectToSignIn({ path: req.url });
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
