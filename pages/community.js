import Layout from '../components/Layout';

export default function Community() {
	return (
		<Layout>
			<div className="p-4">
				<h1 className="text-3xl font-bold py-2 text-blue-200">
					Write Articles [building...]
				</h1>
			</div>
			<div className="flex justify-center">
				<div className="w-1/2 flex flex-col pb-12">
					<textarea
						placeholder="Just text something💌"
						className="flex-2 mt-10 border min-h-full rounded p-4 text-black text-lg"
					/>

					<button className="flex-1 mt-10 font-bold p-4 text-2xl bg-blue-500 hover:scale-110 transition duration-500 ease-in-out hover:bg-blue-600 text-white rounded-lg p-4 shadow-lg">
						Publish article NFT
					</button>
				</div>
			</div>
		</Layout>
	);
}

// Community.getLayout = function getLayout(page) {
// 	return <Layout>{page}</Layout>
// }
