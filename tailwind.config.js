/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			// Serif font
			fontFamily: {
				serif: "var(--serif)",
			},
			animation: {
				wiggle: "wiggle 2000ms ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
