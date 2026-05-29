import localFont from "next/font/local";

export const outfit = localFont({
    src: [
        { path: "./fonts/outfit-latin-400-normal.woff2", weight: "400" },
        { path: "./fonts/outfit-latin-700-normal.woff2", weight: "700" },
    ],
    display: "swap",
    variable: "--font-outfit",
});

// Handwriting font
export const patrick_hand = localFont({
    src: [
        { path: "./fonts/patrick-hand-latin-400-normal.woff2", weight: "400" },
    ],
    display: "swap",
    variable: "--font-patrick-hand",
});

export const dosis = localFont({
    src: [
        { path: "./fonts/dosis-latin-400-normal.woff2", weight: "400" },
        { path: "./fonts/dosis-latin-500-normal.woff2", weight: "500" },
        { path: "./fonts/dosis-latin-700-normal.woff2", weight: "700" },
    ],
    variable: "--font-dosis",
});

export const cabinSketch = localFont({
    src: [
        { path: "./fonts/cabin-sketch-latin-400-normal.woff2", weight: "400" },
        { path: "./fonts/cabin-sketch-latin-700-normal.woff2", weight: "700" },
    ],
    display: "swap",
    variable: "--font-cabin-sketch",
});
