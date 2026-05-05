import { mode } from '@chakra-ui/theme-tools';

const Input = {
  baseStyle: (props) => ({
    background: mode('white', 'bg')(props),
    _focus: { borderColor: mode('brandGray.500', 'brandGray.700')(props) },
  }),
  variants: {
    readonly: (props) => ({
      background: mode('brandGray.100', 'brandGray.500')(props),
    }),
  },
};

export default Input;
