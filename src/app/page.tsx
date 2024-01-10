'use client';
import React from 'react';
import Image from 'next/image';
import { db } from '@/firebase/client';
import { productT } from '@/zustand/types';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import Search from '@/components/Search';
import Paginate from '@/components/Paginate';
import DeleteProduct from '@/components/DeleteProduct';
import UpdateProduct from '@/components/UpdateProduct';
import { VscNewFile } from 'react-icons/vsc';
import CreateProduct from '@/components/CreateProduct';
import { useRouter } from 'next/navigation';

export default function Home() {
	const [products, setProducts] = React.useState<productT[]>([]);
	const [renderProducts, setRenderProducts] = React.useState<productT[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [createRequest, setCreateRequest] = React.useState(false);
	const router = useRouter();

	const [currentPage, setCurrentPage] = React.useState(1);
	const productsPerPege = 25;
	const lastProductIndex = currentPage * productsPerPege;
	const firstProductIndex = lastProductIndex - productsPerPege;
	const [slicedProducts, setSlicedProducts] = React.useState<productT[]>([]);

	async function getData() {
		const productsRef = collection(db, 'api');
		const data = await getDocs(productsRef);
		const products = data.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		})) as productT[];
		return products;
	}

	React.useEffect(() => {
		router.push('/');
		const apiCollection = collection(db, 'api');
		const unsubscribe = onSnapshot(apiCollection, (snapshot) => {
			snapshot.docChanges().forEach(() => {
				getData().then((data) => {
					setProducts(data);
					setRenderProducts(data);
				});
			});
		});
		setLoading(false);
		return () => unsubscribe();
	}, []);

	React.useEffect(() => {
		const slicedProducts = renderProducts.slice(
			firstProductIndex,
			lastProductIndex,
		);
		setSlicedProducts(slicedProducts);

		if (
			currentPage > 1 &&
			currentPage * productsPerPege == products.length + productsPerPege
		) {
			setCurrentPage((prev) => prev - 1);
		}
	}, [products, currentPage, renderProducts]);

	const [deleteRequest, setDeleteRequest] = React.useState(false);
	const [updateRequest, setUpdateRequest] = React.useState(false);
	const [productData, setProductData] = React.useState<productT[]>([]);
	function requestDelete(event: React.MouseEvent<HTMLButtonElement>) {
		const button = event.target as HTMLButtonElement;
		const { id, task } = button.dataset;
		const currentProduct = slicedProducts.filter((product) => product.id == id);
		setProductData(currentProduct);
		if (task == 'delete') {
			setDeleteRequest(true);
			return;
		}
		setUpdateRequest(true);
	}

	const searchProduct = React.useCallback((text: string) => {
		const searched = products.filter(
			(product) =>
				product.name.toLowerCase().includes(text.toLowerCase()) ||
				product.id.toLowerCase().includes(text.toLowerCase()) ||
				product.category.toLowerCase().includes(text.toLowerCase()) ||
				product.description.toLowerCase().includes(text.toLowerCase()),
		);
		setRenderProducts(searched);
	}, []);

	if (loading) return <main className="container py-2">Carregando...</main>;

	return (
		<main className="container py-2 grow">
			<div
				className="mb-4 flex items-center gap-2 cursor-pointer hover:text-green-600 w-fit"
				onClick={() => setCreateRequest(true)}
			>
				<VscNewFile size="1.6em" />
				<span>Novo</span>
			</div>
			<div className="mb-4">
				<Search searchProduct={searchProduct} />
			</div>
			<section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
				{slicedProducts.map((product) => (
					<div
						key={product.id}
						className="bg-slate-800 shadow-md shadow-white rounded-md p-2 flex flex-col"
					>
						<div className="flex gap-2 mb-4">
							<div>
								<Image
									src={product.img}
									alt={product.name}
									width={50}
									height={100}
									placeholder="empty"
								/>
							</div>
							<div className="text-sm">
								<p>{product.name}</p>
								<p>
									{product.price.toLocaleString('pt-br', {
										style: 'currency',
										currency: 'BRL',
									})}
								</p>
							</div>
						</div>
						<div className="mt-auto grid grid-cols-2 gap-2">
							<button
								className="bg-white text-black hover:bg-black hover:text-white p-1 rounded-md"
								data-id={product.id}
								data-task="update"
								onClick={requestDelete}
							>
								Editar
							</button>
							<button
								className="bg-white text-black hover:bg-black hover:text-white p-1 rounded-md"
								data-id={product.id}
								data-task="delete"
								onClick={requestDelete}
							>
								Excluir
							</button>
						</div>
					</div>
				))}
			</section>

			{renderProducts.length > productsPerPege && (
				<Paginate
					dataLength={products.length}
					dataPerPage={productsPerPege}
					setCurrentPage={setCurrentPage}
				/>
			)}

			{deleteRequest && (
				<DeleteProduct
					setDeleteRequest={setDeleteRequest}
					product={productData[0]}
				/>
			)}

			{updateRequest && (
				<UpdateProduct
					setUpdateRequest={setUpdateRequest}
					product={productData[0]}
				/>
			)}

			{createRequest && <CreateProduct setCreateRequest={setCreateRequest} />}
		</main>
	);
}
