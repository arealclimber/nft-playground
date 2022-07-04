require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');
// const dotenv = require('dotenv');
// dotenv.config({ path: '/.env' });
require('dotenv').config();

const {
	INFURA_MUMBAI_URL,
	ACCOUNT_PRIVATE_KEY,
	ALCHEMY_RINKEBY_URL,
	MUMBAI_API_KEY,
} = process.env;
// console.log(require('dotenv').config());
// console.log('process.env.ACCOUNT_PRIVATE_KEY', process.env.ACCOUNT_PRIVATE_KEY);

module.exports = {
	solidity: {
		version: '0.8.4',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	defaultNetwork: 'mumbai',
	networks: {
		hardhat: {
			chainId: 1337,
		},
		mumbai: {
			url: INFURA_MUMBAI_URL,
			accounts: [ACCOUNT_PRIVATE_KEY],
		},
		rinkeby: {
			url: ALCHEMY_RINKEBY_URL,
			accounts: [ACCOUNT_PRIVATE_KEY],
		},
		// mainnet: {},
	},
	etherscan: {
		apiKey: {
			polygonMumbai: MUMBAI_API_KEY,
		},
	},
};
