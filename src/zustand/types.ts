import { z } from 'zod';
/**************************************PRODUCT FIRESTORE**********************************/
const productSchema = z.object({
	id: z.string(),
	name: z.string(),
	category: z.string(),
	description: z.string(),
	img: z.string(),
	price: z.number(),
	imageStorageID: z.string(),
});

export type productT = z.infer<typeof productSchema>;

export const loginSchema = z.object({
	email: z.string().email({ message: 'E-mail inválido' }),
	password: z.string(),
});

export type loginFormT = z.infer<typeof loginSchema>;

/**************************************NEW PRODUCT FORM**********************************/
const MAX_FILE_SIZE = 2097152;
const ACCEPTED_IMAGE_TYPES = [
	'image/jpg',
	'image/jpeg',
	'image/png',
	'image/webp',
];

export const newProductSchema = z.object({
	name: z.string().min(3, {
		message: 'O nome do produto precite ter pelo menos 3 caracteres',
	}),
	description: z.string().refine((data) => data.length > 0, {
		message: 'É necessário ter uma descrição do produto',
	}),
	category: z.string().refine((data) => data.length > 0, {
		message: 'É necessário adicionar uma categoria ao produto',
	}),
	price: z.string().refine(
		(value) => {
			const regex = /^\d+([.,]\d{1,2})?$/;
			return regex.test(value);
		},
		{
			message: 'Digite um valor válido',
		},
	),
	file: z
		.any()
		.refine((files) => files?.length == 1, 'É necessário escolher uma imagem')
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			'Formato de arquivo incorreto. Os formatos aceitos são .jpg, .jpeg, .png e .webp',
		)
		.refine(
			(files) => files?.[0]?.size <= MAX_FILE_SIZE,
			`Arquivo muito grande. O tamanho máximo é 2MB`,
		)
		.or(z.any().refine((files) => files?.length == 0)),
});
export type newProductFormT = z.infer<typeof newProductSchema>;
