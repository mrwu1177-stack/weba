/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // HelloYan brand colors
        background: '#0F1117',
        surface: '#121417',
        border: '#1A1D24',
        primary: '#FCD535', // Binance yellow
        success: '#4CAF50',
        danger: '#EF5350',
        warning: '#F59E0B',
        info: '#4A90E2',
        
        // Text colors
        'text-primary': '#E0E0E5',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
