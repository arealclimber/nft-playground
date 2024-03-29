import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import getConfig from 'next/config';
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { nftContractAddress, marketContractAddress } from '../utils/config';
import NFT from '../utils/NFT.json';
import Market from '../utils/Market.json';

// TODO: turn imports into environment variables instead of the relative file path because of not-working build function on Vercel
// import NFT from '../artifacts/contracts/working/NFT.sol/NFT.json';
// import Market from '../artifacts/contracts/working/NFTMarket.sol/NFTMarket.json';
import Layout from '../components/Layout';

import Web3 from 'web3';
import Loading from '../components/Loading';

// const Web3 = require('web3');

// TODO: List and unlist function
export default function MyAssets() {
	// const web3 = new Web3(window.ethereum)
	const web3 = new Web3(process.env.INFURA_MUMBAI_URL);
	// console.log(process.env.ALCHEMY_MUMBAI_URL)

	const router = useRouter();
	const [nfts, setNfts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [listingState, setListingState] = useState(false);
	const [priceInput, setPriceInput] = useState(0);

	useEffect(() => {
		loadNFTs();
	}, []);

	// const { env } = getConfig()
	// console.log(env.INFURA_MUMBAI_URL)

	// TODO: 1. Set approval 2. Put the item on the market
	// TODO: Check if item already existed

	const handleChange = (e) => {
		const { value } = e.target;
		setPriceInput(value);
		console.log('price input:', value);
	};

	async function list(nft) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const marketContract = new ethers.Contract(
			marketContractAddress,
			Market,
			signer
		);
		const tokenContract = new ethers.Contract(nftContractAddress, NFT, signer);

		const price = ethers.utils.parseUnits('0.01', 'ether');

		// Approve Market
		let transaction = await tokenContract.approve(
			marketContractAddress,
			nft.tokenId
		);
		let tx = await transaction.wait();
		console.log(`The tx: ${tx}`);

		// List NFT on Market
		transaction = await marketContract.addItemToMarket(
			nft.tokenId,
			price,
			nftContractAddress
		);
		tx = await transaction.wait();
		let event = tx.events[0];
		console.log(event);
		let value = event.args[2];
		if (value) {
			toast.success('Success to put NFT on Market!', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}

		router.push('/market');

		// loadNFTs()
	}

	async function unlist(nft) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const contract = new ethers.Contract(marketContractAddress, Market, signer);

		// FIXME: Temporary cheat
		const transaction = await contract.unlistItem(
			nft.tokenId,
			nft.tokenId,
			nftContractAddress
		);

		console.log(`Unlist transaction: ${transaction}`);

		const tx = await transaction.wait(); // The tx: [object Object]
		const event = tx.events[0];

		console.log(`Unlist tx: ${tx}`);
		console.log(`Unlist tx.events[0]: ${event}`);
		loadNFTs();
		// const tokenContract = new ethers.Contract(nftContractAddress, NFT, signer);
		// console.log(`market contract signer${marketContract.signer}`); // [object Object]
		// console.log(`market contract signer${JSON.parse(marketContract.signer)}`);
		// itemsForSale[itemId];

		// let transaction = await marketContract.unlistItem(
		// 	nft.id,
		// 	nft.tokenId,
		// 	nftContractAddress
		// );
		// console.log(`Unlist item transaction: ${transaction}`);
		// let tx = await transaction.wait();
		// console.log(`After waiting unlist-item transaction: ${tx}`);
		// let event = tx.events[0];
		// console.log(event);
	}

	async function loadItems(tokenContract, marketContract) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		try {
			const data = await marketContract.fetchMarketItems();
			// Get the NFT array populated with metadata (IPFS in this case)
			console.log(`data: ${data}`);
			const items = await Promise.all(
				data
					.filter((item) => item.isOnSale === true)
					.map(async (i) => {
						const tokenUri = await tokenContract.tokenURI(i.tokenId);
						const meta = await axios.get(tokenUri);
						let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
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

			return items;
		} catch (error) {
			console.error(error);
		}
	}

	async function loadNFTs() {
		setLoading(true);
		// const contract = new web3.eth.Contract(NFT, nftContractAddress)
		// const walletAddress =
		let accounts;
		let nftArray = [];

		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const { ethereum } = window;
		if (ethereum) {
			console.log('Got the ethereum object: ', ethereum);
		} else {
			console.log('No Wallet found. Connect Wallet');
		}

		try {
			accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				console.log('Found authorized Account: ', accounts[0]);
			} else {
				console.log('No Wallet found. Connect Wallet');
			}
		} catch (error) {
			console.error(error);
		}

		// Return Promise=> use `await`
		let signerAddress = await signer.getAddress();
		console.log('signer address: ', signerAddress);

		const marketContract = new ethers.Contract(
			marketContractAddress,
			Market,
			signer
		);

		const tokenContract = new ethers.Contract(nftContractAddress, NFT, signer);
		console.log(tokenContract);
		const ownedNFT = await tokenContract
			.balanceOf(accounts[0])
			.then((v) => v.toNumber());
		console.log(`The amount of NFT this user own: ${ownedNFT}`);

		let marketItems = await loadItems(tokenContract, marketContract);
		console.log('marketItems: ', marketItems);

		// const totalSupply = await tokenContract.totalSupply().then((v) => {
		// 	return v.toNumber();
		// });

		const totalSupply = (await tokenContract.totalSupply()).toNumber();
		console.log('total supply: ', totalSupply);

		for (let i = 0; i < ownedNFT; i++) {
			let tokenId = (
				await tokenContract.tokenOfOwnerByIndex(accounts[0], i)
			).toNumber();

			let tokenURI = await tokenContract.tokenURI(tokenId);

			// let tokenItemId = await marketContract.itemsForSale;

			let approvedAddress = await tokenContract.getApproved(tokenId);

			console.log(`Token ID: ${tokenId}`);
			console.log('Token ', tokenId, 'approved by:', approvedAddress);
			console.log(`Token URI: ${tokenURI}`);
			// console.log(`Token Item ID: ${tokenItemId}`);

			// redirection
			const metadataUri = await fetch(tokenURI)
				.then((response) => {
					// console.log(res)
					// console.log(response)
					// let res = JSON.stringify(response.url)
					// res = JSON.parse(res)
					// return res
					// return response.json()
					console.log('metadataUri run:', i);

					return response.url;
				})
				.catch((error) => console.error(error));

			console.log(metadataUri);

			// response.json()

			// console.log(response)

			// TODO: Know why not working?
			// const metadata = await fetch(metadataUri)
			// 	.then((res) => {
			// 		console.log(res.json())
			// 		return res.json()
			// 	})
			// 	.catch((err) => console.error(err))

			try {
				const metadata = await fetch(metadataUri).then((res) => res.json());
				console.log(metadata);

				let item = {
					tokenId: tokenId,
					name: metadata['name'],
					description: metadata['description'],
					image: metadata.image,
				};
				console.log(item);
				console.log('metadata run:', i);

				nftArray.push(item);

				// return item
			} catch (e) {
				console.error(e);
				return <h1 className="py-10 px-20 text-3xl">No assets owned</h1>;
			}
		}
		setNfts(nftArray);
		setLoading(false);

		// // const nftContract = new web3.eth.Contract(NFT, nftContractAddress)
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
		// // console.log(Multicall)

		// // TODO: artifact can used in Localhost, it's needed to import ABI and deployed contract address
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
	if (!loading && !nfts.length) {
		return (
			<div className="p-4">
				<h1 className="text-3xl font-bold py-2 text-blue-200">My NFTs</h1>
				<h1 className="py-10 px-20 text-3xl">No assets owned</h1>
			</div>
		);
	}

	// TODO: Loading ui
	// TODO: Detect if the NFT is on sale then display Unlist btn, otherwise displaying List btn
	return (
		<Layout>
			<div className="p-4">
				<h1 className="text-3xl font-bold py-2 text-blue-200">My NFTs</h1>
			</div>


			{loading ? (
				<Loading />
			) : (
				<div className="flex justify-start">
					<div className="p-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
							{nfts.map((nft, i) => (
								<div key={i} className="border shadow rounded-xl overflow-hidden">
									<div className="container h-72 w-72 relative">
										<Image
											className="rounded mt-4"
											layout="fill"
											src={nft.image}
											alt="image"
										/>
									</div>
									<div className="p-4 bg-black">
										<p className="text-2xl font-bold text-white">{nft.name}</p>
										<p className="text-m font-bold pt-4">{nft.description}</p>
									</div>
									{/* <form> */}
									<div>
										{/* <input
											type="number"
											placeholder="Ether"
											onChange={handleChange}
											value={priceInput}
											className="border rounded px-3 py-1 mr-2 h-10 w-36 text-right text-black"
										/> */}

									</div>
									{/* TODO: Check if item is on sale and change the Btn to List or Unlist accordingly */}
									<div className="grid">
										<button
											// onClick={list(nft)}
											onClick={() => list(nft)}
											className="font-bold mt-4 text-2xl bg-blue-800 hover:scale-102 transition duration-500 ease-in-out hover:bg-blue-600 text-white rounded-lg p-4 shadow-lg"
										>
											List
										</button>
										<button
											onClick={() => unlist(nft)}
											className="font-bold mt-4 text-2xl bg-teal-800 hover:scale-102 transition duration-500 ease-in-out hover:bg-teal-600 text-white rounded-lg p-4 shadow-lg"
										>
											Unlist
										</button>
										{/* {nft.tokenId === 0 ? (
										<button
											// onClick={list(nft)}
											onClick={() => list(nft)}
											className="font-bold mt-4 text-2xl bg-blue-800 hover:scale-102 transition duration-500 ease-in-out hover:bg-blue-600 text-white rounded-lg p-4 shadow-lg"
										>
											List
										</button>
									) : (
										<button
											onClick={() => unlist(nft)}
											className="font-bold mt-4 text-2xl bg-teal-800 hover:scale-102 transition duration-500 ease-in-out hover:bg-teal-600 text-white rounded-lg p-4 shadow-lg"
										>
											Unlist
										</button>
									)} */}
									</div>
									{/* </form> */}
								</div>
							))}
						</div>
						<ToastContainer
							position="top-right"
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
						/>

					</div>
				</div>
			)}
		</Layout>
	);
}

// MyAssets.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
