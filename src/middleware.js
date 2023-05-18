// import { NextResponse } from "next/server";
// import { verifyToken } from "../lib/utils";

// export async function middleware(req, ev) {
//   const token = req ? req.cookies.get('token')?.value : null;
//   const userId = await verifyToken(token);
//   const { pathname } = req.nextUrl;

//   if ((token && userId) || pathname.includes("/api/login")) {
//     return NextResponse.next();
//   } else {
//     console.log('middleware not working')
//   }

//   if(!token && pathname !== "/login") {
//     return NextResponse.redirect("/login")
//   } else {
//     console.log('middleware not workingswedrcftgvhg')
//   }
  
// }


import { NextResponse } from "next/server";
import { verifyToken } from "../lib/utils";

export async function middleware(req, ev) {
  const token = req ? req.cookies.get('token')?.value : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;

  if (
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  if ((!token || !userId) && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
}