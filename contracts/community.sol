// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Feeds {
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
