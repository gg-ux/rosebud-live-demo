// Stub for react-native-vector-icons. Paper imports a few icon-set helpers
// from this package; in our web prototype repo we don't need the full
// icon-font infrastructure. We provide a no-op default icon component
// via PaperProvider settings.icon, so these exports just need to exist
// without erroring at module-load.
import { createElement } from 'react';

const NoopIcon = (props) => null;

export const createIconSet = () => NoopIcon;
export const createIconSetFromFontello = () => NoopIcon;
export const createIconSetFromIcoMoon = () => NoopIcon;
export const createMultiStyleIconSet = () => NoopIcon;

export default NoopIcon;
