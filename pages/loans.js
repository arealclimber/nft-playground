import Layout from '../components/Layout';

export default function Loan() {
	return (
		<Layout>
			<div className="p-4">
				<h1 className="text-3xl font-bold py-2 text-blue-200">
					Fraction NFTs [building...]
				</h1>
			</div>
			<div className="flex justify-center">
				<h1 className="py-10 px-20 text-3xl">Building...🔨🔨🔨{'\n'}</h1>

				<h3 className="py-10 px-20 text-xl">
					You can fractionalize your NFT here.
				</h3>
			</div>
		</Layout>
	);
}

// Loan.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
