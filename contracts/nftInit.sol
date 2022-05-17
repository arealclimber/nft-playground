// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// // import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// // import "@openzeppelin/contracts/access/Ownable.sol";
// // import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


// contract NFT is ERC721URIStorage {
//     using Strings for uint256;
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;
//     address contractAddress;

//     bool public isBase;
//     address public owner;

//     constructor() ERC721 ("NFT", "NFT") {
//         isBase = true;
//     }

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Error: Only owner");
//         _;
//     }

//     // constructor(address marketplaceAddress) ERC721("NFT", "NFT") {
//     //     contractAddress = marketplaceAddress;
//     // }

//     // constructor(string memory name_, string memory symbol_, address marketplaceAddress) ERC721(name_, symbol_) {
//     //     contractAddress = marketplaceAddress;
//     // }

//     function initialize(address _owner, address marketplaceAddress) external {
//         require(isBase == false, "Error: The base contract cannot initialized.");
//         require(owner == address(0));
//         owner = _owner;

//     }


//     function createToken(string memory tokenURI) external onlyOwner returns (uint) {
//         _tokenIds.increment();
//         uint256 newItemId = _tokenIds.current();

//         _safeMint(msg.sender, newItemId);
//         _setTokenURI(newItemId, tokenURI);
//         setApprovalForAll(contractAddress, true);

//         return newItemId;
//     }


// }
