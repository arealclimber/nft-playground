// import { Provider, chain, createClient, defaultChains } from 'wagmi'
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
// import { InjectedConnector } from 'wagmi/connectors/injected'
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// // import { useConnect } from 'wagmi'
// import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

// const alchemyId = process.env.ACCOUNT_PRIVATE_KEY

// const chains = defaultChains
// const defaultChain = chain.mainnet

// const client = createClient({
// 	autoConnect: true,
// 	connectors({ chainId }) {
// 		const chain = chains.find((x) => x.id === chainId) ?? defaultChain
// 		const rpcUrl = chain.rpcUrls.alchemy ? `${chain.rpcUrls.alchemy}/${alchemyId}` : chain.rpcUrls.default
// 		return [
// 			new MetaMaskConnector({ chains }),
// 			new CoinbaseWalletConnector({
// 				chains,
// 				options: {
// 					appName: 'wagmi',
// 					chainId: chain.id,
// 					jsonRpcUrl: rpcUrl,
// 				},
// 			}),
// 			new WalletConnectConnector({
// 				chains,
// 				options: {
// 					qrcode: true,
// 					rpc: { [chain.id]: rpcUrl },
// 				},
// 			}),
// 			new InjectedConnector({
// 				chains,
// 				options: { name: 'Injected' },
// 			}),
// 		]
// 	},
// })

// export default function Connect() {
// 	const { data: account } = useAccount()
// 	const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address })
// 	const { data: ensName } = useEnsName({ address: account?.address })
// 	const { connect, connectors, error, isConnecting, pendingConnector } = useConnect()
// 	const { disconnect } = useDisconnect()

// 	if (account) {
// 		return (
// 			<div>
// 				<img src={ensAvatar} alt="ENS Avatar" />
// 				<div>{ensName ? `${ensName} (${account.address})` : account.address}</div>
// 				<div>Connected to {account.connector.name}</div>
// 				<button onClick={disconnect}>Disconnect</button>
// 			</div>
// 		)
// 	}

// 	return (
// 		<div>
// 			{connectors.map((connector) => (
// 				<button disabled={!connector.ready} key={connector.id} onClick={() => connect(connector)}>
// 					{connector.name}
// 					{!connector.ready && ' (unsupported)'}
// 					{isConnecting && connector.id === pendingConnector?.id && ' (connecting)'}
// 				</button>
// 			))}

// 			{error && <div>{error.message}</div>}
// 		</div>
// 	)
// }
