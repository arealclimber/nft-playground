import '../styles/globals.css'
import Connector from '../components/connector'
import Link from 'next/link'

export default function MyApp({ Component, pageProps }) {
	return (
		<>
			<Connector />
			<Component {...pageProps} />
		</>
	)
}
