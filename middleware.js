// Visitors who are not logged in cannot open these pages
export { default } from 'next-auth/middleware';

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
