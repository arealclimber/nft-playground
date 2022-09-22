const { expect, assert } = require('chai')
const { getAddress } = require('ethers/lib/utils')
// const { is } = require('express/lib/request')
const { ethers, waffle } = require('hardhat')

let provider
let nft
let nftContractAddress
let market
let marketContractAddress

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
	console.log('The NFT Contract Address: ', nftContractAddress)
})

describe('Working NFT Test: ', function () {
	it('Should create NFTs', async function () {
		const [add1, add2, add3] = await ethers.getSigners()
		console.log('address 1: ', add1.address)
		console.log('address 2: ', add2.address)
		console.log('address 3: ', add3.address)

		// If not clearly saying who creating the token, it set to the address 1 by default.
		await nft.connect(add1).createToken('https://www.mytokenlocation.com') // tokenId=0
		await nft.connect(add2).createToken('https://www.mytokenlocation.com') // tokenId=1
		await nft.connect(add3).createToken('https://www.mytokenlocation.com') // tokenId=2
		await nft.connect(add2).createToken('https://www.mytokenlocation.com') // tokenId=3
		await nft.connect(add3).createToken('https://www.mytokenlocation.com') // tokenId=4

		// Check the totalsupply is equal to the already-minted number 
		const nftTotalSupply = (await nft.totalSupply()).toNumber();
		// console.log('The NFT total supply: ', nftTotalSupply)
		expect(nftTotalSupply).to.equal(5)

		// Check the address 1's balance of this NFT
		const balanceOfadd1 = (await nft.balanceOf(add1.address)).toNumber();
		const balanceOfadd2 = (await nft.balanceOf(add2.address)).toNumber();
		const balanceOfadd3 = (await nft.balanceOf(add3.address)).toNumber();
		// console.log('The address1 has NFT amount: ', balanceOfadd1)
		// console.log('The address2 has NFT amount: ', balanceOfadd2)
		// console.log('The address3 has NFT amount: ', balanceOfadd3)
		expect(balanceOfadd1).to.equal(1)
		expect(balanceOfadd2).to.equal(2)
		expect(balanceOfadd3).to.equal(2)

		/** 
		 * @dev In {ERC721Enumerable} or {IERC721Enumerable}, `_ownedTokens` to mapping owner to list of owned token IDs
		 * and `tokenOfOwnerByIndex()` to return a token ID owned by `owner` at a given `index` of its token list
		 * @param1 mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
		 * @param2 function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)
		 * note the `index` is required to less than `ERC721.balanceOf(owner)`, in order to make owner index within bounds
		 * @return _ownedTokens[owner][index]
		 */
		// Give `tokenOfOwnerByIndex` the parameter of index=0 and address-3, and it'll return the first tokenId owned by address-3. 
		// `index=0` means the `tokenOfOwnerByIndex` run the loop for one time
		// `index=1` it'll return the tokenId of the second NFT owned by the `address-3`
		console.log('The tokenOfOwnerByIndex with index=1 and address-3: ', (await nft.tokenOfOwnerByIndex(add3.address, 1)));

		// // Check the NFT's owner using the tokenId
		// const tokenIdToOwner = await nft.ownerOf(0)
		// console.log('The Owner of tokenId=0 : ', tokenIdToOwner)
		// expect(tokenIdToOwner).to.equal(add1.address)
		expect(await nft.ownerOf(2)).to.equal(add3.address)
		// assert.equal((await nft.ownerOf(2)), add3.address, `Owner of token-id = 2 is add3: ${add3.address}`)
		
	})

})

