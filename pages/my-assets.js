import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import getConfig from 'next/config'

import { nftContractAddress, marketContractAddress } from '../config'

import NFT from '../artifacts/contracts/working/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/working/NFTMarket.sol/NFTMarket.json'
import Layout from '../components/layout'

// import Web3 from 'web3'

const Web3 = require('web3')

export default function MyAssets() {
	// const web3 = new Web3(window.ethereum)
	const web3 = new Web3(process.env.INFURA_MUMBAI_URL)
	// console.log(process.env.ALCHEMY_MUMBAI_URL)

	const [nfts, setNfts] = useState([])
	const [loadingState, setLoadingState] = useState('not-loaded')
	useEffect(() => {
		loadNFTs()
	}, [])

	// const { env } = getConfig()
	// console.log(env.INFURA_MUMBAI_URL)

	async function list() {}

	async function unlist() {}

	async function loadNFTs() {
		// const contract = new web3.eth.Contract(NFT.abi, nftContractAddress)
		// const walletAddress =
		let accounts
		let nftArray = []

		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()

		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum object: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		try {
			accounts = await ethereum.request({ method: 'eth_accounts' })

			if (accounts.length !== 0) {
				console.log('Found authorized Account: ', accounts[0])
			} else {
				console.log('No Wallet found. Connect Wallet')
			}
		} catch (error) {
			console.error(error)
		}

		// TODO: Return Promise, try it later
		// let signerAddress = signer.getAddress()
		// console.log('signer address: ', signerAddress)
		// // console.log(address)
		// // address.then(() => {
		// // 	console.log(address)
		// // })

		// // signerAddress.then((i) => {
		// // 	console.log(i)
		// // })

		const marketContract = new ethers.Contract(
			marketContractAddress,
			Market.abi,
			signer
		)
		const tokenContract = new ethers.Contract(
			nftContractAddress,
			NFT.abi,
			signer
		)

		console.log(tokenContract)
		const ownedNFT = await tokenContract
			.balanceOf(accounts[0])
			.then((v) => v.toNumber())
		console.log(`The amount of NFT this user own: ${ownedNFT}`)

		const totalSupply = await tokenContract.totalSupply().then((v) => {
			return v.toNumber()
		})
		console.log('total supply: ', totalSupply)

		for (let i = 0; i < totalSupply; i++) {
			let tokenId = (
				await tokenContract.tokenOfOwnerByIndex(accounts[0], i)
			).toNumber()
			let tokenURI = await tokenContract.tokenURI(tokenId)
			console.log(`Token ID: ${tokenId}`)
			console.log(`Token URI: ${tokenURI}`)

			// redirection
			const metadataUri = await fetch(tokenURI)
				.then((response) => {
					// console.log(res)
					// console.log(response)
					// let res = JSON.stringify(response.url)
					// res = JSON.parse(res)
					// return res
					// return response.json()
					console.log('metadataUri run:', i)

					return response.url
				})
				.catch((error) => console.error(error))

			// response.json()

			// console.log(response)
			console.log(metadataUri)

			// TODO: Know why not working?
			// const metadata = await fetch(metadataUri)
			// 	.then((res) => {
			// 		console.log(res.json())
			// 		return res.json()
			// 	})
			// 	.catch((err) => console.error(err))

			try {
				const metadata = await fetch(metadataUri).then((res) => res.json())
				console.log(metadata)

				let item = {
					tokenId: tokenId,
					name: metadata['name'],
					description: metadata['description'],
					image: metadata.image,
				}
				console.log(item)
				console.log('metadata run:', i)

				nftArray.push(item)

				// return item
			} catch (e) {
				console.error(e)
				return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
			}
		}
		setNfts(nftArray)
		setLoadingState('loaded')

		// // const nftContract = new web3.eth.Contract(NFT.abi, nftContractAddress)
		// // const callData1 = tokenContract.ownerOf(1).encodeABI();
		// // const callData1 = nftContract.methods['ownerOf'](1).encodeABI()
		// // const callData2 = nftContract.methods['ownerOf'](2).encodeABI()
		// try {
		// 	// const ownerOfToken1 = await web3.eth.call({
		// 	// 	to: nftContractAddress,
		// 	// 	data: callData1,
		// 	// })
		// 	// console.log(callData1)
		// 	// console.log(ownerOfToken1)
		// 	// const nftAllBalance = await tokenContract.balanceOf()

		// 	const data = await marketContract.fetchMyNFTs()
		// 	// let owner = await tokenContract.ownerOf(0)

		// 	const items = await Promise.all(
		// 		data.map(async (i) => {
		// 			const tokenUri = await tokenContract.tokenURI(i.tokenId)
		// 			const meta = await axios.get(tokenUri)
		// 			let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
		// 			let item = {
		// 				price,
		// 				tokenId: i.tokenId.toNumber(),
		// 				seller: i.seller,
		// 				owner: i.owner,
		// 				image: meta.data.image,
		// 			}
		// 			return item
		// 		})
		// 	)
		// 	setNfts(items)
		// 	setLoadingState('loaded')
		// 	console.log(owner)
		// } catch (error) {
		// 	console.log(error)
		// 	return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
		// }

		// // const callData3 = nftContract.methods['ownerOf'](3).encodeABI()

		// // console.log(callData2)
		// // console.log(multicallAddress)
		// // console.log(Multicall.abi)

		// // TODO: Localhost
		// // const multicallContract = new web3.eth.Contract(Multicall.abi, multicallAddress)
		// // const multicallArgs = [
		// // 	{
		// // 		target: nftContract,
		// // 		callData: callData1,
		// // 	},
		// // 	{
		// // 		target: nftContract,
		// // 		callData: callData2,
		// // 	},
		// // ]
		// // const ownersOf = await multicallContract.methods['aggregate'](multicallArgs).call()
		// // console.log(ownersOf)

		// // const multicallAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
		// // const multicallAbi = [
		// // 	{
		// // 		constant: false,
		// // 		inputs: [
		// // 			{
		// // 				components: [
		// // 					{ name: 'target', type: 'address' },
		// // 					{ name: 'callData', type: 'bytes' },
		// // 				],
		// // 				name: 'calls',
		// // 				type: 'tuple[]',
		// // 			},
		// // 		],
		// // 		name: 'aggregate',
		// // 		outputs: [
		// // 			{ name: 'blockNumber', type: 'uint256' },
		// // 			{ name: 'returnData', type: 'bytes[]' },
		// // 		],
		// // 		payable: false,
		// // 		stateMutability: 'nonpayable',
		// // 		type: 'function',
		// // 	},
		// // ]

		// // const balance = await tokenContract.balanceOf(signerAddress)
		// // console.log(balance.toNumber())

		// // console.log(tokenContract.methods.tokenOfOwnerByIndex(signerAddress, 0).call())
	}
	if (loadingState === 'loaded' && !nfts.length)
		return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>

	return (
		<Layout>
			<div className="flex justify-center">
				<div className="p-4">
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
									<p className="text-m font-bold">
										{nft.description}
									</p>
								</div>

								<div className="grid grid-cols-2">
									<button
										onClick={list}
										className="font-bold mt-4 text-2xl bg-blue-400 hover:scale-102 transition duration-500 ease-in-out hover:bg-blue-800 text-white rounded-lg p-4 shadow-lg"
									>
										List
									</button>
									<button
										onClick={unlist}
										className="font-bold mt-4 text-2xl bg-teal-800 hover:scale-102 transition duration-500 ease-in-out hover:bg-teal-500 text-white rounded-lg p-4 shadow-lg"
									>
										Unlist
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

// MyAssets.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
