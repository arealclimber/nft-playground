// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "hardhat/console.sol";


// Accumulate the ERC20 token for exchaging the TREE NFT!
contract Feeds is Ownable, ReentrancyGuard, ERC721URIStorage, ERC721Enumerable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _ids;

    constructor() ERC721("NFT", "NFT") {
    }

    // Required overrides from parent contracts
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        // return string(abi.encodePacked(super.tokenURI(tokenId), ".json"));
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    
    
    uint memberCount;

    struct Snippet {
        uint snippetId;
        uint likeCount;
        uint flagCount;
        address payable author;
        bool restricted;
    }

    // mapping(address => (uint => Snippet[])) authorToSnippets;
    mapping(address => Snippet[]) authorToSnippets;
    mapping(address => uint[]) publishRecords;
    
    uint dailyLimit;
    uint lowerBound;

    mapping(address => uint) private membership;

    Snippet[] public snippets;

    function setLowerBound(uint _num) onlyOwner nonReentrant public returns (uint) {
        lowerBound = _num;
        return lowerBound;
    }

    function setDailyLimit(uint _num) onlyOwner nonReentrant public returns (uint) {
        dailyLimit = _num;
        return dailyLimit;
    }

    


    modifier isMemeber(address checkAddress) {
        require(membership[checkAddress] > 0);
        _;
    }

    modifier canClaim(address checkAddress) {
        require(authorToSnippets[checkAddress].length > lowerBound);
        _;
    }

    // modifier canClaim() {
    //     require(authorToSnippets[msg.sender].length > lowerBound);
    //     _;
    // }
    
    modifier isExceed(address checkAddress) {
        uint thirdToLast = publishRecords[checkAddress].length - 2;
        uint thirdTimestamp = publishRecords[checkAddress][thirdToLast -1];
        uint timeInterval = block.timestamp - thirdTimestamp;
        require(timeInterval < 259200);
        _;
        
    }

    
    function publish(string memory tokenURI) isExceed(msg.sender) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        uint256 newArticleId = _ids.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        snippets.push(Snippet(newArticleId, 0, 0, payable(msg.sender), false));


        publishRecords[msg.sender].push(block.timestamp);

        return newItemId;
    }
/*     
    struct Snippet {
        uint snippetId;
        uint likeCount;
        uint flagCount;
        address author;
        bool restricted;
    }

    Snippet[] public snippets;
*/

    
    function fetchAllFeeds() public view returns (Snippet[] memory) {
        // uint snippetsAll = _ids.current();
        // uint currentIndex = 0;

        // Snippet[] memory feed = new Snippet[](snippetsAll);
        // for (uint i = 0; i < snippetsAll; i++) {
        //     uint currentId = snippets[i].snippetId;
        //     Snippet storage
        // }
        return snippets;
    }

    // Check the status of the very feed
    function checkStatus(uint id) public view returns(Snippet memory) {
        require(snippets[id].snippetId == id, "Not found the snippet. Id isn't accorded.");

        // Snippet querySnippet = Snippet[] memory snippets[id];
        Snippet memory querySnippet = snippets[id];

        return querySnippet;
        
    }

    // TODO: Maybe some tips?
    function like(uint id, address author) public {
        require(snippets[id].snippetId == id, "Not found the snippet. Id isn't accorded.");
        snippets[id].likeCount ++;
    }

    function flag(uint id, address author) public {
        require(snippets[id].snippetId == id, "Not found the snippet. Id isn't accorded.");
        snippets[id].flagCount ++;
    }

    // TODO: uint256 commision = 1; 
    function giveTips(uint id, address author) payable public nonReentrant {
        require(snippets[id].snippetId == id, "Not found the snippet. Id isn't accorded.");
        snippets[id].author.transfer(msg.value);
    }

    // function claim() canClaim(msg.sender) public {
        
        
    // }


}





