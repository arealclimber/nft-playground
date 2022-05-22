const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFT Market', function () {
	it('Should create and execute market sales', async function () {
		const Market = await ethers.getContractFactory('NFTMarket')
		const market = await Market.deploy()
		await market.deployed()
		const marketContractAddress = market.address

		const NFT = await ethers.getContractFactory('NFT')
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
		const [_, buyerAddress] = await ethers.getSigners()

		await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

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
