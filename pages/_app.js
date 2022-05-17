import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || ((page) => page)

	return getLayout(<Component {...pageProps} />)
}

export default MyApp
