// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; // The number is also the accumulating amount of NFT on the market
    Counters.Counter private _itemsSold; // The number is the NFT-sold amount
    // Counters.Counter private _marketItems;

    uint256 private commission = 1;
    address payable private manager;

    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        address nftContract;
        address payable seller;
        bool isSold;
        bool isOnSale;
    }

    // Use `_itemIds` to track the items on the market?
    // TODO: Should be `private`
    mapping(uint256 => MarketItem) public idToMarketItem;
    // MarketItem[] public itemsForSale;
    mapping(address => mapping(uint256 => bool)) activeItems;

    // TODO: Is it necessary to mark nftContract `indexed`?
    event itemAdded(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        uint256 price,
        address indexed nftContract
    );
    event itemSold(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        uint256 price,
        address indexed buyer
    );
    event itemRemoved(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        uint256 price,
        address indexed nftContract
    );

    constructor() {
        manager = payable(msg.sender);
    }

    modifier onlyItemOwner(address tokenAddress, uint256 tokenId) {
        IERC721 tokenContract = IERC721(tokenAddress);
        require(
            tokenContract.ownerOf(tokenId) == msg.sender,
            "Only the owner of this item can do this operation"
        );
        _;
    }

    modifier hasTransferApproval(address tokenAddress, uint256 tokenId) {
        IERC721 tokenContract = IERC721(tokenAddress);
        require(
            tokenContract.getApproved(tokenId) == address(this),
            "Not approved yet"
        );
        _;
    }

    // TODO: Make sure if the item is already on the market?
    modifier itemExists(uint256 id) {
        // require(id <= _itemIds.current() && idToMarketItem[id].itemId == id);
        require(
            id < _itemIds.current() && idToMarketItem[id].itemId == id,
            "Item is not on the market."
        );
        _;
    }

    // TODO: Check if the item is sold out? What about reselling?
    modifier isForSale(uint256 id) {
        require(idToMarketItem[id].isSold == false, "Item is already sold!");
        _;
    }

    function returnAllListedItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        // uint256 itemLength = itemsForSale.length;
        uint256 currentIndex = 0;

        // MarketItem[] memory items = new MarketItem[](itemLength);
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = idToMarketItem[i].itemId;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function unlistItem(
        uint256 id,
        uint256 tokenId,
        address tokenAddress
    ) external onlyItemOwner(tokenAddress, tokenId) nonReentrant {
        require(
            activeItems[tokenAddress][tokenId] == true,
            "Item is not on sale!"
        );
        _itemIds.decrement();
        // _marketItems.decrement();

        delete idToMarketItem[id];
        idToMarketItem[id].isOnSale = false;
        activeItems[tokenAddress][tokenId] = false;

        // emit itemRemoved(id, tokenId, itemsForSale[id].price, tokenAddress);
    }

    function addItemToMarket(
        uint256 tokenId,
        uint256 price,
        address tokenAddress
    )
        external
        nonReentrant
        onlyItemOwner(tokenAddress, tokenId)
        hasTransferApproval(tokenAddress, tokenId)
        returns (uint256)
    {
        require(
            activeItems[tokenAddress][tokenId] == false,
            "Item is already on sale!"
        );
        uint256 newItemId = _itemIds.current();
        _itemIds.increment();
        // _marketItems.increment();
        // itemsForSale.push(
        //     MarketItem(
        //         newItemId,
        //         tokenId,
        //         price,
        //         tokenAddress,
        //         payable(msg.sender),
        //         false,
        //         true
        //     )
        // );
        idToMarketItem[newItemId] = MarketItem(
            newItemId,
            tokenId,
            price,
            tokenAddress,
            payable(msg.sender),
            false,
            true
        );

        activeItems[tokenAddress][tokenId] = true;

        assert(idToMarketItem[newItemId].itemId == newItemId);
        emit itemAdded(newItemId, tokenId, price, tokenAddress);
        return newItemId;
        // Set the item.isSold = false
        // Ask the owner to approve it? Or no need to do this asking? The owner has the ownership of the NFT and we just ask if he or she want to put the NFT on our market to sell.
    }

    function buyItem(uint256 id)
        external
        payable
        itemExists(id)
        isForSale(id)
        hasTransferApproval(
            idToMarketItem[id].nftContract,
            idToMarketItem[id].tokenId
        )
        nonReentrant
    {
        require(
            msg.value == idToMarketItem[id].price,
            "Please submit the asking price in order to complete the purchase."
        );
        require(
            msg.sender != idToMarketItem[id].seller,
            "Seller cannot be the buyer."
        );

        idToMarketItem[id].isSold = true;
        idToMarketItem[id].isOnSale = false;
        activeItems[idToMarketItem[id].nftContract][
            idToMarketItem[id].tokenId
        ] = false;

        IERC721(idToMarketItem[id].nftContract).safeTransferFrom(
            idToMarketItem[id].seller,
            msg.sender,
            idToMarketItem[id].tokenId
        );

        uint256 revenue = ((msg.value) * commission) / 100;

        // payable(manager).transfer(revenue);
        payable(address(this)).transfer(revenue);

        uint256 received = (msg.value - revenue);

        idToMarketItem[id].seller.transfer(received);

        _itemsSold.increment();

        // TODO: May use `mapping` instead of `array` is the more efficient way when there's no need to run for-loop
        delete idToMarketItem[id];
        // delete itemsForSale[id];

        emit itemSold(
            id,
            idToMarketItem[id].tokenId,
            idToMarketItem[id].price,
            msg.sender
        );
    }

    /*    
     struct MarketItem {
        uint itemId;
        uint tokenId;
        uint price;
        address nftContract;
        address payable seller;
        bool isSold;
        bool isOnSale;
    }
*/
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        // uint256 unsoldItemCount = _marketItems.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        // TODO: push? storage vs memory?

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                (idToMarketItem[i].nftContract != address(0)) &&
                (idToMarketItem[i].isOnSale == true)
            ) {
                uint256 currentId = i;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
            // if (tokenContract.ownerOf(i) == address(0)) {
            //     uint currentId = idToMarketItem[i + 1].itemId;
            //     MarketItem storage currentItem = idToMarketItem[currentId];
            //     items[currentIndex] = currentItem;
            //     currentIndex += 1;
            // }
        }
        return items;
    }

    function setCommission(uint256 _commission)
        external
        onlyOwner
        nonReentrant
    {
        commission = _commission;
    }

    function getCommission() public view returns (uint256) {
        return commission;
    }

    function getManager() public view returns (address) {
        return manager;
    }

    receive() external payable {}

    fallback() external payable {}

    function withdrawMoney() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }
}
