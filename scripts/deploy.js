// const { ethers } = require('hardhat')
const hre = require('hardhat')

async function main() {
	const [deployer] = await hre.ethers.getSigners()
	console.log('Account balance: ', (await deployer.getBalance()).toString())

	const NFTMarket = await hre.ethers.getContractFactory('NFTMarket')
	const nftMarket = await NFTMarket.deploy()
	await nftMarket.deployed()
	console.log('nftMarket deployed to:', nftMarket.address)

	const NFT = await hre.ethers.getContractFactory('NFT')
	const nft = await NFT.deploy()
	await nft.deployed()
	console.log('nft deployed to:', nft.address)

	// const Multicall = await hre.ethers.getContractFactory('Multicall')
	// const multicall = await Multicall.deploy()
	// await multicall.deployed()
	// console.log('multicall deployed to: ', multicall.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
