/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index/html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /text-(red|green|blue|gray)-\d*/,
    },
    {
      pattern: /border-gray-\d*/,
    },
    {
      pattern: /border.*/,
    },
  ],
}
