import React from 'react';
import { newProductFormT } from '@/zustand/types';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaFileUpload, FaTrashAlt } from 'react-icons/fa';

export default function HandleProductInfo({
	setHandleRequest,
	onSubmit,
	requesting,
	formData,
	id,
	file,
	setFile,
}: {
	setHandleRequest?: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: SubmitHandler<newProductFormT>;
	requesting: boolean;
	formData: UseFormReturn<
		{
			name: string;
			category: string;
			description: string;
			price: string;
			file?: any;
		},
		any,
		undefined
	>;
	id?: string;
	file?: string;
	setFile?: React.Dispatch<React.SetStateAction<string>>;
}) {
	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const fileData = event.target.files && event.target.files;
		if (fileData) {
			formData.setValue('file', fileData);
			if (setFile) setFile(fileData[0].name);
		}
	}

	function closeHandleProductInfo(event: React.MouseEvent<HTMLDivElement>) {
		const div = event.target as HTMLButtonElement;
		const { close } = div.dataset;
		if (close && setHandleRequest) setHandleRequest(false);
	}

	function removeFile() {
		if (setFile) setFile('');
		formData.setValue('file', '');
	}

	return (
		<section
			className="p-4 fixed inset-0 bg-white bg-opacity-50 grid place-items-center"
			onClick={closeHandleProductInfo}
			data-close={true}
		>
			<form
				onSubmit={formData.handleSubmit(onSubmit)}
				className="text-black bg-black max-w-md w-full mx-auto p-4 rounded-md "
			>
				<div className="text-red-600 mb-4">
					{id && <p>Identificador: {id}</p>}
				</div>
				<div className="mb-4">
					<label htmlFor="name" className="block font-medium">
						Nome
					</label>
					<input
						type="text"
						id="name"
						className={`mt-1 p-1 w-full border  rounded-md ${
							formData.formState.errors.name
								? 'border-red-500'
								: 'border-gray-400'
						}`}
						{...formData.register('name')}
						placeholder="Nome"
					/>
					<span className="text-red-500 text-sm">
						{formData.formState.errors.name?.message}
					</span>
				</div>
				<div className="mb-4">
					<label htmlFor="description" className="block font-medium">
						Descrição
					</label>
					<textarea
						id="description"
						className={`mt-1 p-1 w-full border rounded-md ${
							formData.formState.errors.description
								? 'border-red-500'
								: 'border-gray-400'
						}`}
						{...formData.register('description')}
						placeholder="Descrição"
					/>

					<span className="text-red-500 text-sm">
						{formData.formState.errors.description?.message}
					</span>
				</div>
				<div className="mb-4">
					<label htmlFor="category" className="block font-medium">
						Categoria
					</label>
					<input
						type="text"
						id="category"
						className={`mt-1 p-1 w-full border  rounded-md ${
							formData.formState.errors.category
								? 'border-red-500'
								: 'border-gray-400'
						}`}
						{...formData.register('category')}
						placeholder="Categoria"
					/>

					<span className="text-red-500 text-sm">
						{formData.formState.errors.category?.message}
					</span>
				</div>
				<div className="mb-4">
					<label htmlFor="price" className="block font-medium">
						Preço
					</label>
					<input
						type="text"
						min={0}
						id="price"
						className={`mt-1 p-1 w-full border  rounded-md ${
							formData.formState.errors.price
								? 'border-red-500'
								: 'border-gray-400'
						}`}
						{...formData.register('price')}
						placeholder="Preço"
					/>

					<span className="text-red-500 text-sm">
						{formData.formState.errors.price?.message}
					</span>
				</div>
				<div className="mb-4 grid grid-cols-2">
					<label
						htmlFor="file"
						className="cursor-pointer flex items-center gap-2 mb-2 hover:text-blue-600"
					>
						<FaFileUpload size="1.5em" />
						<span>{file || 'Carregar arquivo'}</span>
					</label>
					{file && (
						<span
							className="text-white flex gap-2 cursor-pointer hover:text-red-600"
							onClick={removeFile}
						>
							<FaTrashAlt size="1.5em" />
							Remover arquivo
						</span>
					)}

					<input
						type="file"
						id="file"
						className={`hidden`}
						{...formData.register('file')}
						onChange={handleFileChange}
					/>
					<span className="text-red-500 text-sm block mt-1">
						{formData.formState.errors.file?.message as string | undefined}
					</span>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-md active:bg-blue-400 flex items-center justify-center h-10"
						disabled={requesting}
					>
						{requesting ? (
							<AiOutlineLoading3Quarters className="animate-spin" />
						) : (
							'Salvar'
						)}
					</button>
					<button
						type="button"
						className="w-full bg-green-600 hover:bg-green-500 text-white p-1 rounded-md active:bg-green-400 flex items-center justify-center h-10"
						disabled={requesting}
						data-close={true}
					>
						{requesting ? (
							<AiOutlineLoading3Quarters className="animate-spin" />
						) : (
							'Cancelar'
						)}
					</button>
					{/* <span className="text-red-500 text-sm">{error}</span> */}
				</div>
			</form>
		</section>
	);
}
