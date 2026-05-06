import { RBDarkTheme } from '../dark';
import { RBLightTheme } from '../light';

export const kPrimaryColors = ['default', 'green', 'blue', 'rose', 'orange', 'purple'];

const variantMap = {
  green: { primary: 'rgb(29, 155, 94)', onPrimary: 'rgb(255, 255, 255)' },
  blue: { primary: 'rgb(81, 132, 211)', onPrimary: 'rgb(255, 255, 255)' },
  rose: { primary: 'rgb(227, 22, 101)', onPrimary: 'rgb(255, 255, 255)' },
  orange: { primary: 'rgb(218, 101, 90)', onPrimary: 'rgb(255, 255, 255)' },
  purple: { primary: 'rgb(140, 60, 144)', onPrimary: 'rgb(255, 255, 255)' },
};

export function getColors(mode, color) {
  const base = mode === 'dark' ? RBDarkTheme.colors : RBLightTheme.colors;
  if (color === 'default' || !variantMap[color]) return base;
  return { ...base, ...variantMap[color] };
}

export function getTheme(mode, color = 'default') {
  const baseTheme = mode === 'dark' ? RBDarkTheme : RBLightTheme;
  return { ...baseTheme, colors: getColors(mode, color) };
}
