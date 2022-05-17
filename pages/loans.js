import Layout from '../components/layout'

export default function Loan() {
	return (
		<div className="flex justify-center">
			<h1 className="py-10 px-20 text-3xl">Building...🔨🔨🔨</h1>
		</div>
	)
}

Loan.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>
}
