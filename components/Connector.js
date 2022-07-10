import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Head from 'next/head';
import { Alert, Success, Fail } from './Alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function Connector() {
	const router = useRouter();

	const rinkebyChainId = '0x4';
	const mumbaiChainId = '0x13881';
	const neededCahinId = mumbaiChainId;

	const infuraId = process.env.INFURA_MUMBAI_URL;

	const [currentAccount, setCurrentAccount] = useState('');
	const [correctNetwork, setCorrectNetwork] = useState(false);
	const [provider, setProvider] = useState([]);
	const [library, setLibrary] = useState([]);

	async function isWalletConnected() {
		const { ethereum } = window;
		if (ethereum) {
			console.log('Got the ethereum object: ', ethereum);
		} else {
			console.log('No Wallet found. Connect Wallet');
		}

		try {
			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				console.log('Found authorized Account: ', accounts[0]);
				setCurrentAccount(accounts[0]);
			} else {
				console.log('No Wallet found. Connect Wallet');

				toast.warn('Make sure you have Wallet Connected', {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			}
		} catch (error) {
			console.error(error);
			toast.error(`${error.message}`, {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	}

	async function isCorrectNetwork() {
		try {
			const { ethereum } = window;
			let chainId = await ethereum.request({ method: 'eth_chainId' });
			console.log('Connect to chain: ' + chainId);

			if (chainId !== neededCahinId) {
				setCorrectNetwork(false);

				toast.warn('Please change to Mumbai Testnet !', {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			} else {
				setCorrectNetwork(true);

				toast.success('Connect to Mumbai !', {
					position: 'top-right',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});

				// router.reload(window.location.pathname);
			}
		} catch (error) {
			console.error(error);

			toast.error(`${error.message}`, {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	}

	useEffect(() => {
		isWalletConnected();
		isCorrectNetwork();
	}, []);

	const providerOptions = {
		injected: {
			display: {
				name: 'Injected',
				description: 'Connect with the provider in your Browser',
			},
			package: null,
		},
		walletconnect: {
			package: WalletConnectProvider, // required
			options: {
				infuraId: 'INFURA_ID', // required
			},
		},
		coinbasewallet: {
			package: CoinbaseWalletSDK, // Required
			options: {
				appName: 'NFT Playground', // Required
				infuraId: 'INFURA_ID', // Required
				rpc: '', // Optional if `infuraId` is provided; otherwise it's required
				chainId: neededCahinId, // Optional. It defaults to 1 if not provided
				darkMode: false, // Optional. Use dark theme, defaults to false
			},
		},
	};

	// FIXME: Error: accounts received is empty [Coinbasewallet cancelled]
	// FIXME: Error: User closed modal [walletConnect]
	// FIXME: If the wallet waited to unlock, it throws `user rejected error`
	// FIXME: In the page showing individual assets, it throws `pauseOnFocusLoss` ERROR
	const connectWallet = async () => {
		const web3Modal = new Web3Modal({
			providerOptions,
			cacheProvider: true,
			theme: {
				background: 'rgb(39, 49, 56)',
				main: 'rgb(199, 199, 199)',
				secondary: 'rgb(136, 136, 136)',
				border: 'rgba(195, 195, 195, 0.14)',
				hover: 'rgb(16, 26, 32)',
			},
		});

		// const walletProvider = new WalletConnectProvider({
		// 	infuraId: infuraId,
		// })
		// await walletProvider.enable().catch(reject)

		try {
			const provider = await web3Modal.connect();
			const library = new ethers.providers.Web3Provider(provider);
			setProvider(provider);
			setLibrary(library);

			const walletProvider = new WalletConnectProvider({
				infuraId: infuraId,
			});
			await walletProvider.enable().catch(reject);
		} catch (error) {
			console.error(error);
		}

		// try {
		// 	const walletProvider = new WalletConnectProvider({
		// 		infuraId: infuraId,
		// 	})
		// 	await walletProvider.enable()
		// } catch (err) {
		// 	console.error(err)
		// }
	};

	// try {
	// 	const provider = new WalletConnectProvider({
	// 	infuraId: 'c4f79cc821944d9680842e34466bfbd',
	// 	});
	// 	await provider.enable();
	// 	} catch (error) {
	// 	console.log(error);
	// 	}

	function toastPopup() {
		const notify = () => {
			toast('Default Notification !');

			toast.success('Connect to Mumbai !', {
				position: toast.POSITION.TOP_RIGHT,
			});

			toast.warn('Please change to Mumbai Testnet !', {
				position: toast.POSITION.TOP_CENTER,
			});
		};

		return (
			<div>
				<button onClick={notify}>Notify!</button>
				<ToastContainer />
			</div>
		);
	}

	// const notify = () => {
	// 	// toast('Default Notification !')

	// 	toast.success('Connect to Mumbai !', {
	// 		position: toast.POSITION.TOP_RIGHT,
	// 	})

	// 	// toast.warn('Please change to Mumbai Testnet !', {
	// 	// 	position: toast.POSITION.TOP_CENTER,
	// 	// })
	// }

	return (
		<div className="p-4">
			{currentAccount === '' ? (
				<button
					className="font-bold mt-4 text-2xl bg-blue-500 hover:scale-110 transition duration-500 ease-in-out hover:bg-blue-600 text-white rounded-lg p-4 shadow-lg"
					onClick={connectWallet}
				>
					Connect Wallet
				</button>
			) : correctNetwork ? (
				<div className="flex flex-col justify-center items-center mb-20 font-bold text-xl gap-y-3">
					{/* <Success text="Connect to Mumbai." /> */}
					<ToastContainer
						position="top-right"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
					/>
				</div>
			) : (
				<div className="flex flex-col justify-center items-center mb-20 font-bold text-xl gap-y-3">
					{/* <Fail text="Please change to Mumbai Testnet." /> */}
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
			)}
		</div>
	);
}
