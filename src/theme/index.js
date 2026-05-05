import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';
import colors from './colors';
import semanticTokens from './semanticTokens';
import styles from './styles';
import Accordion from './components/Accordion';
import Button from './components/Button';
import Flex from './components/Flex';
import FormLabel from './components/FormLabel';
import Input from './components/Input';
import Link from './components/Link';
import Menu from './components/Menu';
import Modal from './components/Modal';
import Panel from './components/Panel';
import Skeleton from './components/Skeleton';
import Tabs from './components/Tabs';
import TextStyles from './components/Text';

export const breakpoints = {
  xs: 320,
  sm: 400,
  md: 768,
  lg: 960,
  xl: 1200,
  '2xl': 1536,
  xxl: 2048,
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  breakpoints,
  colors,
  styles,
  semanticTokens,
  fonts: {
    body: 'Circular Std, system-ui, sans-serif',
    heading: 'Circular Std, system-ui, sans-serif',
  },
  components: {
    Accordion,
    Button,
    Flex,
    FormLabel,
    Input,
    Link,
    Menu,
    Modal,
    Panel,
    Skeleton,
    Tabs,
    Text: TextStyles,
  },
  zIndices: {
    ...defaultTheme.zIndices,
    pushed: 20,
  },
});

export default theme;
