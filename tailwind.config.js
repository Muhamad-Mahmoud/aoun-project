/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Semantic Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
          dark: "hsl(var(--success-dark))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          light: "hsl(var(--warning-light))",
          dark: "hsl(var(--warning-dark))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
          light: "hsl(var(--error-light))",
          dark: "hsl(var(--error-dark))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          light: "hsl(var(--info-light))",
          dark: "hsl(var(--info-dark))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Warm Color Palette
        // Warm Color Palette
        "warm-green": {
          DEFAULT: "hsl(var(--warm-green))",
          light: "hsl(var(--warm-green-light))",
          dark: "hsl(var(--warm-green-dark))",
          lighter: "hsl(var(--warm-green-lighter))",
          pale: "hsl(var(--warm-green-pale))",
        },
        "golden-orange": {
          DEFAULT: "hsl(var(--golden-orange))",
          light: "hsl(var(--golden-orange-light))",
          dark: "hsl(var(--golden-orange-dark))",
          pale: "hsl(var(--golden-orange-pale))",
        },
        "pharaoh-gold": "hsl(var(--pharaoh-gold))",
        "sky-blue": {
          DEFAULT: "hsl(var(--sky-blue))",
          light: "hsl(var(--sky-blue-light))",
          dark: "hsl(var(--sky-blue-dark))",
          pale: "hsl(var(--sky-blue-pale))",
        },
        "royal-purple": {
          DEFAULT: "hsl(var(--royal-purple))",
          light: "hsl(var(--royal-purple-light))",
          pale: "hsl(var(--royal-purple-pale))",
        },
        "vibrant-cyan": {
          DEFAULT: "hsl(var(--vibrant-cyan))",
          light: "hsl(var(--vibrant-cyan-light))",
          pale: "hsl(var(--vibrant-cyan-pale))",
        },
        "emerald-green": {
          DEFAULT: "hsl(var(--emerald-green))",
          light: "hsl(var(--emerald-green-light))",
          pale: "hsl(var(--emerald-green-pale))",
        },
        "social": {
          facebook: "hsl(var(--social-facebook))",
          twitter: "hsl(var(--social-twitter))",
          instagram: "hsl(var(--social-instagram))",
          linkedin: "hsl(var(--social-linkedin))",
        },
        "warm-beige": "hsl(var(--warm-beige))",
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        footer: {
          DEFAULT: 'hsl(var(--footer-background))',
          foreground: 'hsl(var(--footer-foreground))',
          muted: 'hsl(var(--footer-muted))',
          border: 'hsl(var(--footer-border))',
        },
      },
      fontSize: {
        'hero-desktop': ['64px', { lineHeight: '1.2', fontWeight: '900' }],
        'hero-mobile': ['48px', { lineHeight: '1.2', fontWeight: '900' }],
        'h2-desktop': ['48px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2-mobile': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['20px', { lineHeight: '1.8' }],
        'body': ['18px', { lineHeight: '1.8' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        counter: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "counter": "counter 0.5s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
