import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<title>NFT Playground</title>

			<nav className="font-sans border-b p-6">
				<Link href="/">
					<p className="text-4xl font-bold hover:text-gray-500 cursor-pointer">NFT Playground</p>
				</Link>
				<div className="flex mt-4">
					<Link href="/market">
						<a className="inline-block ui-monospace mr-6 font-bold hover:text-blue-400 text-blue-500">
							Market
						</a>
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
					<Link href="/creator-dashboard">
						<a className="mr-6 font-bold hover:text-blue-400 text-blue-500">Creator Dashboard</a>
					</Link>
				</div>
			</nav>
			<Component {...pageProps} />
		</div>
	)
}

export default MyApp
