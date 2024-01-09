import { auth } from 'firebase-admin';
import { customInitApp } from '@/firebase/admin';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

customInitApp();

export async function POST(request: NextRequest, response: NextResponse) {
	const authorization = headers().get('Authorization');
	if (authorization?.startsWith('Bearer ')) {
		const idToken = authorization.split('Bearer ')[1];
		const decodedToken = await auth().verifyIdToken(idToken);

		if (decodedToken) {
			const expiresIn = 60 * 60 * 24 * 5 * 1000;
			const sessionCookie = await auth().createSessionCookie(idToken, {
				expiresIn,
			});
			const options = {
				name: 'api_session',
				value: sessionCookie,
				maxAge: expiresIn,
				httpOnly: true,
				secure: true,
			};

			cookies().set(options);
		}
	}

	return NextResponse.json({ status: 200 });
}

export async function GET(request: NextRequest) {
	const session = cookies().get('api_session')?.value;
	if (session) {
		const decodedClaims = await auth().verifySessionCookie(session, true);

		if (!decodedClaims) {
			return NextResponse.json({ status: 401 });
		}

		return NextResponse.json({ status: 200 });
	}
	return NextResponse.json({ status: 401 });
}
