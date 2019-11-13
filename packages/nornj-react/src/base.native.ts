import njr from './core';
import nj, { registerComponent } from 'nornj';
import { bindTemplate } from './bindTemplate';
import './extension/debounce';
import React from 'react';
import {
  ActivityIndicator,
  Button,
  DatePickerIOS,
  DrawerLayoutAndroid,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ListView,
  Modal,
  NavigatorIOS,
  Picker,
  PickerIOS,
  ProgressBarAndroid,
  ProgressViewIOS,
  ScrollView,
  SectionList,
  SegmentedControlIOS,
  Slider,
  SnapshotViewIOS,
  Switch,
  RefreshControl,
  StatusBar,
  SwipeableListView,
  TabBarIOS,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewPagerAndroid
} from 'react-native';

registerComponent({
  ActivityIndicator,
  Button,
  DatePickerIOS,
  DrawerLayoutAndroid,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ListView,
  Modal,
  NavigatorIOS,
  Picker,
  PickerIOS,
  ProgressBarAndroid,
  ProgressViewIOS,
  ScrollView,
  SectionList,
  SegmentedControlIOS,
  Slider,
  SnapshotViewIOS,
  Switch,
  RefreshControl,
  StatusBar,
  SwipeableListView,
  TabBarIOS,
  Text,
  TextInput: {
    component: TextInput,
    options: {
      changeEventName: 'onChangeText'
    }
  },
  ToolbarAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewPagerAndroid
});

nj.assign(njr, {
  bindTemplate,
  registerTmpl: bindTemplate
});

//Set createElement function for NornJ
nj.config({
  createElement: React.createElement,
  outputH: true,
  delimiters: {
    start: '{',
    end: '}',
    comment: ''
  }
});

const { global: _global } = nj;
_global.NornJReact = _global.njr = njr;

export { bindTemplate, bindTemplate as registerTmpl };
export default njr;
