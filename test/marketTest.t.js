const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFT Market', function() {
	it('Should create and execute market sales', async function() {
		const Market = await ethers.getContractFactory('testNFTMarket');
		const market = await Market.deploy();
		await market.deployed();
		const marketContractAddress = market.address;

		const NFT = await ethers.getContractFactory('NFT');
		const nft = await NFT.deploy(marketContractAddress);
		await nft.deployed();
		const nftContractAddress = nft.address;

		let commision = await market.getCommision();
		commision = commision.toString();

		const auctionPrice = ethers.utils.parseUnits('999', 'ether');

		await nft.createToken('https://www.mytokenlocation.com');
		await nft.createToken('https://www.mytokenlocation.com');

		// `0` and `1` are `tokenId`
		// being on sale then getting the `itemId` respectively
		await market.addItemToMarket(0, auctionPrice, nft);
		await market.addItemToMarket(1, auctionPrice, nft);

		// Local testing environment: using the test accounts
		// Have the buyer and the seller be different person
		const [_, buyerAddress] = await ethers.getSigners();

		await market.connect(buyerAddress).buyItem(0, { value: auctionPrice });

		// TODO: Test if the marketplace receive the commision
		// TODO: Test if the seller receive the commision

		let items = await market.fetchMarketItems();

		// Set the items to be the result of this mapping
		items = await Promise.all(
			items.map(async i => {
				const tokenUri = await nft.tokenURI(i.tokenId);
				let item = {
					price: i.price.toString(),
					tokenId: i.tokenId.toString(),
					itemId: i.itemId.toString(),
					seller: i.seller,
					contract: i.nftContract,
					isSold: i.isSold,
					isOnSale: i.isOnSale,
					tokenUri
				};
				return item;
			})
		);

		console.log('items: ', items);
	});
});
