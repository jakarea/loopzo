/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './layout/**/*.liquid',
        './sections/**/*.liquid',
        './snippets/**/*.liquid',
        './templates/**/*.liquid',
        './templates/**/*.json',
        './frontend/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#334155',
                    dark: '#1e293b',
                    darker: '#0f172a',
                    light: '#475569'
                }
            }
        }
    },
    plugins: []
}
