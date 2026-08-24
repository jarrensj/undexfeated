import { NextResponse, type NextRequest } from "next/server";

// Site-wide password gate. If WEBSITE_PASSWORD is unset, the gate is open.
export function proxy(request: NextRequest) {
  const password = process.env.WEBSITE_PASSWORD;
  if (!password) return NextResponse.next();
  if (request.cookies.get("website_password")?.value === password) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === "/gate") return NextResponse.next();
  return NextResponse.redirect(new URL("/gate", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
