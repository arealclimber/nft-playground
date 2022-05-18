import Head from 'next/head'
import Link from 'next/link'

export default function PageHead() {
	// const ConnectInfo = () => {
	// 	const [showWalletOptions, setShowWalletOptions] = useState(false)
	// 	const [{ data: accountData, loading: accountLoading }] = useAccount()
	// 	const [{ data: balanceData, loading: balanceLoading }] = useBalance({
	// 		addressOrName: accountData?.address,
	// 		watch: true,
	// 	})
	// 	const loading = (accountLoading || balanceLoading) && !balanceData
	// 	const renderContent = () => {
	// 		if (loading) return <Loader size={8} />
	// 		if (balanceData) {
	// 			return (
	// 				<>
	// 					<h1 className="mb-8 text-4xl font-bold">My Wallet</h1>
	// 					<div className="inline-flex place-items-center">
	// 						<h6 className="ml-2 text-2xl">{`Ξ ${Number(balanceData?.formatted).toFixed(4)} ${
	// 							balanceData?.symbol
	// 						}`}</h6>
	// 					</div>
	// 				</>
	// 			)
	// 		}
	// 	}
	// 	return (
	// 		<>
	// 			<h1 className="mb-8 text-4xl font-bold">Welcome to the NextJS wagmi template!</h1>
	// 			<Button loading={accountLoading} onClick={() => setShowWalletOptions(true)}>
	// 				Connect to Wallet
	// 			</Button>
	// 		</>
	// 	)
	// }
	// return (
	// 	<>
	// 		<WalletOptionsModal open={showWalletOptions} setOpen={setShowWalletOptions} />
	// 		<Layout showWalletOptions={showWalletOptions} setShowWalletOptions={setShowWalletOptions}>
	// 			<div className="grid h-screen place-items-center">
	// 				<div className="grid place-items-center">{renderContent()}</div>
	// 			</div>
	// 		</Layout>
	// 	</>
	// )
	//-----------------------------------------------
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
