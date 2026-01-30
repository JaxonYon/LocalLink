import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#F0F7F8',
					100: '#D9EEF0',
					200: '#B4DDE1',
					300: '#8FCBD2',
					400: '#66B7C1',
					500: '#3C9FAF',
					600: '#2B7F8D',
					700: '#225F6A',
					800: '#1A454E',
					900: '#102D33',
				},
				orange: {
					light: '#ff914d',
					dark: '#fe751f',
				},
				teal: {
					light: '#44c0c5',
					medium: '#0097b2',
					dark: '#0d6980',
				},
				surface: {
					DEFAULT: '#FFFFFF',
					subtle: '#F7F8FA',
					muted: '#F1F3F5',
				},
				border: {
					DEFAULT: '#E2E8F0',
					strong: '#CBD5E1',
				},
				text: {
					DEFAULT: '#0F172A',
					muted: '#475569',
					subtle: '#64748B',
					inverted: '#F8FAFC',
				},
				muted: '#F1F5F9',
			},
			fontFamily: {
				// sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				subtle: '0 1px 2px rgba(15, 23, 42, 0.06)',
			},
		},
	},
	plugins: [],
};

export default config;
