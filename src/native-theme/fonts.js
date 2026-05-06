// Note: web variant. The native app references Circular* font families that are
// loaded as .ttf assets via Expo Font. In the browser we use 'Circular Std'
// (loaded via tokens.css @font-face) and rely on weight-based selection
// rather than separate font-family names per weight.
const baseFont = {
  fontFamily: 'Circular Std, system-ui, sans-serif',
  letterSpacing: 0.1,
};

export const FontWeight = {
  light: 300,
  regular: 450,
  regularItalic: 450,
  medium: 500,
  bold: 700,
  black: 900,
};

export const fontStyle = {
  displayLarge:  { ...baseFont, fontWeight: 500, fontSize: 24, lineHeight: 32 },
  displayMedium: { ...baseFont, fontWeight: 500, fontSize: 22, lineHeight: 30 },
  displaySmall:  { ...baseFont, fontWeight: 500, fontSize: 20, lineHeight: 28 },
  titleLarge:    { ...baseFont, fontWeight: 500, fontSize: 17, lineHeight: 23 },
  titleMedium:   { ...baseFont, fontWeight: 500, fontSize: 16, lineHeight: 22 },
  titleSmall:    { ...baseFont, fontWeight: 500, fontSize: 15, lineHeight: 21 },
  labelLarge:    { ...baseFont, fontWeight: 450, fontSize: 14 },
  labelMedium:   { ...baseFont, fontWeight: 450, fontSize: 13, lineHeight: 18 },
  labelSmall:    { ...baseFont, fontWeight: 450, fontSize: 12 },
  bodyLarge:     { ...baseFont, fontWeight: 450, fontSize: 17, lineHeight: 23 },
  bodyMedium:    { ...baseFont, fontWeight: 450, fontSize: 16, lineHeight: 22 },
  bodySmall:     { ...baseFont, fontWeight: 450, fontSize: 15, lineHeight: 20 },
};
