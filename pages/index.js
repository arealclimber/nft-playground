import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Layout from '../components/layout';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

// import { useAccount, useBalance } from 'wagmi'
// import { useConnect } from 'wagmi'

import { nftContractAddress, marketContractAddress } from '../utils/config';
import NFT from '../utils/NFT.json';
import Market from '../utils/Market.json';

// import NFT from '../artifacts/contracts/working/NFT.sol/NFT.json'
// import Market from '../artifacts/contracts/working/NFTMarket.sol/NFTMarket.json'

import Link from 'next/link';

export default function Home() {
	useEffect(() => {
		// checkIfWalletIsConnected()
		// checkCorrectNetwork()
		loadNFTs();
	}, []);

	const infuraId = process.env.INFURA_MUMBAI_URL;
	// Hex
	const rinkebyChainId = '0x4';
	const mumbaiChainId = '0x13881';
	const neededCahinId = mumbaiChainId;

	const [nfts, setNfts] = useState([]);
	const [sold, setSold] = useState([]);
	const [loadingState, setLoadingState] = useState('not-loaded');
	const [provider, setProvider] = useState([]);
	const [library, setLibrary] = useState([]);
	const [currentAccount, setCurrentAccount] = useState('');
	const [correctNetwork, setCorrectNetwork] = useState(false);

	// async function checkIfWalletIsConnected() {
	// 	const { ethereum } = window
	// 	if (ethereum) {
	// 		console.log('Got the ethereum object: ', ethereum)
	// 	} else {
	// 		console.log('No Wallet found. Connect Wallet')
	// 	}

	// 	try {
	// 		const accounts = await ethereum.request({ method: 'eth_accounts' })

	// 		if (accounts.length !== 0) {
	// 			console.log('Found authorized Account: ', accounts[0])
	// 			setCurrentAccount(accounts[0])
	// 		} else {
	// 			console.log('No Wallet found. Connect Wallet')
	// 		}
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

	// async function checkCorrectNetwork() {
	// 	try {
	// 		const { ethereum } = window
	// 		let chainId = await ethereum.request({ method: 'eth_chainId' })
	// 		console.log('Connect to chain: ' + chainId)

	// 		if (chainId !== neededCahinId) {
	// 			setCorrectNetwork(false)
	// 		} else {
	// 			setCorrectNetwork(true)
	// 		}
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

	// const providerOptions = {
	// 	injected: {
	// 		display: {
	// 			name: 'Injected',
	// 			description: 'Connect with the provider in your Browser',
	// 		},
	// 		package: null,
	// 	},
	// 	walletconnect: {
	// 		package: WalletConnectProvider, // required
	// 		options: {
	// 			infuraId: 'INFURA_ID', // required
	// 		},
	// 	},
	// 	coinbasewallet: {
	// 		package: CoinbaseWalletSDK, // Required
	// 		options: {
	// 			appName: 'NFT Playground', // Required
	// 			infuraId: 'INFURA_ID', // Required
	// 			rpc: '', // Optional if `infuraId` is provided; otherwise it's required
	// 			chainId: neededCahinId, // Optional. It defaults to 1 if not provided
	// 			darkMode: false, // Optional. Use dark theme, defaults to false
	// 		},
	// 	},
	// }

	// const connectWallet = async () => {
	// 	const web3Modal = new Web3Modal({
	// 		providerOptions,
	// 		cacheProvider: true,
	// 		theme: {
	// 			background: 'rgb(39, 49, 56)',
	// 			main: 'rgb(199, 199, 199)',
	// 			secondary: 'rgb(136, 136, 136)',
	// 			border: 'rgba(195, 195, 195, 0.14)',
	// 			hover: 'rgb(16, 26, 32)',
	// 		},
	// 	})
	// 	try {
	// 		const provider = await web3Modal.connect()
	// 		const library = new ethers.providers.Web3Provider(provider)
	// 		setProvider(provider)
	// 		setLibrary(library)
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

	// FIXME: How to display the market item without user connecting wallet?
	async function loadNFTs() {
		const web3Modal = new Web3Modal();
		// const connection = await web3Modal.connect()
		// const provider = new ethers.providers.Web3Provider(connection)

		// const providerOptions = {
		// 	injected: {
		// 		display: {
		// 			name: 'Injected',
		// 			description: 'Connect with the provider in your Browser',
		// 		},
		// 		package: null,
		// 	},
		// 	walletconnect: {
		// 		package: WalletConnectProvider, // required
		// 		options: {
		// 			infuraId: 'INFURA_ID', // required
		// 		},
		// 	},
		// 	coinbasewallet: {
		// 		package: CoinbaseWalletSDK, // Required
		// 		options: {
		// 			appName: 'NFT Playground', // Required
		// 			infuraId: 'INFURA_ID', // Required
		// 			rpc: '', // Optional if `infuraId` is provided; otherwise it's required
		// 			chainId: neededCahinId, // Optional. It defaults to 1 if not provided
		// 			darkMode: false, // Optional. Use dark theme, defaults to false
		// 		},
		// 	},
		// }

		// const web3Modal = new Web3Modal({
		// 	providerOptions,
		// 	cacheProvider: true,
		// 	theme: {
		// 		background: 'rgb(39, 49, 56)',
		// 		main: 'rgb(199, 199, 199)',
		// 		secondary: 'rgb(136, 136, 136)',
		// 		border: 'rgba(195, 195, 195, 0.14)',
		// 		hover: 'rgb(16, 26, 32)',
		// 	},
		// })

		const provider = await web3Modal.connect();
		const library = new ethers.providers.Web3Provider(provider);
		const signer = library.getSigner();

		// const provider = new ethers.providers.JsonRpcProvider()
		const tokenContract = new ethers.Contract(nftContractAddress, NFT, signer);
		const marketContract = new ethers.Contract(
			marketContractAddress,
			Market,
			signer
		);
		try {
			const data = await marketContract.fetchMarketItems();
			// Get the NFT array populated with metadata (IPFS in this case)
			const items = await Promise.all(
				data.map(async (i) => {
					const tokenUri = await tokenContract.tokenURI(i.tokenId);
					const meta = await axios.get(tokenUri);
					let price = ethers.utils.formatUnits(
						i.price.toString(),
						'ether'
					);
					let item = {
						price,
						itemId: i.itemId.toNumber(),
						tokenId: i.tokenId.toNumber(),
						seller: i.seller,
						owner: i.owner,
						image: meta.data.image,
						name: meta.data.name,
						description: meta.data.description,
					};
					return item;
				})
			);
			setNfts(items);
			setLoadingState('loaded');

			// const soldItems = items.filter((i) => i.sold)
			// setSold(soldItems)
			setNfts(items);
			setLoadingState('loaded');
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Layout>
			<div className="">
				<div className="p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
						<Link href="/market">
							<h2 className="text-2xl font-bold py-2 text-accent hover:text-blue-200 hover:cursor-pointer">
								NFT Marketplace
							</h2>
						</Link>
						<p className="text-2xl font-bold py-2">
							Buy and sell your NFTs.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
						{nfts.map((nft, i) => (
							<div
								key={i}
								className="border shadow rounded-xl overflow-hidden"
							>
								<img src={nft.image} className="rounded" />
								<div className="p-4 bg-black">
									<p className="text-2xl font-bold text-white">
										{nft.name}
									</p>
									<p className="text-2xl font-bold text-white">
										Price - {nft.price} Eth
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="p-6">
					<div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							<Link href="/loans">
								<h2 className="text-2xl font-bold py-2 text-accent hover:text-blue-200 hover:cursor-pointer">
									Fractional NFTs
								</h2>
							</Link>
							<p className="text-2xl font-bold py-2">
								Lend and borrow with NFTs.
							</p>
						</div>

						{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							{nfts.map((nft, i) => (
								<div
									key={i}
									className="border shadow rounded-xl overflow-hidden"
								>
									<img src={nft.image} className="rounded" />
									<div className="p-4 bg-black">
										<p className="text-2xl font-bold text-white">
											{nft.name}
										</p>

										<p className="text-2xl font-bold text-white">
											Price - {nft.price} ETH
										</p>
									</div>
								</div>
							))}
						</div> */}
					</div>
				</div>

				<div className="p-6">
					{
						<div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
								<Link href="/community">
									<h2 className="text-2xl font-bold py-2 text-accent hover:text-blue-200 hover:cursor-pointer">
										Community Playground
									</h2>
								</Link>
								<p className="text-2xl font-bold py-2">
									Thoughts and chats.
								</p>
							</div>

							{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
								{nfts.map((nft, i) => (
									<div
										key={i}
										className="border shadow rounded-xl overflow-hidden"
									>
										<img src={nft.image} className="rounded" />
										<div className="p-4 bg-black">
											<p className="text-2xl font-bold text-white">
												{nft.name}
											</p>

											<p className="text-2xl font-bold text-white">
												Price - {nft.price} ETH
											</p>
										</div>
									</div>
								))}
							</div> */}
						</div>
					}
				</div>
			</div>
		</Layout>
	);
}

// Home.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
