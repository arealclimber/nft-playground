module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
		fontFamily: {
			'custom': ['Ubuntu', 'ubuntu-mono', 'sans-serif'],
			'openSans': ['open-sans', 'sans-serif'],
			'slim': ['karla', 'mukta'],
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [{}, 'forest', 'lemonade'],
	},
}