describe('Working NFT Market Test: ', function () {
	it('Should create items and execute market sales and resell the NFT', async function () {
		// Local testing environment: using the test accounts
		// Have the buyer and the seller be different person

		// `_` is the owner of NFT and NFT Marketplace contracts
		const [_, add1, add2, add3] = await ethers.getSigners()
		console.log('The address _ : ', _.address)
		console.log('The address 1 : ', add1.address)
		console.log('The address 2 : ', add2.address)
		console.log('The address 3 : ', add3.address)

		let commission = await market.getCommission();
		commission = commission.toString()

		const auctionPrice = ethers.utils.parseUnits('4000', 'ether')
		// equal(commission.toNumber()).to.equal(auctionPrice.toNumber() * 0.01)
		// console.log('The commission amount:', 4000 * 0.01)
		console.log('commission:', commission)

		// let manager = await market.getManager();
		// console.log('The manager address receives the commission: ', manager)

		// await nft.createToken('https://www.mytokenlocation.com')
		// await nft.createToken('https://www.mytokenlocation.com')

		await nft.connect(add1).createToken('https://www.mytokenlocation.com') // tokenId=0
		await nft.connect(add1).createToken('https://www.mytokenlocation.com') // tokenId=1
		await nft.connect(add1).createToken('https://www.mytokenlocation.com') // tokenId=2
		await nft.connect(add2).createToken('https://www.mytokenlocation.com') // TODO: tokenId=3 to test delist functionality
		
		let nftNumberOwnedByAdd1 = (await nft.balanceOf(add1.address)).toNumber()
		let nftNumberOwnedByAdd2 = (await nft.balanceOf(add2.address)).toNumber()
		let nftNumberOwnedByAdd3 = (await nft.balanceOf(add3.address)).toNumber()

		console.log('The address1 has NFT amount: ', nftNumberOwnedByAdd1)
		// console.log(typeof nftNumberOwnedByAdd1)
		console.log('The address2 has NFT amount: ', nftNumberOwnedByAdd2)
		console.log('The address3 has NFT amount: ', nftNumberOwnedByAdd3)
		
		assert.equal(nftNumberOwnedByAdd1, 3)
		assert.equal(nftNumberOwnedByAdd2, 1)
		assert.equal(nftNumberOwnedByAdd3, 0)
		// expect(nftNumberOwnedByAdd1).to.equal(3)
		// expect(nftNumberOwnedByAdd2).to.equal(1)
		// expect(nftNumberOwnedByAdd3).to.equal(0)

		console.log('The first NFT tokenId owned by address1: ', (await nft.tokenOfOwnerByIndex(add1.address, 0)).toNumber()); //tokenId=0
		console.log('The first NFT tokenId owned by address2: ', (await nft.tokenOfOwnerByIndex(add2.address, 0)).toNumber()); //tokenId=2


		console.log('The token 1 approved by address: ', (await nft.getApproved(1)))
		console.log('The token 0 approved by address: ', (await nft.getApproved(0)))

		await nft.connect(add1).approve(marketContractAddress, 0);
		// ↓ERROR: ERC721: approve caller is not owner nor approved for all
		// await market.connect(_).approveMarket(0, nftContractAddress);
		console.log('The token-0 approved by: ', (await nft.getApproved(0)))

		await nft.connect(add1).approve(marketContractAddress, 1);
		console.log('The token-1 approved by: ', (await nft.getApproved(1)))

		// `0` and `1` are `tokenId`
		// being on sale then getting the `itemId` respectively
		await market.connect(add1).addItemToMarket(0, auctionPrice, nftContractAddress)
		console.log('Successful adding token ID 0 to market by address-1')
		await market.connect(add1).addItemToMarket(1, auctionPrice, nftContractAddress)
		console.log('Successful adding token ID 1 to market by address-1')

		/**
		 * @dev to test the delist NFT functionality
		 * @param1 function addItemToMarket(uint tokenId, uint price,address tokenAddress) onlyItemOwner(tokenAddress, tokenId) hasTransferApproval(tokenAddress, tokenId) external returns (uint) 
		 * @param2 function unlistItem(uint id, uint tokenId, address tokenAddress) onlyItemOwner(tokenAddress, tokenId) external
		 * @note Now, we can inference the item ID is 2 (the third one put on the market) for this case,
		 * so we put itemId=2 tokenId=3 to trying delist this NFT commodity
		 * @test the test NFT is owned by `add2` and `tokenId`=3 and `itemId` may be *2*
		 */

		// Set tokenId=3 on sale
		await nft.connect(add2).approve(marketContractAddress, 3);
		console.log('The token-3 approved by: ', (await nft.getApproved(3)))
		await market.connect(add2).addItemToMarket(3, auctionPrice, nftContractAddress)
		console.log('Successful adding token ID 3 to market by address-2')

		// Set tokenId=2 owned by address-1 on sale
		await nft.connect(add1).approve(marketContractAddress, 2);
		await market.connect(add1).addItemToMarket(2, auctionPrice, nftContractAddress);
		console.log('Token Id = 2 on sale!')

		// FIXME: How to get the specific NFT item id owned by the specific account
		// Delist tokenId=3 itemId=2
		await market.connect(add2).unlistItem(2, 3, nftContractAddress)
		console.log('Unlisting succeeds!')

		

		let items = await market.fetchMarketItems()

		// Set the items to be the result of this mapping
		items = await Promise.all(
			items
			.filter(item => item.isOnSale === true)
			.map(async (i) => {
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
		console.log('After adding AND delisting the tokenId=3 NFT, the items on the market: ', items)

		console.log('The seller before-sale-balance: ', (await add1.getBalance()).toString())

		await market.connect(add2).buyItem(0, { value: auctionPrice })
		console.log('After buying token-id-0 NFT, the address 1 has the number of NFT: ', (await nft.balanceOf(add1.address)).toNumber())

		let sellerBalance = (await add1.getBalance()).toString()
		console.log('The seller after-sold-balance: ', sellerBalance)
		let marketBalance = (await provider.getBalance(marketContractAddress)).toString()
		console.log('The marketplace balance: ', marketBalance)
		let marketOwner = await market.owner();
		console.log('The owner address deploy the market contract: ', marketOwner)
		

		// expect(manager).to.equal(marketOwner)

		// expect(await nft.ownerOf(2)).to.equal(add3.address)
		const initialManagerBalance = (await provider.getBalance(_.address)).toString()
		console.log('The market owner balance: ', initialManagerBalance)
		

		// console.log(await market.manager)

		// console.log('The manager balance: ', (await marketContractAddress.manager.getBalance()).toString())

		items = await market.fetchMarketItems()

		// Set the items to be the result of this mapping
		items = await Promise.all(
			items
			.filter(item => item.isOnSale === true)
			.map(async (i) => {
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
		
		const secondManagerBalance = (await provider.getBalance(_.address)).toString()
		console.log(ethers.utils.formatUnits(secondManagerBalance, "ether"));
		let commisionRevenue = ethers.utils.formatUnits(secondManagerBalance, "ether") - ethers.utils.formatUnits(initialManagerBalance, "ether");
		console.log('The market owner balance: ', secondManagerBalance)
		console.log('The market owner GET: ', commisionRevenue)
		console.log('The number of address_ own NFTs: ', (await nft.balanceOf(_.address)).toNumber())
		console.log('The number of address1 own NFTs: ', (await nft.balanceOf(add1.address)).toNumber())
		console.log('The number of address2 own NFTs: ', (await nft.balanceOf(add2.address)).toNumber())
		console.log('The number of address3 own NFTs: ', (await nft.balanceOf(add3.address)).toNumber())

		assert.equal((await nft.ownerOf(0)), add2.address)
		// console.log('The owner of tokenId=0: ', (await nft.ownerOf(0)))

		// (await nft.tokenOfOwnerByIndex(add3.address, 1))
		// *------------------------Resell the NFT------------------------* //
		await nft.connect(add2).approve(marketContractAddress, 0);
		
		// FIXME: something wrong with `add2` `itemId=2` `tokenId=3` why it bought by `add3`?
		await market.connect(add2).addItemToMarket(0, auctionPrice, nftContractAddress)
		// await market.connect(add3).buyItem(2, { value: auctionPrice })
		await market.connect(add2).buyItem(1, { value: auctionPrice })

		console.log('The number of address_ own NFTs: ', (await nft.balanceOf(_.address)).toNumber())
		console.log('The number of address1 own NFTs: ', (await nft.balanceOf(add1.address)).toNumber())
		console.log('The number of address2 own NFTs: ', (await nft.balanceOf(add2.address)).toNumber())
		console.log('The number of address3 own NFTs: ', (await nft.balanceOf(add3.address)).toNumber())


		// Test if the marketplace receive the commission
		// Test if the seller receive the commission
		console.log('The market owner balance: ', (await provider.getBalance(_.address)).toString())
		console.log('The balance of address_ wallet: ', (await _.getBalance()).toString())
		console.log('The balance of address1 wallet: ', (await add1.getBalance()).toString())
		console.log('The balance of address2 wallet: ', (await add2.getBalance()).toString())
		console.log('The balance of address3 wallet: ', (await add3.getBalance()).toString())


		let allItems = await market.returnAllListedItems();

		allItems = await Promise.all(
			allItems.map(async (i) => {
				const tokenUri = await nft.tokenURI(i.tokenId);
				const tokenOwner = await nft.ownerOf(i.tokenId);
				let details = {
					price: i.price.toString(),
					tokenId: i.tokenId.toString(),
					itemId: i.itemId.toString(),
					seller: i.seller,
					contract: i.nftContract,
					isSold: i.isSold,
					isOnSale: i.isOnSale,
					tokenOwner,
					tokenUri,
				}
				return details;
			})
		)
		console.log('The history of the whole items-for-sale: ', allItems)

		items = await market.fetchMarketItems()

		// Set the items to be the result of this mapping
		items = await Promise.all(
			items
			.filter(item => item.isOnSale === true)
			.map(async (i) => {
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
		console.log('Items on the market: ', items)

		const thirdManagerBalance = (await provider.getBalance(_.address)).toString()
		const thirdManagerBalanceEth = ethers.utils.formatUnits(thirdManagerBalance, "ether")
		commisionRevenue = ethers.utils.formatUnits(thirdManagerBalance, "ether") - ethers.utils.formatUnits(secondManagerBalance, "ether");
		console.log('The market owner balance: ', thirdManagerBalance)
		console.log(`The market owner balance in Eth: ${thirdManagerBalanceEth}`)
		console.log('The market owner GET: ', commisionRevenue, 'ether')

		// console.log(nft)
		// console.log(market)

		await nft.connect(add3).createToken('https://www.mytokenlocation.com')
		await nft.connect(add3).approve(marketContractAddress, 4)
		await market.connect(add3).addItemToMarket(4, auctionPrice, nftContractAddress)
		console.log('Address-3 mint NFT and put it on sale.')

		items = await market.fetchMarketItems();
		items = await Promise.all(
			items
			.filter(item => item.isOnSale === true)
			.map(
				async (i) => {
					const tokenUri = await nft.tokenURI(i.tokenId)
					let item = {
						price: i.price.toString(),
						tokenId: i.tokenId.toString(),
						itemId: i.itemId.toString(),
						seller: i.seller,
						contract: i.nftContract,
						isSold: i.isSold,
						isOnSale: i.isOnSale,
						tokenUri
					}
					return item
				}
			)
		)
		console.log("After add3 mints and sells NFT, the market: ", items)

		await market.connect(add3).unlistItem(4, 4, nftContractAddress)
		console.log("Address-3 unlist NFT item.")

		// console.log("The owner of Token Id =1 ", (await nft.ownerOf(1)))
		await nft.connect(add2).approve(marketContractAddress, 1)
		await market.connect(add2).addItemToMarket(1, auctionPrice, nftContractAddress)

		items = await market.fetchMarketItems();
		items = await Promise.all(
			items
			.filter(item => item.isOnSale === true)
			.map(
				async (i) => {
					const tokenUri = await nft.tokenURI(i.tokenId)
					let item = {
						price: i.price.toString(),
						tokenId: i.tokenId.toString(),
						itemId: i.itemId.toString(),
						seller: i.seller,
						contract: i.nftContract,
						isSold: i.isSold,
						isOnSale: i.isOnSale,
						tokenUri
					}
					return item
				}
			)
		)
		console.log("After `add3` remove item and `add2` put tokenId=1 on sale: ", items)

		marketBalance = (await provider.getBalance(marketContractAddress)).toString();
		console.log("At the end, market balance is: ", marketBalance)

		// let balanceOfMarketOwner = (await provider.getBalance(_.address)).toString();
		let balanceOfMarketOwner = (await _.getBalance()).toString();
		console.log("Before withdrawing, address_ (marketOwner) balance is: ", balanceOfMarketOwner)

		await market.connect(_).withdrawMoney();
		
		balanceOfMarketOwner = (await _.getBalance()).toString();
		console.log("After withdrawing, address _ (marketOwner) balance is: ", balanceOfMarketOwner)

		marketBalance = (await provider.getBalance(marketContractAddress)).toString();
		console.log("After withdrawing, market balance is: ", marketBalance)


	})
})
