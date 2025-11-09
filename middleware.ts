import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse as res } from "next/server";

export const middleware = async (req: NextRequest) => {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/login") && session)
    return res.redirect(new URL("/user/orders", req.url));

  if (pathname.startsWith("/signup") && session)
    return res.redirect(new URL("/user/orders", req.url));

  if (pathname.startsWith("/user") && !session) {
    return res.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && !session) {
    return res.redirect(new URL("/login", req.url));
  }

  return res.next();
};
