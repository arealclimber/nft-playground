# NFT Playground

This project is built to learn the NFT marketplace dApp.

- [NFT Playground](#nft-playground)
  - [🚀 Demo](#-demo)
  - [🧱 Features](#-features)
    - [NFT Creation](#nft-creation)
    - [NFT Market](#nft-market)
  - [👩🏻‍💻 Tech Stack](#-tech-stack)
    - [Frontend](#frontend)
    - [Blockchain](#blockchain)
  - [💗 Credit](#-credit)
  - [🖥 Acknowledgments](#-acknowledgments)
- [How to use](#how-to-use)
    - [Connect to Polygon Mumbai testnet](#connect-to-polygon-mumbai-testnet)
    - [Environment variables](#environment-variables)
    - [Run locally](#run-locally)
    - [Deploy your own with Vercel](#deploy-your-own-with-vercel)
- [Commands](#commands)
- [License](#license)

<!-- This project is started with the intention to make everyone in the world have fun with NFT.

NFT Playground is the community-oriented NFT-based ecosystem where everyone can share thoughts and get free NFTs (costing gas fee). -->

## 🚀 Demo

Live Demo

<!-- TODO: Gif and Link -->

## 🧱 Features

<!-- ![BUIDL](https://raw.githubusercontent.com/arealclimber/nft-playground/main/public/BUIDL.PNG) -->

### NFT Creation

- [x] Make your pictures NFT

### NFT Market

- [x] List your NFT for sale
- [x] Buy the NFT with mumbai testnet Matic
- [x] Delist your NFT from the marketplace

<!-- ### Fractionalized NFT

-   [ ] Vault contract tests -->

Made with 💙 by [Lumii](https://twitter.com/arealclimber)

## 👩🏻‍💻 Tech Stack

### Frontend

- Next.js
- Tailwind CSS
- daisyUI

### Blockchain

- Hardhat
- IPFS Protocol
- ERC721

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

## 💗 Credit

- Favicon and the carrot NFT painted by [Parry](https://www.instagram.com/parryfromfantasytostart/)

## 🖥 Acknowledgments

- Inspired by [Nader Dabit](https://dev.to/edge-and-node/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb)

- Pictures resource: [Unsplash](https://unsplash.com/)
- Image cropper: [iloveimg](https://www.iloveimg.com/crop-image)

# How to use

### Connect to Polygon Mumbai testnet

- Install [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) chrome extension
- Head over to [Chainlist](https://chainlist.org/) and search for Polygon, with the **Testnets** button turned on, and click **Connect Wallet** on Mumbai to get network config - [details](https://medium.com/stakingbits/how-to-connect-polygon-mumbai-testnet-to-metamask-fc3487a3871f)

![chainlist](https://github.com/arealclimber/nft-playground/blob/main/public/chainlist.PNG?raw=true)

### Environment variables

[Infura](https://infura.io/) - Appyly for IPFS API and Mumbai RPC for `.env`.

And set your test-only account private key.

### Run locally

- Clone this repo and install the package `npm install`
- Revise `.env.example` to `.env` and set configs
- `npm run dev` to run Next.js

### Deploy your own with Vercel

Remember to add the required environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farealclimber%2Fnft-playground)

# Commands

**Hardhat**

- `npx hardhat compile` to compile contracts and generate `abi` in `.json` of the folder `artifacts`

- `npx hardhat node` to run the localhost and get test accounts

- `npx hardhat test` to run test

  - ensure that the `defaultNetwork` in `hardhat.config.js` is `hardhat` and put the private key of the test account in `.env` to charge the hardhat account for smart contract tests

- `npx hardhat run scripts/deploy.js --network localhost` (recommended) **or** `node scripts/deploy.js --network localshost` to deploy on the localhost

```shell
npx hardhat accounts
npx hardhat clean
npx hardhat help
```

---

**Next.js**

- `npm run dev` to run dev mode

# License

[MIT License](https://github.com/arealclimber/nft-playground/blob/main/LICENSE)
