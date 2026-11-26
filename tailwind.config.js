import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
  		transitionTimingFunction: {
  			soft: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			cream: 'hsl(var(--cream) / <alpha-value>)',
  			butter: 'hsl(var(--butter) / <alpha-value>)',
  			caramel: 'hsl(var(--caramel) / <alpha-value>)',
  			blush: 'hsl(var(--blush) / <alpha-value>)',
  			sage: 'hsl(var(--sage) / <alpha-value>)',
  			olive: 'hsl(var(--olive) / <alpha-value>)',
  			taupe: 'hsl(var(--taupe) / <alpha-value>)',
  			cocoa: {
  				DEFAULT: 'hsl(var(--cocoa) / <alpha-value>)',
  				deep: 'hsl(var(--cocoa-deep) / <alpha-value>)',
  				soft: 'hsl(var(--cocoa-soft) / <alpha-value>)'
  			},
  			mint: {
  				DEFAULT: 'hsl(var(--mint) / <alpha-value>)',
  				deep: 'hsl(var(--mint-deep) / <alpha-value>)',
  				soft: 'hsl(var(--mint-soft) / <alpha-value>)'
  			},
  			lagoon: {
  				DEFAULT: 'hsl(var(--lagoon) / <alpha-value>)',
  				deep: 'hsl(var(--lagoon-deep) / <alpha-value>)',
  				soft: 'hsl(var(--lagoon-soft) / <alpha-value>)'
  			},
  			oat: 'hsl(var(--oat) / <alpha-value>)',
  			paper: 'hsl(var(--paper) / <alpha-value>)',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			hand: ['var(--font-hand)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [animate],
}
