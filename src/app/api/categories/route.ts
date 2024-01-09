import admin from 'firebase-admin';
import { customInitApp } from '@/firebase/admin';
import { NextResponse } from 'next/server';
import { productT } from '@/zustand/types';

customInitApp();
export async function GET() {
	const collection = admin.firestore().collection('api');
	const snapshot = await collection.get();

	const allProducts = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as productT[];

	const categories = Array.from(
		new Set(allProducts.map((product) => product.category)),
	);

	return NextResponse.json(categories);
}
