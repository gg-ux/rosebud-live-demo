// 4dp grid base unit for spacing calculations
const kGridBaseUnit = 4;

export const space = (n) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const isHalfStep = Number.isInteger(n * 2);
    if (!isHalfStep) {
      console.warn(`[space] off-grid: ${n}. Use integers or .5 steps.`);
    }
  }
  return n * kGridBaseUnit;
};

const radiusMap = {
  none: 0, xxs: 4, xs: 6, sm: 8, md: 10,
  lg: 12, xl: 16, '2xl': 18, '3xl': 24, full: 999,
};

export const radius = (key) => radiusMap[key];

const borderMap = { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 };

export const border = (key) => borderMap[key];
