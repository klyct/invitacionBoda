/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                alexbrush: ['"Alex Brush"', 'cursive'],
                roboto: ['"Roboto Condensed"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
