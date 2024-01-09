'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { loginFormT, loginSchema } from '@/zustand/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaUserTie } from 'react-icons/fa';
import { auth } from '@/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Login() {
	const router = useRouter();
	const [requesting, setRequesting] = React.useState(false);
	const [error, setError] = React.useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<loginFormT>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<loginFormT> = ({ email, password }) => {
		setRequesting(true);

		signInWithEmailAndPassword(auth, email, password)
			.then(async ({ user }) => {
				const idToken = await user.getIdToken();

				fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/login`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${idToken}`,
					},
				}).then((response) => {
					if (response.status === 200) {
						router.push('/');
					}
				});
			})
			.catch((error) => {
				if (
					error.message == 'Firebase: Error (auth/wrong-password).' ||
					error.message == 'Firebase: Error (auth/user-not-found).'
				) {
					setError('E-mail ou senha incorreta');
				} else {
					setError(error.message);
				}
				setRequesting(false);
			});
	};

	return (
		<main className="grid place-items-center grow">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-slate-800 text-black p-4 rounded-md w-4/5 max-w-sm shadow-md shadow-white"
			>
				<FaUserTie size="2em" className="mx-auto mb-2 text-white" />
				<div className="mb-2">
					<label htmlFor="name" className="block font-medium">
						E-mail
					</label>
					<input
						type="text"
						id="name"
						className={`mt-1 p-2 w-full border rounded-md ${
							errors.email ? 'border-red-500' : 'border-gray-400'
						}`}
						{...register('email')}
						placeholder="E-mail"
					/>
					<span className="text-red-500 text-sm">{errors.email?.message}</span>
				</div>

				<div className="">
					<label htmlFor="password" className="block font-medium">
						Senha
					</label>
					<input
						type="password"
						id="password"
						className={`mt-1 p-2 w-full border  rounded-md ${
							errors.password ? 'border-red-500' : 'border-gray-400'
						}`}
						{...register('password')}
						placeholder="Senha"
					/>
				</div>
				<button
					className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white mt-4 w-full h-10 rounded-md grid place-items-center "
					disabled={requesting}
				>
					{requesting ? (
						<AiOutlineLoading3Quarters className="animate-spin" />
					) : (
						'Enviar'
					)}
				</button>
				<span className="text-red-500 text-sm">{error}</span>
			</form>
		</main>
	);
}
