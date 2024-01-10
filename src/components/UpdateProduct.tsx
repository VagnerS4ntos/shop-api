import { db, storage } from '@/firebase/client';
import { newProductFormT, newProductSchema, productT } from '@/zustand/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, updateDoc } from 'firebase/firestore';
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import HandleProductInfo from './HandleProductInfo';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

export default function UpdateProduct({
	setUpdateRequest,
	product,
}: {
	setUpdateRequest: React.Dispatch<React.SetStateAction<boolean>>;
	product: productT;
}) {
	const formData = useForm<newProductFormT>({
		defaultValues: {
			name: product.name,
			description: product.description,
			category: product.category,
			price: product.price.toString(),
		},
		resolver: zodResolver(newProductSchema),
	});
	const [requesting, setRequesting] = React.useState(false);

	const onSubmit: SubmitHandler<newProductFormT> = async ({
		name,
		description,
		category,
		price,
		file,
	}) => {
		setRequesting(true);
		try {
			const updateData = {
				name,
				description,
				category,
				price: Number(price),
			};
			const copyProduct = _.omit(product, ['img', 'id', 'imageStorageID']);
			const imageStorageID = uuid();
			//Se um arquivo for carregado, a imagem antiga será deletada e uma nova será carregada
			//Storage e Firestore são alterados
			if (!_.isEmpty(file)) {
				const storageRef = ref(storage, `img/${imageStorageID}`);
				const uploadTask = uploadBytesResumable(storageRef, file[0]);

				uploadTask.on(
					'state_changed',
					() => {},
					(error) => console.log(error),
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
							const copyProduct = _.omit(product, ['img', 'id']);
							if (_.isEqual(copyProduct, updateData)) {
								return;
							}
							await updateDoc(doc(db, 'api', product.id), {
								...updateData,
								img: url,
								imageStorageID,
							});
							formData.reset();
							setUpdateRequest(false);
						});
					},
				);

				const deleteProductRef = ref(storage, `img/${product.imageStorageID}`);
				deleteObject(deleteProductRef);

				return;
			}

			//Se nenhum arquivo for carregado, apenas o Firestore será alterado

			//Se não houver alteração, não faz a requisição
			if (_.isEqual(copyProduct, updateData)) {
				setUpdateRequest(false);
				return;
			}

			await updateDoc(doc(db, 'api', product.id), updateData);
			setUpdateRequest(false);
		} catch (error: any) {
			console.log(error);
		} finally {
			setRequesting(false);
		}
	};

	return (
		<HandleProductInfo
			setHandleRequest={setUpdateRequest}
			onSubmit={onSubmit}
			requesting={requesting}
			formData={formData}
			id={product.id}
		/>
	);
}
