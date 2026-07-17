/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#8B0000',
          light: '#B22222',
          dark: '#5C0000',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#E6C687',
          dark: '#8B6508',
        },
        cream: '#FFFDF8',
        chocolate: '#1F1F1F',
        beige: '#F5E6C8',
        charcoal: '#3A2D23',
        accent: '#F5E6C8',
        // Preserve helper names mapped to luxury palette
        turmeric: '#FFFDF8',
        cardamom: '#4E7D58',
        marigold: '#B8860B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(110, 30, 30, 0.08)',
        luxury: '0 20px 40px -15px rgba(45, 26, 18, 0.07)',
      },
    },
  },
  plugins: [],
}
