import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Layout from '../components/layout'

import { nftContractAddress, marketContractAddress } from '../config'

import NFT from '../artifacts/contracts/working/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/working/NFTMarket.sol/NFTMarket.json'

export default function NFTMarket() {
	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState('not-loaded')

	useEffect(() => {
		loadNFTs()
	}, [])

	async function loadNFTs() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		// const signer = provider.getSigner()

		// const provider = new ethers.providers.JsonRpcProvider()
		const tokenContract = new ethers.Contract(
			nftContractAddress,
			NFT.abi,
			provider
		)
		const marketContract = new ethers.Contract(
			marketContractAddress,
			Market.abi,
			provider
		)

		try {
			const data = await marketContract.fetchMarketItems()
			// Get the NFT array populated with metadata (IPFS in this case)
			const items = await Promise.all(
				data.map(async (i) => {
					const tokenUri = await tokenContract.tokenURI(i.tokenId)
					const meta = await axios.get(tokenUri)
					let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
					let item = {
						price,
						itemId: i.itemId.toNumber(),
						tokenId: i.tokenId.toNumber(),
						seller: i.seller,
						owner: i.owner,
						image: meta.data.image,
						name: meta.data.name,
						description: meta.data.description,
					}
					return item
				})
			)
			// const test = await tokenContract.totalSupply()
			// console.log('Total Supply: ')
			// console.log(test)

			setNfts(items)
			setLoadingState('loaded')
		} catch (error) {
			console.log(error)
			return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
		}
	}

	async function buyNft(nft) {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		// const provider = new ethers.providers.Web3Provider(connection)
		const provider = new ethers.providers.Web3Provider(web3.currentProvider)

		const signer = provider.getSigner()
		const contract = new ethers.Contract(
			marketContractAddress,
			Market.abi,
			signer
		)

		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

		const transaction = await contract.buyItem(nft.itemId, { value: price })

		// const transaction = await contract.createMarketSale(
		// 	nftContractAddress,
		// 	nft.tokenId,
		// 	{ value: price }
		// )
		await transaction.wait()
		loadNFTs()
	}

	if (loadingState === 'loaded' && !nfts.length)
		return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>

	return (
		<Layout>
			<div className="flex justify-center">
				<div className="px-4" style={{ maxWidth: '1600px' }}>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
						{nfts.map((nft, i) => (
							<div
								key={i}
								className="border shadow rounded-xl overflow-hidden"
							>
								<img src={nft.image} />
								<div className="p-4">
									<p
										style={{ height: '64px' }}
										className="text-4xl font-semibold"
									>
										{nft.name}
									</p>
									<div
										style={{
											height: '70px',
											overflow: 'hidden',
										}}
									>
										<p className="text-lg text-blue-800">
											{nft.description}
										</p>
									</div>
								</div>
								<div className="p-4 bg-slate-500">
									<p className="text-2xl font-bold text-white">
										{nft.price} ETH
									</p>
									<button
										className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded hover:bg-blue-400"
										onClick={() => buyNft(nft)}
									>
										Buy
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	)
}

// NFTMarket.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
