import '../styles/globals.css'
import Connector from '../components/connector'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<div className="container">
				<title>NFT Playground</title>

				<nav className="border-b p-6 ">
					<div className="flex grid-flow-row">
						<div className="w-1/2 md:w-full">
							<Link href="/">
								<a className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-blue-800 to-sky-200">
									NFT Playground
								</a>
							</Link>
						</div>
						<div className="flex grid-flow-row w-1/2 md:w-full">
							<Link href="/market">
								<a className="mr-6 font-bold text-lg hover:text-blue-200 ">Market</a>
							</Link>
							<Link href="/loans">
								<a className="mr-6 font-bold text-lg hover:text-blue-200 ">Loan</a>
							</Link>
							<Link href="/community">
								<a className="mr-6 font-bold text-lg hover:text-blue-200 ">Community</a>
							</Link>
							<Link href="/create-item">
								<a className="mr-6 font-bold text-lg hover:text-blue-200 ">Create NFT</a>
							</Link>
							<Link href="/my-assets">
								<a className="mr-6 font-bold text-lg hover:text-blue-200 ">My NFT</a>
							</Link>
						</div>
						<div className="flex grid-flow-row w-1/2 md:w-full">
							<Connector />
						</div>
					</div>
				</nav>
			</div>

			<Component {...pageProps} />
			<footer>
				<p>Test</p>
			</footer>
		</>
	)
}
