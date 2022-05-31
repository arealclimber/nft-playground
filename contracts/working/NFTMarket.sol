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

    uint256 commision = 1;
    address payable public manager;

    struct MarketItem {
        uint itemId;
        uint tokenId;
        uint price;
        address nftContract;
        address payable seller;
        bool isSold;
        bool isOnSale;
    }

    // Use `_itemIds` to track the items on the market?
    mapping(uint256 => MarketItem) private idToMarketItem;
    MarketItem[] public itemsForSale;
    mapping(address => mapping(uint => bool)) activeItems;
    // mapping (address => mapping (uint256 => bool)) activeItems;


    // TODO: Is it necessary to mark nftContract `indexed`?
    event itemAdded(uint indexed itemId, uint indexed tokenId, uint price, address indexed nftContract);
    event itemSold(uint indexed itemId, uint indexed tokenId, uint price, address indexed buyer);
    event itemRemoved(uint indexed itemId, uint indexed tokenId, uint price, address indexed nftContract);

    constructor() {
        manager = payable(msg.sender);
    }

    modifier onlyItemOwner(address tokenAddress, uint tokenId) {
        IERC721 tokenContract = IERC721(tokenAddress);
        require(tokenContract.ownerOf(tokenId) == msg.sender);
        _;
    }

    modifier hasTransferApproval(address tokenAddress, uint tokenId) {
        IERC721 tokenContract = IERC721(tokenAddress);
        require(tokenContract.getApproved(tokenId) == address(this));
        _;
    }

    // TODO: Make sure if the item is already on the market?
    modifier itemExists(uint id) {
        // require(id <= _itemIds.current() && idToMarketItem[id].itemId == id);
        require(id < _itemIds.current() && itemsForSale[id].itemId == id);
        _;
    }

    // TODO: Check if the item is sold out? What about reselling?
    modifier isForSale(uint id) {
        require(itemsForSale[id].isSold == false, "Item is already sold!");
        _;
    }

    function returnAllListedItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint itemLength = itemsForSale.length;
        uint currentIndex = 0;

        // MarketItem[] memory items = new MarketItem[](itemLength);
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = itemsForSale[i].itemId;
            MarketItem storage currentItem = itemsForSale[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function unlistItem(uint id, uint tokenId, address tokenAddress) onlyItemOwner(tokenAddress, tokenId) external {
        require(activeItems[tokenAddress][tokenId] == true, "Item is not on sale!");
        itemsForSale[id].isOnSale = false;
        activeItems[tokenAddress][tokenId] = false;

        emit itemRemoved(id, tokenId, itemsForSale[id].price, tokenAddress);

    }

    function addItemToMarket(uint tokenId, uint price,address tokenAddress) onlyItemOwner(tokenAddress, tokenId) hasTransferApproval(tokenAddress, tokenId) external returns (uint) {
        require(activeItems[tokenAddress][tokenId] == false, "Item is already on sale!");        
        uint newItemId = _itemIds.current();
        _itemIds.increment();
        itemsForSale.push(MarketItem(newItemId, tokenId, price, tokenAddress, payable(msg.sender), false, true));
        activeItems[tokenAddress][tokenId] = true;

        assert(itemsForSale[newItemId].itemId == newItemId);
        emit itemAdded(newItemId, tokenId, price, tokenAddress);
        return newItemId;
        // Set the item.isSold = false
        // Ask the owner to approve it? Or no need to do this asking? The owner has the ownership of the NFT and we just ask if he or she want to put the NFT on our market to sell.

    }

    function buyItem(uint id) payable external itemExists(id) isForSale(id) hasTransferApproval(itemsForSale[id].nftContract, itemsForSale[id].tokenId) nonReentrant {
        require(msg.value == itemsForSale[id].price, "Please submit the asking price in order to complete the purchase.");
        require(msg.sender != itemsForSale[id].seller);

        itemsForSale[id].isSold = true;
        itemsForSale[id].isOnSale = false;
        activeItems[itemsForSale[id].nftContract][itemsForSale[id].tokenId] = false;

        IERC721(itemsForSale[id].nftContract).safeTransferFrom(itemsForSale[id].seller, msg.sender, itemsForSale[id].tokenId);
        
        // payable(address(this)).transfer(commision);
        uint revenue = (msg.value) * 1 / 100;
        payable(manager).transfer(revenue);

        // payable(address(this)).transfer(revenue);

        uint received = (msg.value - revenue);

        itemsForSale[id].seller.transfer(received);

        _itemsSold.increment();

        // TODO: May use `mapping` instead of `array` is the more efficient way when there's no need to run for-loop
        // delete itemsForSale[id];

        emit itemSold(id, itemsForSale[id].tokenId, itemsForSale[id].price, msg.sender);

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
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        // TODO: push? storage vs memory?
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if ((itemsForSale[i].isSold == false) && (itemsForSale[i].isOnSale == true )) {
                uint currentId = itemsForSale[i].itemId;
                MarketItem storage currentItem = itemsForSale[currentId];
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

    function setCommision(uint256 _commision) external onlyOwner nonReentrant {
        commision = _commision;
    }

    function getCommision() public view returns (uint) {
        return commision;
    }



}






