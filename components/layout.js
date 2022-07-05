import PageHead from './Head';

export default function Layout({ children }) {
	return (
		<>
			<PageHead />

			<main>{children}</main>
		</>
	);
}
