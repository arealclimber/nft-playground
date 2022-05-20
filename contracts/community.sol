// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


// Accumulate the ERC20 token for exchaging the TREE NFT!
contract Feeds is Ownable, ReentrancyGuard {
    uint memberCount;

    struct Snippet {
        uint likeCount;
        address author;
        string content;
        bool restricted;

    }

    // Tree NFT of ERC20 !!

    mapping(address => uint) membership;

    Snippet[] public snippets;

    modifier ifMemeber(address checkAddress) {
        require(membership[checkAddress] > 0);
        _;
    }


    

}
