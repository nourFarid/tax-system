/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Cairo: ['"Cairo"', 'sans-serif'],
      },
      // Custom breakpoints for mobile, tablet, PC, and TV
      screens: {
        'xs': '480px',      // Large phones
        'sm': '640px',      // Small tablets
        'md': '768px',      // Tablets
        'lg': '1024px',     // Laptops/Desktops
        'xl': '1280px',     // Large desktops
        '2xl': '1536px',    // Ultra-wide monitors
        '3xl': '1920px',    // Full HD TVs
        '4xl': '2560px',    // 4K TVs
      },
      
      // Your main color palette based on #16267a
      colors: {
        primary: {
          50: '#eef0f9',
          100: '#d9ddf1',
          200: '#b3bce3',
          300: '#8c9ad5',
          400: '#6679c7',
          500: '#01235E',  // Your main color
          600: '#121e62',
          700: '#0e1749',
          800: '#0a0f31',
          900: '#050818',
        },
        secondary: '#ffffff',
        accent: '#4a90e2',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
      // Custom spacing for responsive design
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      
      // Custom font sizes for all screen sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        'tv': ['8rem', { lineHeight: '1.1' }],  // Extra large for TVs
      },
    },
  },
  plugins: [],
}
