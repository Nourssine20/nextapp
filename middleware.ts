import { NextRequest, NextResponse } from "next/server";
import {withAuth} from 'next-auth/middleware';
import { getToken } from "next-auth/jwt";
export default withAuth(async function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;
   const isAuth = await getToken({ req: request });
   const protectedRoutes = ['/profile'];
   const isAuthRoute = pathname.startsWith('/auth');
   const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route));
   if (!isAuth && isProtectedRoute) {
     return NextResponse.redirect(new URL ('/', request.url));
   }
   if (isAuthRoute && isAuth){
    return NextResponse.redirect(new URL ('/profile', request.url));
   }
},{
    callbacks: {
        async authorized(){
            return true;
        },
    },
   
  });
  export const config = {
    matcher: [
        '/profile/:path*',
        '/auth/:path*',
    ],
  };