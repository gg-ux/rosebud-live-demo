import colors from '../colors';

export const scrollBarCss = (mode) => {
  const scrollbarColor = mode === 'light' ? colors.gray[300] : colors.gray[600];
  const scrollbarHoverColor = mode === 'light' ? colors.gray[300] : colors.gray[500];
  const backgroundColor = mode === 'light' ? colors.gray[100] : colors.gray[800];
  return {
    '&::-webkit-scrollbar': { width: '6px', height: '6px' },
    '&:hover::-webkit-scrollbar-corner': { background: backgroundColor },
    '&:hover::-webkit-scrollbar-thumb': { background: scrollbarColor, borderRadius: '4px' },
    '&:hover::-webkit-scrollbar-thumb: hover': { background: scrollbarHoverColor },
    '&::-webkit-scrollbar-track': { opacity: 0 },
    '&::-webkit-scrollbar-corner': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': { background: 'transparent', borderRadius: '4px' },
    '&::-webkit-scrollbar-thumb: hover': { background: 'transparent' },
  };
};

export const hiddenScrollBarCss = () => ({
  '&': { scrollbarWidth: 'none', msOverflowStyle: 'none' },
  '&::-webkit-scrollbar': { width: 0, height: 0 },
});

export default scrollBarCss;
