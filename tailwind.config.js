/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9C6ADE",       // Calming purple for headings and accents
        secondary: "#5EEAD4",     // Soothing teal for interactive elements
        dark: "#1F2937",
        light: "#FFF8E1",         // Soft amber tone for light backgrounds
        "fish-white": "#FFF8E1",  // Soft off-white
        "mindful-yellow": "#FFF8E1", // Soft amber background
        "calm-blue": "#B39DDB",   // Secondary purple tone
        "serene-green": "#4DB6AC", // Secondary teal tone
        "warm-amber": "#FFECB3",  // Deeper amber tone
        "soft-rose": "#FEE2E2",
        "neuron-glow": "#9C6ADE", // Glow color for neurons
        "wave-color": "#5EEAD4"   // Color for wave animations
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'zigzag': 'zigzag 15s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.3)' },
        },
        wave: {
          '0%': { transform: 'translateX(0) scaleY(1)' },
          '50%': { transform: 'translateX(-25%) scaleY(0.8)' },
          '100%': { transform: 'translateX(0) scaleY(1)' },
        },
        zigzag: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-30%, 30%)' },
          '50%': { transform: 'translate(0, 60%)' },
          '75%': { transform: 'translate(30%, 30%)' },
          '100%': { transform: 'translate(0, 0)' },
        }
      }
    },
  },
  plugins: [],
}