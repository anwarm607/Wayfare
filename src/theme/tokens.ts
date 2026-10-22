export const colors = {
  background: '#F3F5F7',
  surface: '#FFFFFF',
  primary: '#F1521F',
  text: '#111F2C',
  muted: '#7C8B99',
  placeholder: '#9CA3AF',
  border: '#E6EBEF',
  disabled: '#A9B4BE',
  // Interaction/error states are additions to the Figma resting-state design.
  error: '#B42318',
  overlay: 'rgba(17, 31, 44, 0.45)',
} as const;

export const fonts = {
  regular: 'NunitoSansRegular',
  semiBold: 'NunitoSansSemiBold',
  bold: 'NunitoSansBold',
  extraBold: 'NunitoSansExtraBold',
} as const;

export const typography = {
  hero: { fontFamily: fonts.extraBold, fontSize: 32, lineHeight: 36.8, letterSpacing: -0.8 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 24.38 },
  label: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 22.5 },
  input: { fontFamily: fonts.semiBold, fontSize: 15, lineHeight: 22.5 },
  action: { fontFamily: fonts.extraBold, fontSize: 17, lineHeight: 25.5 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  link: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 21 },
  screenTitle: { fontFamily: fonts.extraBold, fontSize: 26, lineHeight: 32.5, letterSpacing: -0.65 },
  dialogTitle: { fontFamily: fonts.extraBold, fontSize: 24, lineHeight: 30 },
  locationLabel: { fontFamily: fonts.extraBold, fontSize: 12, lineHeight: 18, letterSpacing: 0.96 },
  sectionLabel: { fontFamily: fonts.extraBold, fontSize: 13, lineHeight: 19.5, letterSpacing: 1.04 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19.5 },
} as const;

export type TypographyVariant = keyof typeof typography;
export type ColorToken = keyof typeof colors;

export const layout = {
  loginInset: 24,
  plannerInset: 20,
  loginContentWidth: 432,
  contentWidth: 440,
  footerBottomSpace: 28,
  controlRadius: 16,
  cardRadius: 24,
} as const;
