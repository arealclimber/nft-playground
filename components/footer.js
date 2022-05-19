import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Footer = () => {
	return (
		<footer className="flex items-center justify-between flex-wrap bg-blue-900 p-6 absolute-footer">
			<p>Test</p>
			<Link href="https://github.com/arealclimber/nft-playground">
				<a>GitHub</a>
			</Link>
			<p>Test</p>
			<p>Test</p>
			<p>Test</p>
		</footer>
	)
}
export default Footer
