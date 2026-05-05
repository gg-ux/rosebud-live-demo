import { mode } from '@chakra-ui/theme-tools';

const Modal = {
  baseStyle: (props) => ({
    dialog: { bg: mode('white', 'brand.900')(props) },
  }),
};

export default Modal;
