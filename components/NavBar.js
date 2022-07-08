import Link from 'next/link';
import icon from '../public/icon.png';
import Image from 'next/image';
import { useState } from 'react';
import Connector from './Connector';

export const NavBar = () => {
	const [active, setActive] = useState(false);
	const handleClick = () => {
		setActive(!active);
	};
	return (
		<>
			<nav className="flex items-center flex-wrap p-3">
				<Link href="/">
					<a className="inline-flex items-center p-2 mr-4">
						<Image src={icon} width={30} height={30} className="" />
						<span className="text-xl p-2 font-bold uppercase tracking-wide hover:text-blue-200">
							NFT Playground
						</span>
					</a>
				</Link>

				<button
					className=" inline-flex p-3 hover:bg-blue-300 rounded lg:hidden text-white ml-auto hover:text-white outline-none"
					onClick={handleClick}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>

				<div
					className={`${
						active ? '' : 'hidden'
					} w-full lg:inline-flex lg:flex-grow lg:w-auto`}
				>
					<div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto">
						<Link href="/market">
							<a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-300 hover:text-black">
								Market
							</a>
						</Link>
						<Link href="/loans">
							<a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-300 hover:text-black">
								Loan
							</a>
						</Link>
						<Link href="/community">
							<a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-300 hover:text-black">
								Community
							</a>
						</Link>
						<Link href="/create-item">
							<a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-300 hover:text-black">
								Create NFT
							</a>
						</Link>
						<Link href="/my-assets">
							<a className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center hover:bg-blue-300 hover:text-black">
								My NFT
							</a>
						</Link>
						<Connector />
					</div>
				</div>
			</nav>
		</>
	);
};
