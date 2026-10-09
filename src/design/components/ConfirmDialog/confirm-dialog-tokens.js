// User-approved confirmation dialog parameters (2026-10-09).
// Values are scoped to this component; shared foundation roles stay unchanged.
export const confirmDialogTokens = {
  overlay: { position: "fixed", inset: 0, display: "grid", placeItems: "center", zIndex: 1000, background: "rgba(48, 56, 68, 0.5)" },
  dialog: { width: "440px", maxWidth: "calc(100vw - 32px)", background: "#FFFFFF", border: "1px solid #E4E7EC", borderRadius: "12px", boxShadow: "0 16px 40px rgba(32, 42, 56, 0.20)", overflow: "hidden" },
  content: { padding: "24px 24px 12px", gap: "12px" },
  icon: { size: "32px", borderRadius: "999px", iconSize: "16px" },
  title: { fontFamily: '"DIN 2014", Arial, sans-serif', fontSize: "16px", fontWeight: 700, lineHeight: 1.35, color: "#252F3E" },
  description: { marginTop: "6px", fontFamily: '"DIN 2014", Arial, sans-serif', fontSize: "13px", fontWeight: 400, lineHeight: 1.5, color: "#667085" },
  footer: { padding: "12px 24px 24px", gap: "8px", justifyContent: "flex-end" },
  button: { height: "36px", paddingInline: "16px", borderRadius: "8px", fontFamily: '"DIN 2014", Arial, sans-serif', fontSize: "14px", fontWeight: 700 },
  cancelButton: { background: "#FFFFFF", border: "1px solid #D0D5DD", color: "#344054" },
};

export const confirmDialogVariants = {
  default: { iconBackground: "#FFF3E7", iconColor: "#CF8A20", confirmBackground: "#CF8A20", confirmBorder: "#CF8A20", confirmColor: "#FFFFFF" },
  warning: { iconBackground: "#FFF3E7", iconColor: "#CF8A20", confirmBackground: "#CF8A20", confirmBorder: "#CF8A20", confirmColor: "#FFFFFF" },
  danger: { iconBackground: "#FFF0F0", iconColor: "#C93636", confirmBackground: "#C93636", confirmBorder: "#C93636", confirmColor: "#FFFFFF" },
};
