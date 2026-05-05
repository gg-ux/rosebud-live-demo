import { mode } from '@chakra-ui/theme-tools';

const Flex = {
  baseStyle: (props) => ({
    borderColor: mode('brandGray.100', 'brandGray.500')(props),
  }),
  variants: {
    card: (props) => ({ bg: mode('white', 'brand.900')(props) }),
  },
};

export default Flex;
