'use client';
import React from 'react';
import Image from 'next/image';
import { productT } from '@/zustand/types';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase/client';

export default function DeleteProduct({
	setDeleteRequest,
	product,
}: {
	setDeleteRequest: React.Dispatch<React.SetStateAction<boolean>>;
	product: productT;
}) {
	function closeDeleteRequest(event: React.MouseEvent<HTMLDivElement>) {
		const div = event.target as HTMLButtonElement;
		const { close } = div.dataset;
		if (close) setDeleteRequest(false);
	}

	async function deleteProduct() {
		try {
			await deleteDoc(doc(db, 'api', product.id));

			const productRef = ref(storage, `img/${product.imageStorageID}`);
			deleteObject(productRef);

			setDeleteRequest(false);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<section
			className="fixed bg-white bg-opacity-50 inset-0 grid place-items-center p-4 "
			onClick={closeDeleteRequest}
			data-close={true}
		>
			<div className="bg-black p-4 rounded-md max-w-md w-full mx-auto">
				<div>
					<ul className="space-y-4">
						<li className="mb-2">
							<Image
								src={product.img}
								alt={product.img}
								width={100}
								height={100}
							/>
						</li>
						<li>
							<span className="font-bold">Nome</span>: {product.name}
						</li>
						<li>
							<span className="font-bold">Descrição</span>:{' '}
							{product.description}
						</li>
						<li>
							<span className="font-bold">Preço</span>:{' '}
							{product.price.toLocaleString('pt-br', {
								style: 'currency',
								currency: 'BRL',
							})}
						</li>

						<li className="text-red-600 font-bold">
							Identificador: {product.id}
						</li>
					</ul>
				</div>
				<p className="mt-4 font-bold">
					Tem certeza que deseja deletar este item?
				</p>
				<div className="text-white grid grid-cols-2 gap-2 mt-2">
					<button
						className="bg-red-500 hover:bg-white hover:text-red-500 p-1 rounded-md"
						onClick={deleteProduct}
					>
						Sim
					</button>
					<button
						className="bg-green-500 hover:bg-white hover:text-green-500 p-1 rounded-md"
						data-close={true}
					>
						Não
					</button>
				</div>
			</div>
		</section>
	);
}
