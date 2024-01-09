import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/'];

export async function middleware(request: NextRequest, response: NextResponse) {
	const { pathname } = request.nextUrl;
	const session = request.cookies.get('api_session');

	if (session) {
		const responseAPI = await fetch(
			`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/login`,
			{
				headers: {
					Cookie: `api_session=${session?.value}`,
				},
			},
		);

		if (responseAPI.status == 200 && !protectedRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL('/', request.url));
		} else if (
			responseAPI.status == 200 &&
			protectedRoutes.includes(pathname)
		) {
			return NextResponse.next();
		}

		if (responseAPI.status == 401 && !protectedRoutes.includes(pathname)) {
			return NextResponse.next();
		} else if (
			responseAPI.status == 401 &&
			protectedRoutes.includes(pathname)
		) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	} else {
		if (protectedRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL('/login', request.url));
		} else if (!protectedRoutes.includes(pathname)) {
			return NextResponse.next();
		}
	}
}

export const config = {
	matcher: ['/', '/login'],
};
