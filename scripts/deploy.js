// const { ethers } = require('hardhat')
const hre = require('hardhat');

async function main() {
	// Account basic info
	const [deployer] = await hre.ethers.getSigners();
	console.log('Account balance: ', (await deployer.getBalance()).toString());

	// NFT Market Deployment
	const NFTMarket = await hre.ethers.getContractFactory('NFTMarket');
	const nftMarket = await NFTMarket.deploy();
	await nftMarket.deployed();
	console.log('nftMarket deployed to:', nftMarket.address);

	// NFT Deployment
	const NFT = await hre.ethers.getContractFactory('NFT');
	const nft = await NFT.deploy();
	await nft.deployed();
	console.log('nft deployed to:', nft.address);

	// Article Deployment
	// const Article = await hre.ethers.getContractFactory('Article');
	// const article = await Article.deploy();
	// await article.deployed();
	// console.log('article deployed to:', article.address);

	// const Multicall = await hre.ethers.getContractFactory('Multicall')
	// const multicall = await Multicall.deploy()
	// await multicall.deployed()
	// console.log('multicall deployed to: ', multicall.address)


	await sleep(50000);

	// await run('verify:verify', {
	// 	address: nftMarket.address,
	// 	contract: 'contracts/working/NFTMarket.sol:NFTMarket',
	// });


	await run('verify:verify', {
		address: nft.address,
		contract: 'contracts/working/NFT.sol:NFT',
	});
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
