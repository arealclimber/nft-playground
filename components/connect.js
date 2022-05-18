import { useConnect } from 'wagmi'

export function Profile() {
	const { connect, connectors, error, isConnecting, pendingConnector } = useConnect()

	return (
		<div>
			{connectors.map((connector) => (
				<button disabled={!connector.ready} key={connector.id} onClick={() => connect(connector)}>
					{connector.name}
					{!connector.ready && ' (unsupported)'}
					{isConnecting && connector.id === pendingConnector?.id && ' (connecting)'}
				</button>
			))}

			{error && <div>{error.message}</div>}
		</div>
	)
}
