import Head from 'next/head'
import Link from 'next/link'
import Connector from './connector'

export default function PageHead() {
	return (
		<Head>
			<div>
				<title>NFT Playground</title>
				<nav className="border-b p-6">
					<Link href="/">
						<a className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-blue-800 to-sky-200">
							NFT Playground
						</a>
						{/* <a className="text-4xl font-bold hover:text-gray-500">NFT Playground</a> */}
					</Link>

					<div className="flex mt-4">
						<Link href="/market">
							<a className=" mr-6 font-bold hover:text-blue-400 text-blue-500">Market</a>
						</Link>
						<Link href="/loans">
							<a className="mr-6 font-bold hover:text-blue-400 text-blue-500">Loan</a>
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
