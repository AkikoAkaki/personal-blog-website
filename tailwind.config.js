/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                cormorantGaramond: ['var(--font-cormorant-garamond)', 'serif'],
                poppins: ['var(--font-poppins)', 'sans-serif'],
                'sans-sc': ['var(--font-noto-sans-sc)', 'sans-serif'],
                'serif-sc': ['var(--font-noto-serif-sc)', 'serif'],
            },
        },
    },
    plugins: [],
};
