require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

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
			url: process.env.INFURA_MUMBAI_URL,
			accounts: [process.env.ACCOUNT_PRIVATE_KEY],
		},
		rinkeby: {
			url: process.env.ALCHEMY_RINKEBY_URL,
			accounts: [process.env.ACCOUNT_PRIVATE_KEY],
		},

		// mainnet: {},
	},
}
