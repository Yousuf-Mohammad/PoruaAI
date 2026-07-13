/**
 * Clerk ships its own look; these overrides pull its cards, buttons, and inputs
 * onto the app's paper-and-ink palette so sign-in doesn't read as a third-party
 * screen bolted onto the product.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#16181A",
    colorText: "#16181A",
    colorTextSecondary: "#5B6165",
    colorBackground: "#F7F7F4",
    colorInputBackground: "#F7F7F4",
    colorInputText: "#16181A",
    colorDanger: "#B3372B",
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
