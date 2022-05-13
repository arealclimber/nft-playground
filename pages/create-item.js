import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

// const client = ipfsHttpClient('https://ipfs.fleek.co/ipfs/HASH');
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

import { nftContractAddress, marketContractAddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function CreateItem() {
	const [fileUrl, setFileUrl] = useState(null);
	const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
	const router = useRouter();

	async function onChange(e) {
		const file = e.target.files[0];
		try {
			const added = await client.add(file, {
				progress: (prog) => console.log(`received: ${prog}`),
			});
			const url = `https://ipfs.infura.io:5001/api/${added.path}`;
			setFileUrl(url);
		} catch (e) {
			console.log(e);
		}
	}

	async function createItem() {
		const { name, description, price } = formInput;
		if (!name || !description || !price || !fileUrl) return;
		const data = JSON.stringify({
			name,
			description,
			image: fileUrl,
		});

		try {
			const added = await client.add(data);
			const url = `https://ipfs.infura.io:5001/api/${added.path}`;

			// after file is uploaded to IPFS, pass the URL to save it on Polygon
			createSale(url);
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	}

	async function createSale() {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		let contract = new ethers.Contract(nftContractAddress, NFT.abi, signer);
		let transaction = await contract.createToken(url);
		let tx = await transaction.wait();

		let event = tx.events[0];
		let value = event.args[2];
		let tokenId = value.toNumber();

		const price = ethers.utils.parseUnits(formInput.price, 'ether');

		contract = new ethers.Contract(marketContractAddress, Market.abi, signer);
		let listingPrice = await contract.getListingPrice();
		listingPrice = listingPrice.toString();

		transaction = await contract.createMarketItem(nftContractAddress, tokenId, price, { value: listingPrice });
		await transaction.wait();
		router.push('/');
	}

	return (
		<div className="flex justify-center">
			<div className="w-1/2 flex flex-col pb-12">
				<input
					placeholder="Asset Name"
					className="mt-8 border rounded p-4"
					onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
				/>
				<textarea
					placeholder="Asset Description"
					className="mt-8 border rounded p-4"
					onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
				/>
				<input type="file" name="Asset" className="my-4" onChange={onChange} />
				{fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
				<button
					onClick={createItem}
					className="font-bold mt-4 bg-blue-500 hover:scale-110 transition duration-500 ease-in-out hover:bg-blue-600 text-white rounded-lg p-4 shadow-lg"
				>
					Create Digital Asset
				</button>
			</div>
		</div>
	);
}