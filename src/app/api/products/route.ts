import admin from 'firebase-admin';
import { customInitApp } from '@/firebase/admin';
import { NextResponse } from 'next/server';

customInitApp();
export async function GET() {
	const collection = admin.firestore().collection('api');
	const snapshot = await collection.get();

	const allProducts = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	return NextResponse.json(allProducts);
}
