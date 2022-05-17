import Head from 'next/head'
import Link from 'next/link'

export default function PageHead() {
	return (
		<Head>
			<div>
				<title>NFT Playground</title>

				<nav className="border-b p-6">
					<Link href="/">
						<a className="text-4xl font-bold hover:text-gray-500 cursor-pointer">NFT Playground</a>
					</Link>

					<div className="flex mt-4">
						<Link href="/market">
							<a className=" mr-6 font-bold hover:text-blue-400 text-blue-500">Market</a>
						</Link>
						<Link href="/loans">
							<a className="mr-6 font-bold hover:text-blue-400 text-blue-500">NFT Loan</a>
						</Link>
						<Link href="/community">
							<a className="mr-6 font-bold hover:text-blue-400 text-blue-500">Community</a>
						</Link>
						<Link href="/create-item">
							<a className="mr-6 font-bold hover:text-blue-400 text-blue-500">Create NFT</a>
						</Link>
						<Link href="/my-assets">
							<a className="mr-6 font-bold hover:text-blue-400 text-blue-500">My NFT</a>
						</Link>
					</div>
				</nav>
			</div>
		</Head>
	)
}
