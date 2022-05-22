const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')

describe('NFT Market', function () {
	it('Should create and execute market sales', async function () {
		const provider = waffle.provider

		const Market = await ethers.getContractFactory('OriginalNFTMarket')
		const market = await Market.deploy()
		await market.deployed()
		const marketContractAddress = market.address

		const NFT = await ethers.getContractFactory('OriginalNFT')
		const nft = await NFT.deploy(marketContractAddress)
		await nft.deployed()
		const nftContractAddress = nft.address

		// let commision = await market.getCommision();
		let listingPrice = await market.getListingPrice()
		listingPrice = listingPrice.toString()

		const auctionPrice = ethers.utils.parseUnits('999', 'ether')

		await nft.createToken('https://www.mytokenlocation.com')
		await nft.createToken('https://www.mytokenlocation.com')

		await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
		await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

		// await market.addItemToMarket(nft.token)

		// Local testing environment: using the test accounts
		// Have the buyer and the seller be different person
		const [_, buyerAddress, add2] = await ethers.getSigners()

		await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })
		console.log('The seller wallet balance: ', (await _.getBalance()).toString())
		console.log('The buyer wallet balance: ', (await buyerAddress.getBalance()).toString())
		console.log('The nothing wallet balance: ', (await add2.getBalance()).toString())
		console.log('The marketplace wallet balance: ', (await provider.getBalance(marketContractAddress)).toString())

		// await market.connect(buyerAddress).

		let items = await market.fetchMarketItems()

		// Set the items to be the result of this mapping
		items = await Promise.all(
			items.map(async (i) => {
				const tokenUri = await nft.tokenURI(i.tokenId)
				let item = {
					price: i.price.toString(),
					tokenId: i.tokenId.toString(),
					seller: i.seller,
					owner: i.owner,
					tokenUri,
				}
				return item
			})
		)

		console.log('items: ', items)
	})
})
