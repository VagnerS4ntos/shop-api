'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VscSignOut, VscNewFile } from 'react-icons/vsc';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useRouter } from 'next/navigation';

export default function Header() {
	const path = usePathname();
	const router = useRouter();

	function logOut() {
		signOut(auth)
			.then(async () => {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/signout`,
					{
						method: 'POST',
					},
				);

				if (response.status === 200) {
					router.push('/login');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<header className="bg-purple-800 py-2">
			<nav className="container flex justify-between items-center">
				<Link href="/">
					<Image src="/logo.png" alt="Logo" width={65} height={65} />
				</Link>

				{path != '/login' && (
					<ul className="flex items-center gap-4 font-bold">
						<li
							className="cursor-pointer hover:text-black"
							title="Sair"
							onClick={logOut}
						>
							<VscSignOut size="1.5em" />
						</li>
					</ul>
				)}
			</nav>
		</header>
	);
}
