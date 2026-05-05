import { mode } from '@chakra-ui/theme-tools';

const Skeleton = {
  baseStyle: (props) => ({
    startColor: mode('brandGray.300', 'brandGray.800')(props),
    endColor: mode('brandGray.400', 'brandGray.750')(props),
  }),
};

export default Skeleton;
