/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--bg)',
                surface: 'var(--surface)',
                elev: 'var(--elev)',
                text: 'var(--text)',
                muted: 'var(--muted)',
                border: 'var(--border)'
            },
            borderRadius: {
                xl: '14px',
                '2xl': '16px'
            },
            boxShadow: {
                elev: '0 10px 30px rgba(0,0,0,.25)'
            }
        },
    },
    plugins: [],
}
