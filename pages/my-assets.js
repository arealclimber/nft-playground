import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import getConfig from 'next/config'

import { nftContractAddress, marketContractAddress, multicallAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import Multicall from '../artifacts/contracts/multicall.sol/Multicall.json'

// import Web3 from 'web3'

const Web3 = require('web3')

export default function MyAssets() {
	// const web3 = new Web3(window.ethereum)
	const web3 = new Web3(process.env.ALCHEMY_MUMBAI_URL)
	// console.log(process.env.ALCHEMY_MUMBAI_URL)

	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState('not-loaded')
	useEffect(() => {
		loadNFTs()
	}, [])

	// const { env } = getConfig()
	// console.log(env.ALCHEMY_MUMBAI_URL)

	async function loadNFTs() {
		// const contract = new web3.eth.Contract(NFT.abi, nftContractAddress)
		// const walletAddress =

		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		let signerAddress = signer.getAddress()
		// console.log(address)
		// address.then(() => {
		// 	console.log(address)
		// })

		// signerAddress.then((i) => {
		// 	console.log(i)
		// })

		const marketContract = new ethers.Contract(marketContractAddress, Market.abi, signer)
		const tokenContract = new ethers.Contract(nftContractAddress, NFT.abi, signer)
		const data = await marketContract.fetchMyNFTs()

		// const nftContract = new web3.eth.Contract(NFT.abi, nftContractAddress)
		// const callData1 = tokenContract.ownerOf(1).encodeABI();
		// const callData1 = nftContract.methods['ownerOf'](1).encodeABI()
		// const callData2 = nftContract.methods['ownerOf'](2).encodeABI()
		try {
			// const ownerOfToken1 = await web3.eth.call({
			// 	to: nftContractAddress,
			// 	data: callData1,
			// })
			// console.log(callData1)
			// console.log(ownerOfToken1)
			let owner = await tokenContract.ownerOf(0)
			console.log(owner)
		} catch (error) {
			console.log(error)
		}

		// const callData3 = nftContract.methods['ownerOf'](3).encodeABI()

		// console.log(callData2)
		// console.log(multicallAddress)
		// console.log(Multicall.abi)

		// TODO: Localhost
		// const multicallContract = new web3.eth.Contract(Multicall.abi, multicallAddress)
		// const multicallArgs = [
		// 	{
		// 		target: nftContract,
		// 		callData: callData1,
		// 	},
		// 	{
		// 		target: nftContract,
		// 		callData: callData2,
		// 	},
		// ]
		// const ownersOf = await multicallContract.methods['aggregate'](multicallArgs).call()
		// console.log(ownersOf)

		// const multicallAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
		// const multicallAbi = [
		// 	{
		// 		constant: false,
		// 		inputs: [
		// 			{
		// 				components: [
		// 					{ name: 'target', type: 'address' },
		// 					{ name: 'callData', type: 'bytes' },
		// 				],
		// 				name: 'calls',
		// 				type: 'tuple[]',
		// 			},
		// 		],
		// 		name: 'aggregate',
		// 		outputs: [
		// 			{ name: 'blockNumber', type: 'uint256' },
		// 			{ name: 'returnData', type: 'bytes[]' },
		// 		],
		// 		payable: false,
		// 		stateMutability: 'nonpayable',
		// 		type: 'function',
		// 	},
		// ]

		// const balance = await tokenContract.balanceOf(signerAddress)
		// console.log(balance.toNumber())

		// console.log(tokenContract.methods.tokenOfOwnerByIndex(signerAddress, 0).call())

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
				}
				return item
			})
		)
		setNfts(items)
		setLoadingState('loaded')
	}
	if (loadingState === 'loaded' && !nfts.length) return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>

	return (
		<div className="flex justify-center">
			<div className="p-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
					{nfts.map((nft, i) => (
						<div key={i} className="border shadow rounded-xl overflow-hidden">
							<img src={nft.image} className="rounded" />
							<div className="p-4 bg-black">
								<p className="text-2xl font-bold text-white">Price - {nft.price} ETH</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
