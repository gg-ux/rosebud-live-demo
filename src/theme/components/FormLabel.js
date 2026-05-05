import { mode } from '@chakra-ui/theme-tools';

const FormLabel = {
  baseStyle: (props) => ({
    mb: 0,
    color: mode('brandGray.500', 'white')(props),
  }),
};

export default FormLabel;
