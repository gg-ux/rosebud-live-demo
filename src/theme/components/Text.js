import { mode } from '@chakra-ui/theme-tools';

const Text = {
  variants: {
    secondary: (props) => ({ color: mode('brandGray.500', 'brandGray.400')(props) }),
    tertiary: { color: 'brandGray.500' },
    highlight: (props) => ({ color: mode('blue.600', 'blue.300')(props) }),
  },
};

export default Text;
