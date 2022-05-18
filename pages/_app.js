import '../styles/globals.css'
import Link from 'next/link'
import { Provider, chain, createClient, defaultChains } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import PageHead from '../components/head'

const alchemyId = process.env.ALCHEMY_MUMBAI_ID

const chains = defaultChains
const defaultChain = chain.mainnet

// Set up connectors
const client = createClient({
	autoConnect: true,
	connectors({ chainId }) {
		const chain = chains.find((x) => x.id === chainId) ?? defaultChain
		const rpcUrl = chain.rpcUrls.alchemy ? `${chain.rpcUrls.alchemy}/${alchemyId}` : chain.rpcUrls.default
		return [
			new MetaMaskConnector({ chains }),
			new CoinbaseWalletConnector({
				chains,
				options: {
					appName: 'NFT-Playground',
					chainId: chain.id,
					jsonRpcUrl: rpcUrl,
				},
			}),
			new WalletConnectConnector({
				chains,
				options: {
					qrcode: true,
					rpc: { [chain.id]: rpcUrl },
				},
			}),
			new InjectedConnector({
				chains,
				options: { name: 'Injected' },
			}),
		]
	},
})

export default function MyApp({ Component, pageProps }) {
	// const getLayout = Component.getLayout || ((page) => page)

	// return getLayout(<Component {...pageProps} />)
	return (
		<Provider client={client}>
			<Component {...pageProps} />
		</Provider>
	)
}
