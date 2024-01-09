'use client';
import React from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '@/firebase/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newProductFormT, newProductSchema } from '@/zustand/types';
import { addDoc, collection } from 'firebase/firestore';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import HandleProductInfo from '@/components/HandleProductInfo';

export default function CreateProduct({
	setCreateRequest,
}: {
	setCreateRequest: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const formData = useForm<newProductFormT>({
		resolver: zodResolver(newProductSchema),
	});
	const [requesting, setRequesting] = React.useState(false);
	const [file, setFile] = React.useState('');

	const onSubmit: SubmitHandler<newProductFormT> = async ({
		name,
		description,
		category,
		price,
		file,
	}) => {
		try {
			setRequesting(true);
			if (_.isEmpty(file)) {
				formData.setError('file', {
					message: 'É necessário escolher uma imagem',
				});
				return;
			}
			const imageStorageID = uuid();
			const storageRef = ref(storage, `img/${imageStorageID}`);
			const uploadTask = uploadBytesResumable(storageRef, file[0]);

			uploadTask.on(
				'state_changed',
				() => {},
				(error) => {
					console.log(error);
				},
				async () => {
					getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
						const apiCollection = collection(db, 'api');
						await addDoc(apiCollection, {
							name,
							category,
							description,
							price: Number(price.replace(',', '.')),
							img: url,
							imageStorageID,
						});
						formData.reset();
						setFile('');
					});
				},
			);
		} catch (error: any) {
			console.log(error);
		} finally {
			setRequesting(false);
		}
	};

	return (
		<HandleProductInfo
			setHandleRequest={setCreateRequest}
			onSubmit={onSubmit}
			requesting={requesting}
			formData={formData}
			file={file}
			setFile={setFile}
		/>
	);
}
