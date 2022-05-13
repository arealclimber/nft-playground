require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			chainId: 1337,
		},
		mumbai: {
			url: process.env.ALCHEMY_MUMBAI_URL,
			accounts: [process.env.ACCOUNT_PRIVATE_KEY],
		},
		// mainnet: {},
	},
	solidity: '0.8.4',
};
