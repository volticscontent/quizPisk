import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'card-bg': 'var(--card-background)',
        border: 'var(--border-color)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, var(--gradient-warm-start) 0%, var(--gradient-warm-middle) 50%, var(--gradient-warm-end) 100%)',
        'gradient-passion': 'linear-gradient(135deg, var(--gradient-passion-start) 0%, var(--gradient-passion-end) 100%)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config 