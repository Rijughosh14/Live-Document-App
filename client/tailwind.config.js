/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      height:{
        '128':'32rem'
      },
      width:{
        '128':'23rem',
        '90p':'90%'
      }
    },
  },
  plugins: [],
}