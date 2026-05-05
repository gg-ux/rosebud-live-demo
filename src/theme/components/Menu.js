import { mode } from '@chakra-ui/theme-tools';

const Menu = {
  baseStyle: { boxShadow: undefined },
  parts: ['list', 'item', 'button'],
  variants: {
    control: (props) => ({
      item: {
        _hover: { bg: mode('brandGray.50', 'brand.900')(props) },
        _focus: { bg: mode('brandGray.50', 'brand.900')(props) },
      },
    }),
    title: {
      item: { fontSize: { base: '17px', md: 'initial' } },
      list: { zIndex: 1101 },
    },
  },
};

export default Menu;
