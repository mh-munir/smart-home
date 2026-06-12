import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'lab(95% 0 0)',
          100: 'lab(90% 5 5)',
          200: 'lab(80% 15 15)',
          300: 'lab(70% 30 30)',
          400: 'lab(60% 50 45)',
          500: 'lab(48.4493% 77.4328 61.5452)',
          600: 'lab(45% 80 64)',
          700: 'lab(40% 85 68)',
          800: 'lab(35% 90 72)',
          900: 'lab(30% 95 76)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
