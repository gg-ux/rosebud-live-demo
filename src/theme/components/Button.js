import { mode } from '@chakra-ui/theme-tools';

const Button = {
  baseStyle: {
    color: 'white',
    rounded: 'lg',
  },
  variants: {
    primary: {
      background: 'brand.500',
      color: 'white',
      _hover: {
        background: 'brand.500',
        border: 0,
        _disabled: { background: 'brand.500', opacity: 0.5 },
      },
      border: 0,
    },
    solid: (props) => ({
      color: mode('brand.900', 'white')(props),
    }),
    panel: (props) => ({
      color: mode('brand.900', 'white')(props),
      bg: mode('gray.100', 'gray.800')(props),
      _hover: { bg: mode('gray.200', 'gray.700')(props) },
      _active: { bg: mode('gray.200', 'gray.700')(props) },
      _focus: { bg: mode('gray.200', 'gray.700')(props) },
    }),
    secondary: (props) => ({
      color: mode('brand.900', 'white')(props),
      bg: mode('brandGray.200', 'gray.700')(props),
      _hover: { bg: mode('brandGray.300', 'gray.700')(props) },
      _active: { bg: mode('brandGray.300', 'gray.700')(props) },
      _focus: { bg: mode('brandGray.300', 'gray.700')(props) },
    }),
    outline: (props) => ({
      background: mode('white', 'brand.900')(props),
      border: '1px solid',
      borderColor: mode('brandGray.200', 'brandGray.700')(props),
      _hover:
        props.colorMode === 'dark'
          ? { background: mode('white', 'brand.900')(props), borderColor: 'brandGray.600' }
          : { borderColor: 'brandGray.300', bg: 'white' },
    }),
    ghost: {
      background: 'transparent',
      border: 'transparent',
      _hover: { background: 'transparent', border: 'transparent' },
      _active: { background: 'transparent', border: 'transparent' },
      _focus: { background: 'transparent', border: 'transparent' },
    },
  },
};

export default Button;
