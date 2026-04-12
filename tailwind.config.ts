import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E88E5', dark: '#1565C0', light: '#42A5F5' },
        accent: { DEFAULT: '#F57C00', dark: '#E65100', light: '#FFA726' },
      },
    },
  },
  plugins: [],
}
export default config
