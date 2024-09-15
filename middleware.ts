import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { headers } from "./app/api/util/header-utils";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  beforeAuth: (req: NextRequest, evt: NextFetchEvent) => {
    if (req.nextUrl.pathname.startsWith("/api")) {
      console.log("API middleware");
      return NextResponse.next({
        headers
      });
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
