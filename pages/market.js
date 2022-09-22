import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Layout from '../components/Layout';
import Image from 'next/image';

import { nftContractAddress, marketContractAddress } from '../utils/config';

import NFT from '../utils/NFT.json';
import Market from '../utils/Market.json';
// import NFT from '../artifacts/contracts/working/NFT.sol/NFT.json'
// import Market from '../artifacts/contracts/working/NFTMarket.sol/NFTMarket.json'

export default function NFTMarket() {
	const [nfts, setNfts] = useState([]);
	const [loadingState, setLoadingState] = useState('not-loaded');

	useEffect(() => {
		loadNFTs();
	}, []);

	async function loadNFTs() {
		// const web3Modal = new Web3Modal();
		// const connection = await web3Modal.connect();
		// const provider = new ethers.providers.Web3Provider(connection);
		// // const signer = provider.getSigner()

		// // const provider = new ethers.providers.JsonRpcProvider()
		// const tokenContract = new ethers.Contract(nftContractAddress, NFT, provider);
		// const marketContract = new ethers.Contract(
		// 	marketContractAddress,
		// 	Market,
		// 	provider
		// );
		// // console.log(tokenContract)

		let provider = new ethers.providers.InfuraProvider('maticmum');
		const tokenContract = new ethers.Contract(nftContractAddress, NFT, provider);
		const marketContract = new ethers.Contract(
			marketContractAddress,
			Market,
			provider
		);

		// try {
		// 	const web3Modal = new Web3Modal();
		// 	const connection = await web3Modal.connect();
		// 	provider = new ethers.providers.Web3Provider(connection);
		// 	const signer = provider.getSigner();
		// 	const signerAddress = signer.getAddress();
		// } catch (err) {
		// 	console.error(err);
		// }

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
			console.log(`data after map(): ${items}`); // [object Object],[object Object],...

			const totalNFT = (await tokenContract.totalSupply()).toNumber();
			console.log('Total Supply: ', totalNFT);
			// console.log(test)

			setNfts(items);
			setLoadingState('loaded');
		} catch (error) {
			console.error(error);
			return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
		}
	}

	async function buyNft(nft) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		// This doesn't work for we can't get Infura provider to go on transaction.
		// const provider = new ethers.providers.Web3Provider(web3.currentProvider)

		const signer = provider.getSigner();

		// // MetaMask requires requesting permission to connect users accounts
		// // Will connect to Brave Wallet?
		// await provider.send('eth_requestAccounts', [])

		// const resp = await signer
		// 	.getAddress()
		// 	.then((result) => console.log(result))
		// 	.catch((err) => console.error(err))
		// const user = await ethers.utils.getAddress(signer)
		// console.log(provider)

		// for (const account of signer) {
		// 	console.log(account.address)
		// }

		// console.log(`Signer: ${signer.getAddress}`)
		// console.log(`Window: ${window.ethereum}`)

		const contract = new ethers.Contract(marketContractAddress, Market, signer);
		console.log(contract.signer);

		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
		// console.log(`Price: ${price}`)

		const transaction = await contract.buyItem(nft.itemId, { value: price });

		// const transaction = await contract
		// 	.buyItem(nft.itemId, { value: price })
		// 	.then((res) => console.log(res))
		// 	.catch((err) => console.error(err))

		console.log(transaction);

		// const transaction = await contract.createMarketSale(
		// 	nftContractAddress,
		// 	nft.tokenId,
		// 	{ value: price }
		// )
		const tx = await transaction.wait();
		const event = tx.events[0];
		console.log(`Transaction: ${tx}`);
		console.log(`Event: ${event}`);

		loadNFTs();
	}

	if (loadingState === 'loaded' && !nfts.length)
		return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

	return (
		<Layout>
			<div className="p-4">
				<h1 className="text-3xl font-bold py-2 text-blue-200">Market</h1>
			</div>
			<div className="flex justify-start">
				<div className="px-4" style={{ maxWidth: '1600px' }}>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
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
								<div className="p-4">
									<p style={{ height: '64px' }} className="text-4xl ">
										{nft.name}
									</p>
									<div
										style={{
											height: '70px',
											overflow: 'hidden',
										}}
										className="pt-4"
									>
										<p className="text-lg text-blue-300">{nft.description}</p>
									</div>
								</div>
								<div className="p-4 ">
									<p className="text-2xl font-bold text-red-300">
										{nft.price} MATIC
									</p>
									<button
										className="mt-4 w-full bg-blue-400 text-black font-bold text-2xl py-2 px-12 rounded hover:bg-blue-500 "
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
	);
}

// NFTMarket.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
