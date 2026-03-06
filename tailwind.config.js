/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ue: {
          bg: {
            dark: '#1E1E1E',
            medium: '#2D2D2D',
            light: '#383838',
            hover: '#454545',
          },
          primary: {
            DEFAULT: '#23478F', // Deep Cobalt Blue
            hover: '#2D5AB8',
            active: '#1A366F',
          },
          text: {
            primary: '#E0E0E0',
            secondary: '#B0B0B0',
            muted: '#808080',
          },
          asset: {
            anim: '#F2994A',
            model: '#2D9CDB',
            audio: '#9B59B6',
            effect: '#EB5757',
            material: '#6FCF97',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ue-panel': '0 4px 12px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
