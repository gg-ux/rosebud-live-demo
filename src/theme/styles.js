import { mode } from '@chakra-ui/theme-tools';

// Note: with <ChakraProvider disableGlobalStyle={true}>, only Chakra-rendered
// elements use these defaults — Tailwind pages elsewhere are unaffected.
const styles = {
  global: (props) => ({
    body: {
      fontFamily: 'Circular Std, system-ui, sans-serif',
      background: mode('brandGray.100', 'brandGray.900')(props),
      color: mode('gray.800', 'white.900')(props),
    },
    '.chakra-menu__menu-list': {
      boxShadow: 'none !important',
    },
  }),
};

export default styles;
