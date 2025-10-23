/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['KeepCalm', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'white-line-sweep': 'whiteLineSweep 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'white-line-expand': 'whiteLineExpand 0.15s linear forwards',
        'white-line-disappear': 'whiteLineDisappear 0.3s ease-out forwards',
        'fade-in-main-site': 'fadeInMainSite 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        whiteLineSweep: {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100vw)' },
        },
        whiteLineExpand: {
          '0%': { 
            height: '13rem',
            transform: 'translateX(-100vw) translateY(-50%)',
            top: '50vh'
          },
          '100%': { 
            height: '100vh',
            transform: 'translateX(-100vw) translateY(-50%)',
            top: '50vh'
          },
        },
        whiteLineDisappear: {
          '0%': { 
            height: '150vh',
            transform: 'translateX(-100vw)',
            opacity: '1'
          },
          '100%': { 
            height: '150vh',
            transform: 'translateX(-100vw)',
            opacity: '0'
          },
        },
        fadeInMainSite: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
