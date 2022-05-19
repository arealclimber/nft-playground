import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Head from 'next/head'
import { Alert, Success, Fail } from './alert'

export default function Connector() {
	const rinkebyChainId = '0x4'
	const mumbaiChainId = '0x13881'
	const neededCahinId = mumbaiChainId

	const infuraId = process.env.INFURA_MUMBAI_URL

	const [currentAccount, setCurrentAccount] = useState('')
	const [correctNetwork, setCorrectNetwork] = useState(false)
	const [provider, setProvider] = useState([])
	const [library, setLibrary] = useState([])

	async function checkIfWalletIsConnected() {
		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum object: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		try {
			const accounts = await ethereum.request({ method: 'eth_accounts' })

			if (accounts.length !== 0) {
				console.log('Found authorized Account: ', accounts[0])
				setCurrentAccount(accounts[0])
			} else {
				console.log('No Wallet found. Connect Wallet')
			}
		} catch (error) {
			console.error(error)
		}
	}

	async function checkCorrectNetwork() {
		try {
			const { ethereum } = window
			let chainId = await ethereum.request({ method: 'eth_chainId' })
			console.log('Connect to chain: ' + chainId)

			if (chainId !== neededCahinId) {
				setCorrectNetwork(false)
			} else {
				setCorrectNetwork(true)
			}
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])

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
	}

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
		})

		try {
			const provider = await web3Modal.connect()
			const library = new ethers.providers.Web3Provider(provider)
			setProvider(provider)
			setLibrary(library)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="p-4">
			{currentAccount === '' ? (
				<button
					className="text-2xl font-bold py-3 px-3 bg-[#FFFDDE] text-[#2C2891] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
					onClick={connectWallet}
				>
					Connect Wallet
				</button>
			) : correctNetwork ? (
				<div className="flex flex-col justify-center items-center mb-20 font-bold text-xl gap-y-3">
					<Success text="Connect to Mumbai." />
				</div>
			) : (
				<div className="flex flex-col justify-center items-center mb-20 font-bold text-xl gap-y-3">
					<Fail text="Please change to Mumbai Testnet." />
				</div>
			)}
		</div>
	)
}
