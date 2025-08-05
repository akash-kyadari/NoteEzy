/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3490dc',
          light: '#6cb2eb',
          dark: '#2779bd',
        },
        accent: {
          DEFAULT: '#6574cd',
          light: '#8795e0',
          dark: '#4a5568',
        },
        background: '#f8fafc',
        'text-dark': '#1a202c',
        'text-light': '#4a5568',
        success: '#38c172',
        warning: '#ffed4a',
        danger: '#e3342f',
      },
    },
  },
  plugins: [],
};
