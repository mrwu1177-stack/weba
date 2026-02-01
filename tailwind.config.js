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
        // HelloYan brand colors (2.0)
        background: '#0F1117',
        surface: '#121417',
        border: '#1A1D24',
        primary: '#FCD535', // Binance yellow (主色)
        success: '#4CAF50',
        danger: '#FB923C', // 改为橙色（替代红色）
        warning: '#F59E0B',
        info: '#06B6D4',   // 改为青色（替代蓝色）
        
        // 新增色系（用于渐变）
        'accent-teal': '#14B8A6',
        'accent-orange': '#FB923C',
        'accent-cyan': '#06B6D4',
        
        // Text colors
        'text-primary': '#E0E0E5',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FCD535 0%, #F99D1C 100%)',
        'gradient-accent': 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FB923C 0%, #F59E0B 100%)',
        'gradient-fear-greed': 'linear-gradient(90deg, #FB923C 0%, #F59E0B 50%, #4CAF50 100%)',
      },
    },
  },
  plugins: [],
}
