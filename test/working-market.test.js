const { expect } = require('chai')
const { getAddress } = require('ethers/lib/utils')
// const { is } = require('express/lib/request')
const { ethers, waffle } = require('hardhat')

let provider
let nft
let nftContractAddress
let market
let marketContractAddress
// let [add1, add2, add3] = []

beforeEach(async () => {
	provider = waffle.provider
	
	const Market = await ethers.getContractFactory('NFTMarket')
	market = await Market.deploy()
	await market.deployed()
	marketContractAddress = market.address
	console.log('The Market Contract Address: ', marketContractAddress)

	const NFT = await ethers.getContractFactory('NFT')
	nft = await NFT.deploy()
	await nft.deployed()
	nftContractAddress = nft.address
	console.log('The NFT Contract Address: ',nftContractAddress)
})

describe('Working NFT Test: ', function () {
	it('Should create NFTs', async function () {
		const [add1, add2, add3] = await ethers.getSigners()
		console.log('address 1: ', add1.address)
		console.log('address 2: ', add2.address)
		console.log('address 3: ', add3.address)

		// If not clearly saying who creating the token, it defaultly set to the address 1.
		await nft.connect(add1).createToken('https://www.mytokenlocation.com') // tokenId=0
		await nft.connect(add2).createToken('https://www.mytokenlocation.com') // tokenId=1
		await nft.connect(add3).createToken('https://www.mytokenlocation.com') // tokenId=2
		await nft.connect(add2).createToken('https://www.mytokenlocation.com') // tokenId=3
		await nft.connect(add3).createToken('https://www.mytokenlocation.com') // tokenId=4

		// Check the totalsupply is equal to the already-minted number 
		const nftTotalSupply = (await nft.totalSupply()).toNumber();
		console.log('The NFT total supply: ', nftTotalSupply)
		expect(nftTotalSupply).to.equal(5)

		// Check the address 1's balance of this NFT
		const balanceOfadd1 = (await nft.balanceOf(add1.address)).toNumber();
		console.log('The address1 has NFT amount: ', balanceOfadd1)
		console.log('The address2 has NFT amount: ', (await nft.balanceOf(add2.address)).toNumber())
		console.log('The address3 has NFT amount: ', (await nft.balanceOf(add3.address)).toNumber())

		// Give `tokenOfOwnerByIndex` the parameter of index=0 and address-3, and it return the tokenId owned by address-3. 
		// `index=0` means the `tokenOfOwnerByIndex` run the loop for one time
		console.log('The tokenOfOwnerByIndex with index=1 and address-3: ', (await nft.tokenOfOwnerByIndex(add3.address, 1)));

		// // Check the NFT's owner using the tokenId
		// const tokenIdToOwner = await nft.ownerOf(0)
		// console.log('The Owner of tokenId=0 : ', tokenIdToOwner)
		// expect(tokenIdToOwner).to.equal(add1.address)
		expect(await nft.ownerOf(2)).to.equal(add3.address)
		

		// expect(await nft.ownerOf(1)).to.equal(add1.address)
		// console.log('The ', nft.tokenOfOwnerByIndex(add1.address, 0))
	})

})

