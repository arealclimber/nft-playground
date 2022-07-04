import { useState } from 'react';
import { ethers } from 'ethers';
import { create, CID } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import { Buffer } from 'buffer';
import Web3Modal from 'web3modal';
import Layout from '../components/layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const client = ipfsHttpClient('https://ipfs.fleek.co/ipfs/HASH');
// 'https://ipfs.infura.io:5001/api/v0'
const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;
const auth = `Basic ${Buffer.from(projectIdAndSecret).toString('base64')}`;
// Buffer.from(projectIdAndSecret).toString('base64')
// authorization: `Basic ${Buffer.from(projectIdAndSecret).toString('base64')}`,
const client = create({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
});

import { nftContractAddress, marketContractAddress } from '../config';
import NFT from '../NFT.json';
import Market from '../Market.json';

// import NFT from '../artifacts/contracts/working/NFT.sol/NFT.json';
// import Market from '../artifacts/contracts/working/NFTMarket.sol/NFTMarket.json';

export default function createNFT() {
	const [fileUrl, setFileUrl] = useState(null);
	const [formInput, updateFormInput] = useState({
		price: '',
		name: '',
		description: '',
	});
	const [txError, setTxError] = useState(null);

	const router = useRouter();

	async function onChange(e) {
		// const { cid } = client.add('Hello world')
		// console.info(cid)

		const file = e.target.files[0];
		try {
			const added = await client.add(file, {
				progress: (prog) => console.log(`received: ${prog}`),
			});

			// const url = `https://ipfs.infura.io:5001/api/v0/cat?arg=${added.path}`
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;

			client.pin.add(added.path).then((res) => {
				console.log(res);
				setFileUrl(url);
			});
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	}

	async function createNFTItem() {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		const { name, description } = formInput;
		if (!name || !description || !fileUrl) return;
		/* first, upload to IPFS */
		const data = JSON.stringify({
			name,
			description,
			image: fileUrl,
		});

		try {
			const added = await client.add(data);
			// const url = `https://ipfs.infura.io:5001/api/v0/cat?arg=${added.path}`
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;

			// after file is uploaded to IPFS, pass the URL to save it on Polygon
			create(url);

			// let nftContract = new ethers.Contract(nftContractAddress, NFT, signer)
			// let transaction = await nftContract.createToken(url)
			// let tx = await transaction.wait()

			// if (tx) {
			// 	toast.success('Success!', {
			// 		position: 'top-right',
			// 		autoClose: 3000,
			// 		hideProgressBar: false,
			// 		closeOnClick: true,
			// 		pauseOnHover: true,
			// 		draggable: true,
			// 		progress: undefined,
			// 	})
			// }
		} catch (error) {
			console.log('Error uploading file: ', error);
		}
	}

	async function create(url) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		let nftContract = new ethers.Contract(nftContractAddress, NFT, signer);
		let transaction = await nftContract.createToken(url);
		let tx = await transaction.wait();

		let event = tx.events[0];
		console.log(event);
		let value = event.args[2];
		let tokenId = value.toNumber();

		if (tokenId) {
			toast.success('Success!', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}

		router.push('/my-assets');

		// const price = ethers.utils.parseUnits(formInput.price, 'ether')

		// let marketContract = new ethers.Contract(marketContractAddress, Market, signer)

		// transaction = await marketContract.addItemToMarket(tokenId, price, nftContractAddress)
		// await transaction.wait()

		// if (transaction) {
		// 	toast.success('Success!', {
		// 		position: 'top-right',
		// 		autoClose: 3000,
		// 		hideProgressBar: false,
		// 		closeOnClick: true,
		// 		pauseOnHover: true,
		// 		draggable: true,
		// 		progress: undefined,
		// 	})
	}

	async function createAndSell(url) {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();

		let nftContract = new ethers.Contract(nftContractAddress, NFT, signer);
		let transaction = await nftContract.createToken(url);
		let tx = await transaction.wait();

		let event = tx.events[0];
		console.log(event);
		let value = event.args[2];
		let tokenId = value.toNumber();

		const price = ethers.utils.parseUnits(formInput.price, 'ether');

		let marketContract = new ethers.Contract(
			marketContractAddress,
			Market,
			signer
		);

		// TODO: The token ID of the fresh NFT
		// Maybe in `tx` of the creating process
		transaction = await tokenContract.approve(
			marketContractAddress,
			nft.tokenId
		);

		tx = await transaction.wait();
		console.log(`The tx: ${tx}`);

		transaction = await marketContract.addItemToMarket(
			tokenId,
			price,
			nftContractAddress
		);
		await transaction.wait();

		if (transaction) {
			toast.success('Success!', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}

		// try {
		// 	let nftContract = new ethers.Contract(nftContractAddress, NFT, signer)
		// 	let transaction = await nftContract.createToken(url)
		// 	let tx = await transaction.wait()

		// 	let event = tx.events[0]
		// 	console.log(event)
		// 	let value = event.args[2]
		// 	let tokenId = value.toNumber()

		// 	const price = ethers.utils.parseUnits(formInput.price, 'ether')

		// 	let marketContract = new ethers.Contract(marketContractAddress, Market, signer)

		// 	transaction = await marketContract.addItemToMarket(tokenId, price, nftContractAddress)
		// 	await transaction.wait()

		// 	if (transaction) {
		// 		toast.success('Success!', {
		// 			position: 'top-right',
		// 			autoClose: 3000,
		// 			hideProgressBar: false,
		// 			closeOnClick: true,
		// 			pauseOnHover: true,
		// 			draggable: true,
		// 			progress: undefined,
		// 		})
		// 	}
		// } catch (error) {
		// 	console.error(error)
		// }

		// console.log(tx)
		// console.log(tx.value)
		// console.log(tx.events)

		// let listingPrice = await marketContract.getListingPrice()
		// listingPrice = listingPrice.toString()

		// transaction = await marketContract.addItemToMarket(nftContractAddress, tokenId, price, { value: listingPrice })

		router.push('/market');
	}

	return (
		<Layout>
			<div className="flex justify-center">
				<div className="w-1/2 flex flex-col pb-12">
					<input
						placeholder="Asset Name"
						className="mt-8 border rounded p-4 text-black text-lg"
						onChange={(e) =>
							updateFormInput({ ...formInput, name: e.target.value })
						}
					/>
					<textarea
						placeholder="Asset Description"
						className="mt-8 border rounded p-4 text-black text-lg"
						onChange={(e) =>
							updateFormInput({
								...formInput,
								description: e.target.value,
							})
						}
					/>
					{/* <input
						placeholder="Asset Price in Eth (Optional)"
						className="mt-2 border rounded p-4 text-black text-lg"
						onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
					/> */}

					<input
						type="file"
						name="Asset"
						className="my-4 text-lg"
						onChange={onChange}
					/>

					{fileUrl && (
						<img className="rounded mt-4" width="350" src={fileUrl} />
					)}

					<button
						onClick={createAndSell}
						className="font-bold mt-4 text-2xl bg-blue-500 hover:scale-110 transition duration-500 ease-in-out hover:bg-blue-600 text-white rounded-lg p-4 shadow-lg"
					>
						Create and Sell NFT
					</button>

					<button
						onClick={createNFTItem}
						className="font-bold mt-4 text-2xl bg-blue-500 hover:scale-110 transition duration-500 ease-in-out hover:bg-blue-600 text-white rounded-lg p-4 shadow-lg"
					>
						Simply Create NFT
					</button>
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
		</Layout>
	);
}

// createNFT.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
