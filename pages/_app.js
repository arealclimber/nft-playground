import '../styles/globals.css'
import Link from 'next/link'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import WalletConnect from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useState } from 'react'

import { chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

const connectors = ({ chainId }) => {
	const rpcUrl = defaultChains.find((x) => x.id === chaindId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
}
// const providerOptions = {
// 	// Example with injected providers
// 	injected: {
// 		display: {
// 			logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
// 			name: 'Injected',
// 			description: 'Connect with the provider in your Browser',
// 		},
// 		package: null,
// 	},
// 	// Example with WalletConnect provider
// 	walletconnect: {
// 		display: {
// 			logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
// 			name: 'Mobile',
// 			description: 'Scan qrcode with your mobile wallet',
// 		},
// 		package: WalletConnectProvider,
// 		options: {
// 			infuraId: process.env.INFURA_MUMBAI_URL, // required
// 		},
// 	},
// }

// export const providerOptions = {
//  coinbasewallet: {
//    package: CoinbaseWalletSDK,
//    options: {
//      appName: "Web 3 Modal Demo",
//      infuraId: process.env.INFURA_KEY
//    }
//  },
//  walletconnect: {
//    package: WalletConnect,
//    options: {
//      infuraId: process.env.INFURA_KEY
//    }
//  }
// };

export default function MyApp({ Component, pageProps }) {
	// const web3Modal = new Web3Modal({
	// 	providerOptions, // required
	// })

	// const [provider, setProvider] = useState()
	// const [library, setLibrary] = useState()

	// const connectWallet = async () => {
	// 	try {
	// 		const provider = await web3Modal.connect()
	// 		const library = new ethers.providers.Web3Provider(provider)
	// 		setProvider(provider)
	// 		setLibrary(library)
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// }

	// const getLayout = Component.getLayout || ((page) => page)

	// return getLayout(<Component {...pageProps} />)
	return <Component {...pageProps} />
}
