/**
 * Clerk ships its own look and computes its own colour shades, so it needs real
 * values rather than the CSS variables the rest of the app runs on. These are
 * the same palette, resolved per theme, so sign-in doesn't read as a
 * third-party screen bolted onto the product.
 */
const palette = {
  light: {
    ink: "#16181A",
    inkSoft: "#5B6165",
    page: "#F7F7F4",
    flag: "#B3372B",
  },
  dark: {
    ink: "#EBEBE4",
    inkSoft: "#9AA1A4",
    page: "#24282A",
    flag: "#E0665C",
  },
};

export const clerkAppearance = (isDark = false) => {
  const c = isDark ? palette.dark : palette.light;

  return {
    variables: {
      colorPrimary: c.ink,
      colorText: c.ink,
      colorTextSecondary: c.inkSoft,
      colorBackground: c.page,
      colorInputBackground: c.page,
      colorInputText: c.ink,
      colorDanger: c.flag,
      borderRadius: "0.5rem",
      fontFamily: "var(--font-sans), system-ui, sans-serif",
    },
    elements: {
      rootBox: "w-full max-w-[400px]",
      card: "bg-page border border-rule shadow-lift",
      headerTitle: "font-display text-ink",
      headerSubtitle: "text-ink-soft",
      socialButtonsBlockButton: "border-rule hover:bg-paper",
      formFieldInput: "border-rule",
      formButtonPrimary:
        "bg-ink text-page hover:bg-ink normal-case text-sm font-medium shadow-page",
      footerActionLink: "text-ink underline underline-offset-4",
    },
  };
};
