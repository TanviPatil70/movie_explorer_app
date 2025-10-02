module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add more paths here if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp'),
],
};
