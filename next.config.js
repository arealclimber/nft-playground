/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		INFURA_IPFS_PROJECT_ID: process.env.INFURA_IPFS_PROJECT_ID,
		INFURA_IPFS_PROJECT_SECRET: process.env.INFURA_IPFS_PROJECT_SECRET,
		// ACCOUNT_PRIVATE_KEY: process.env.ACCOUNT_PRIVATE_KEY,
		ALCHEMY_MUMBAI_URL: process.env.ALCHEMY_MUMBAI_URL,
		ALCHEMY_MUMBAI_ID: process.env.ALCHEMY_MUMBAI_ID,
		INFURA_MUMBAI_URL: process.env.INFURA_MUMBAI_URL,
		ALCHEMY_RINKEBY_URL: process.env.ALCHEMY_RINKEBY_URL,
	},
};

module.exports = nextConfig;
