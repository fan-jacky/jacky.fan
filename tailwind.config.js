const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

const config = {
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    ],
    theme: {
        container: {
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
        },
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        fontFamily: {
            outfit: ["var(--font-outfit)", ...defaultTheme.fontFamily.sans],
            patrick_hand: [
                "var(--font-patrick-hand)",
                ...defaultTheme.fontFamily.sans,
            ],
            dosis: ["var(--font-dosis)", ...defaultTheme.fontFamily.sans],
            cabin_sketch: [
                "var(--font-cabin-sketch)",
                ...defaultTheme.fontFamily.sans,
            ],
        },
    },
    plugins: [
        require("daisyui"),
        plugin(function ({ addBase }) {
            addBase({
                html: { fontSize: "18px" },
            });
        }),
        require('@tailwindcss/typography'),
    ],
    daisyui: {
        themes: [
            {
                nord: {
                    ...require("daisyui/src/theming/themes")["nord"],
                    primary: "#0764CE",
                    "secondary": "#65c3c8",
                    "secondary-content": "#291334",
                    accent: "#88C0D0",
                    neutral: "#4C566A",
                    "neutral-content": "#D8DEE9",
                    "base-100": "#ECEFF4",
                    "base-200": "#E5E9F0",
                    "base-300": "#D8DEE9",
                    "base-content": "#2E3440",
                    info: "#B48EAD",
                    success: "#A3BE8C",
                    warning: "#EBCB8B",
                    error: "#BF616A",
                    "--rounded-box": "1.2rem",
                    "--rounded-btn": "0.8rem",
                    "--rounded-badge": "0.4rem",
                    "--tab-radius": "0.7rem",
                },
            },
            "sunset",
        ],
        darkTheme: "night",
        base: false,
        styled: true,
        utils: true,
        logs: false,
    },
};

module.exports = config;
