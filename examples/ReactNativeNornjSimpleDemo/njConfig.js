import React, {
  Text,
  View
} from 'react-native';
import {
  setComponentEngine,
  registerComponent
} from 'nornj';

setComponentEngine('react', React);
registerComponent({ View, Text });