# NFT Playground

This project is built to learn the NFT marketplace dApp.

<!-- This project is started with the intention to make everyone in the world have fun with NFT.

NFT Playground is the community-oriented NFT-based ecosystem where everyone can share thoughts and get free NFTs (costing gas fee). -->

## 🧱 Features 🔨

![BUIDL](https://raw.githubusercontent.com/arealclimber/nft-playground/main/public/BUIDL.PNG)

### NFT Creation

-   [x] Make your pictures NFT

### NFT Market Functionality

-   [x] List your NFT for sale
-   [x] Buy the NFT with mumbai testnet Matic
-   [ ] Delist your NFT from the marketplace

Made with 💙 by [Lumii](https://twitter.com/arealclimber)

## Tech stack

### Frontend

-   Next.js
    -   Web3Modal
    -   Ethers.js
-   Tailwind CSS
-   daisyUI

### Blockchain

-   Hardhat
-   IPFS Protocol

<!-- ## Community😋

### Share to Earn

-   [ ] Send messages like Twitter and Get your articles to be NFT with a \***one-click**\* button.
-   [ ] As your messages help more people (getting more likes), you can earn the beautiful NFT created by collaborative artists.

### Welcome every creators!

-   [ ] Welcome any artists, writers, or people who're passionate about the world or the environment to share the love here!

## NFT Create & Sell🎉

#### Make your memory NFTs

-   [x] Drag and drop your pictures and have them be NFTs.
-   [ ] Show off your one-of-a-kind precise NFTs on our platform or any other social media.
-   [ ] Give your NFT to your friends as convenient as you want

#### NFT Marketplace

-   [x] You can sell or trade your \***fresh**\* NFT here

## NFT Fractions🎈

#### Add liquidity to your valuable NFTs

-   [ ] Fractionalized your NFTs

-   [ ] Lend or borrow with NFTs

## More Friendly Designs🧶

#### Wallet integrations, fiat-to-crypto bridges, and more

-   [ ] Make the Crypto world more available to the world -->

## Credit 💗

-   Favicon and the carrot NFT created by [Parry](https://www.instagram.com/parryfromfantasytostart/)

## Acknowledgments 🖥

-   [Nader Dabit](https://twitter.com/dabit3)

    -   Tutorial about building NFT Marketplace ([YouTube](https://www.youtube.com/watch?v=GKJBEEXUha0) & [Dev.to](https://dev.to/edge-and-node/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb))

# Commands

**Hardhat:**

-   `npx hardhat compile` to compile contracts and generate `abi` in `.json` of the folder `artifacts`

-   `npx hardhat node` to run the localhost and get test accounts

-   `npx hardhat test` to run test

    -   ensure that the `defaultNetwork` in `hardhat.config.js` is `hardhat` and put the private key of the test account in `.env` to charge the hardhat account for smart contract tests

-   `npx hardhat run scripts/deploy.js --network localhost` (much faster) **or** `node scripts/deploy.js --network localshost` to deploy on the localhost

```shell
npx hardhat accounts
npx hardhat clean
npx hardhat help
```

# License

[MIT License](https://github.com/arealclimber/nft-playground/blob/main/LICENSE)
