import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Layout from '../components/layout'

import { nftContractAddress, marketContractAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import Link from 'next/link'

export default function Home() {
	const [nfts, setNfts] = useState([])
	const [sold, setSold] = useState([])
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
		const tokenContract = new ethers.Contract(nftContractAddress, NFT.abi, provider)
		const marketContract = new ethers.Contract(marketContractAddress, Market.abi, provider)
		try {
			const data = await marketContract.fetchItemsCreated()
			// Get the NFT array populated with metadata (IPFS in this case)
			const items = await Promise.all(
				data.map(async (i) => {
					const tokenUri = await tokenContract.tokenURI(i.tokenId)
					const meta = await axios.get(tokenUri)
					let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
					let item = {
						price,
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
			setNfts(items)
			setLoadingState('loaded')

			const soldItems = items.filter((i) => i.sold)
			setSold(soldItems)
			setNfts(items)
			setLoadingState('loaded')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			<div className="p-4">
				{
					<div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							<Link href="/loans">
								<h2 className="text-2xl font-bold py-2 text-blue-800 hover:text-gray-500 hover:cursor-pointer">
									Fractional NFTs
								</h2>
							</Link>
							<p className="text-2xl font-bold py-2">Lend and borrow with NFT.</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							{nfts.map((nft, i) => (
								<div key={i} className="border shadow rounded-xl overflow-hidden">
									<img src={nft.image} className="rounded" />
									<div className="p-4 bg-black">
										<p className="text-2xl font-bold text-white">{nft.name}</p>

										<p className="text-2xl font-bold text-white">Price - {nft.price} ETH</p>
									</div>
								</div>
							))}
						</div>
					</div>
				}
			</div>

			<div className="p-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
					<Link href="/market">
						<h2 className="text-2xl font-bold py-2 text-blue-800 hover:text-gray-500 hover:cursor-pointer">
							NFT Marketplace
						</h2>
					</Link>
					<p className="text-2xl font-bold py-2">Buy and sell your NFT.</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
					{nfts.map((nft, i) => (
						<div key={i} className="border shadow rounded-xl overflow-hidden">
							<img src={nft.image} className="rounded" />
							<div className="p-4 bg-black">
								<p className="text-2xl font-bold text-white">{nft.name}</p>
								<p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

Home.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>
}
