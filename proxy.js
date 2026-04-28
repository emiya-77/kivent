import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// const isPublicRoute = createRouteMatcher([
//   '/sign-in(.*)',
//   '/sign-up(.*)'
// ])

// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect()
//   }
// })

const isProtectedRoute = createRouteMatcher([
    '/my-events(.*)',
    '/create-event(.*)',
    '/edit-event(.*)',
    '/dashboard(.*)',
    '/my-tickets(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();
    if (isProtectedRoute(req) && !userId) {
        return redirectToSignIn({ returnBackUrl: req.url });
    }

    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};