describe('Working NFT Market Test: ', function () {
	it('Should create items and execute market sales and resell the NFT', async function () {
		// Local testing environment: using the test accounts
		// Have the buyer and the seller be different person

		const [_, add1, add2] = await ethers.getSigners()
		console.log('The address _ : ', _.address)
		console.log('The address 1 : ', add1.address)
		console.log('The address 2 : ', add2.address)


		let commision = await market.getCommision()
		commision = commision.toString()

		const auctionPrice = ethers.utils.parseUnits('4000', 'ether')

		// await nft.createToken('https://www.mytokenlocation.com')
		// await nft.createToken('https://www.mytokenlocation.com')

		await nft.connect(_).createToken('https://www.mytokenlocation.com')
		await nft.connect(add1).createToken('https://www.mytokenlocation.com')
		console.log('The address1 has NFT amount: ', (await nft.balanceOf(add1.address)).toNumber())
		console.log('The NFT tokenId owned by address_ : ', (await nft.tokenOfOwnerByIndex(_.address, 0))); //tokenId=0
		console.log('The NFT tokenId owned by address1: ', (await nft.tokenOfOwnerByIndex(add1.address, 0))); //tokenId=1
		console.log('The token 1 approved by: ', (await nft.getApproved(1)))
		console.log('The token 0 approved by: ', (await nft.getApproved(0)))

		await nft.connect(_).approve(marketContractAddress, 0);
		// ↓ERROR: ERC721: approve caller is not owner nor approved for all
		// await market.connect(_).approveMarket(0, nftContractAddress);
		console.log('The token-0 approved by: ', (await nft.getApproved(0)))

		await nft.connect(add1).approve(marketContractAddress, 1);
		console.log('The token-1 approved by: ', (await nft.getApproved(1)))

		// `0` and `1` are `tokenId`
		// being on sale then getting the `itemId` respectively
		await market.connect(_).addItemToMarket(0, auctionPrice, nftContractAddress)
		console.log('Successful adding token ID 0 to market by _')
		await market.connect(add1).addItemToMarket(1, auctionPrice, nftContractAddress)
		console.log('Successful adding token ID 1 to market by address-1')

		let items = await market.fetchMarketItems()

		// Set the items to be the result of this mapping
		items = await Promise.all(
			items.map(async (i) => {
				const tokenUri = await nft.tokenURI(i.tokenId)
				let item = {
					price: i.price.toString(),
					tokenId: i.tokenId.toString(),
					itemId: i.itemId.toString(),
					seller: i.seller,
					contract: i.nftContract,
					isSold: i.isSold,
					isOnSale: i.isOnSale,
					tokenUri,
				}
				return item
			})
		)
		console.log('After adding items, the items on the market: ', items)

		console.log('The seller before-sold-balance: ', (await _.getBalance()).toString())

		await market.connect(add1).buyItem(0, { value: auctionPrice })
		console.log('After buying token-id-0 NFT, the address 1 has the number of NFT: ', (await nft.balanceOf(add1.address)).toNumber())

		let sellerBalance = (await _.getBalance()).toString()
		console.log('The seller after-sold-balance: ', sellerBalance)
		let marketBalance = (await provider.getBalance(marketContractAddress)).toString()
		console.log('The marketplace balance: ', marketBalance)
		let marketOwner = await market.owner();
		console.log('The owner address deploy the market contract: ', marketOwner)
		let manager = await market.manager();
		console.log('The manager address receives the commision: ', manager)
		const initialManagerBalance = (await provider.getBalance(manager)).toString()
		console.log('The manager balance: ', initialManagerBalance)
		

		// console.log(await market.manager)

		// console.log('The manager balance: ', (await marketContractAddress.manager.getBalance()).toString())

		// TODO: Test if the marketplace receive the commision
		// TODO: Test if the seller receive the commision

		items = await market.fetchMarketItems()

		// Set the items to be the result of this mapping
		items = await Promise.all(
			items.map(async (i) => {
				const tokenUri = await nft.tokenURI(i.tokenId)
				let item = {
					price: i.price.toString(),
					tokenId: i.tokenId.toString(),
					itemId: i.itemId.toString(),
					seller: i.seller,
					contract: i.nftContract,
					isSold: i.isSold,
					isOnSale: i.isOnSale,
					tokenUri,
				}
				return item
			})
		)

		console.log('After buying the item, the items on the market: ', items)
		
		const secondManagerBalance = (await provider.getBalance(manager)).toString()
		console.log(ethers.utils.formatUnits(secondManagerBalance, "ether"));
		let commisionRevenue = ethers.utils.formatUnits(secondManagerBalance, "ether") - ethers.utils.formatUnits(initialManagerBalance, "ether");
		console.log('The manager balance: ', secondManagerBalance)
		console.log('The manager GET: ', commisionRevenue)
		console.log('The number of address_ own NFTs: ', (await nft.balanceOf(_.address)).toNumber())
		console.log('The number of address1 own NFTs: ', (await nft.balanceOf(add1.address)).toNumber())
		console.log('The number of address2 own NFTs: ', (await nft.balanceOf(add2.address)).toNumber())

		// *------------------------Resell the NFT------------------------* //
		await nft.connect(add1).approve(marketContractAddress, 0);
		
		await market.connect(add1).addItemToMarket(0, auctionPrice, nftContractAddress)
		await market.connect(add2).buyItem(2, { value: auctionPrice })
		await market.connect(add2).buyItem(1, { value: auctionPrice })

		console.log('The number of address_ own NFTs: ', (await nft.balanceOf(_.address)).toNumber())
		console.log('The number of address1 own NFTs: ', (await nft.balanceOf(add1.address)).toNumber())
		console.log('The number of address2 own NFTs: ', (await nft.balanceOf(add2.address)).toNumber())

		console.log('The manager balance: ', (await provider.getBalance(manager)).toString())
		console.log('The balance of address_ wallet: ', (await _.getBalance()).toString())
		console.log('The balance of address1 wallet: ', (await add1.getBalance()).toString())
		console.log('The balance of address2 wallet: ', (await add2.getBalance()).toString())

		let allItems = await market.returnAllListedItems();

		allItems = await Promise.all(
			allItems.map(async (i) => {
				const tokenUri = await nft.tokenURI(i.tokenId);
				let details = {
					price: i.price.toString(),
					tokenId: i.tokenId.toString(),
					itemId: i.itemId.toString(),
					seller: i.seller,
					contract: i.nftContract,
					isSold: i.isSold,
					isOnSale: i.isOnSale,
					owner: nft.ownerOf(i.tokenId),
					tokenUri,
				}
				return details;
			})
		)

		console.log('The whole items-for-sale: ', allItems)

		const thirdManagerBalance = (await provider.getBalance(manager)).toString()
		commisionRevenue = ethers.utils.formatUnits(thirdManagerBalance, "ether") - ethers.utils.formatUnits(secondManagerBalance, "ether");
		console.log('The manager balance: ', thirdManagerBalance)
		console.log('The manager GET: ', commisionRevenue, 'ether')
	})
})
