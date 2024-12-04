const colors = {
  breadgray: {
    "ultra-white": "#F8F8F8",
    white: "#E5E5E5",
    "light-grey": "#D4D4D4",
    grey: "#A3A3A3",
    rye: "#525252",
    toast: "#464646",
    burnt: "#343434",
    "og-dark": "#2E2E2E",
    charcoal: "#242424",
    darkest: "#272727",
    pitchblack: "#181818",
    "cta-bg": "#2c2c2c",
    grey300: "#222222",
    grey200: "#1c1c1c",
    grey100: "#181818",
  },
  breadpink: {
    pink: "#FF99E2",
    shaded: "#E873D3",
    100: "#C463CA",
    200: "#FF99E2",
    300: "#E873D3",
    400: "#A416AD",
    500: "#D04EC5",
    600: "#F5E8F6",
  },
  status: {
    danger: "#D8745C",
    "danger-light": "#CF2800",
    warning: "#F2D54E",
    success: "#9EC958",
  },
  breadviolet: {
    shaded: "#D04EC5",
    violet: "#A416AD",
  },
  "button-border": "#2E2E2E",
};

export const breadTheme = {
  colors,
  fontFamily: {
    pressstart: ["var(--font-pressstart)"],
    redhat: ["var(--font-redhat)"],
    poppins: ["Poppins", "sans-serif"],
  },
  screens: {
    "hero-image": "432px",
    "footer-sm": "580px",
    "footer-md": "600px",
    "footer-lg": "1075px",
  },
  borderRadius: {
    cta: "0.3125rem",
  },
  dropShadow: {
    swap: "0px 0px 50px 0px rgba(0, 0, 0, 0.50)",
  },
  gridTemplateColumns: {
    // Simple 16 column grid
    "faq-trigger": "1fr 24px",

    // Complex site-specific column configuration
    footer: "200px minmax(900px, 1fr) 100px",
  },
  /* @ts-ignore  */
  typography: ({ theme }) => ({
    pink: {
      css: {
        "--tw-prose-body": colors.breadgray.grey100,
        "--tw-prose-headings": theme("colors.neutral[300]"),
        "--tw-prose-lead": theme("colors.neutral[700]"),
        "--tw-prose-links": colors.breadgray.grey100,
        "--tw-prose-bold": theme("colors.neutral[200]"),
        "--tw-prose-counters": theme("colors.neutral[600]"),
        "--tw-prose-bullets": theme("colors.neutral[400]"),
        "--tw-prose-hr": theme("colors.neutral[300]"),
        "--tw-prose-quotes": theme("colors.neutral[900]"),
        "--tw-prose-quote-borders": theme("colors.neutral[300]"),
        "--tw-prose-captions": theme("colors.neutral[700]"),
        "--tw-prose-code": theme("colors.neutral[900]"),
        "--tw-prose-pre-code": theme("colors.neutral[100]"),
        "--tw-prose-pre-bg": theme("colors.neutral[900]"),
        "--tw-prose-th-borders": theme("colors.neutral[300]"),
        "--tw-prose-td-borders": theme("colors.neutral[200]"),
        "--tw-prose-invert-body": theme("colors.neutral[200]"),
        "--tw-prose-invert-headings": theme("colors.neutral[300]"),
        "--tw-prose-invert-lead": theme("colors.neutral[300]"),
        "--tw-prose-invert-links": theme("colors.white"),
        "--tw-prose-invert-bold": theme("colors.white"),
        "--tw-prose-invert-counters": theme("colors.neutral[400]"),
        "--tw-prose-invert-bullets": theme("colors.neutral[600]"),
        "--tw-prose-invert-hr": theme("colors.neutral[700]"),
        "--tw-prose-invert-quotes": theme("colors.neutral[100]"),
        "--tw-prose-invert-quote-borders": theme("colors.neutral[700]"),
        "--tw-prose-invert-captions": theme("colors.neutral[400]"),
        "--tw-prose-invert-code": theme("colors.white"),
        "--tw-prose-invert-pre-code": theme("colors.neutral[300]"),
        "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
        "--tw-prose-invert-th-borders": theme("colors.neutral[600]"),
        "--tw-prose-invert-td-borders": theme("colors.neutral[700]"),
      },
    },
  }),
};
