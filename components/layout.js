import PageHead from './head'

export default function Layout({ children }) {
	return (
		<>
			<PageHead />
			<main>{children}</main>
		</>
	)
}
