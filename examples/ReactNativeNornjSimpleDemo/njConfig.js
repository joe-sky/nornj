import React, {
  Text,
  View
} from 'react-native';
import nj, {
  setComponentEngine,
  registerComponent
} from '../../src/base.js';

setComponentEngine('react', React);
registerComponent({ View, Text });