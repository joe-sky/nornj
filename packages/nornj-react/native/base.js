import njr from '../lib/core';
import nj, { registerComponent } from 'nornj';
import bindTemplate from '../lib/bindTemplate';
import '../lib/extension/debounce';
import React from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  ART,
  Button,
  DatePickerIOS,
  DrawerLayoutAndroid,
  FlatList,
  Image,
  ImageBackground,
  ImageEditor,
  ImageStore,
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
  ToastAndroid,
  ToolbarAndroid,
  Touchable,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewPagerAndroid,
  VirtualizedList,
  WebView
} from 'react-native';

registerComponent({
  AccessibilityInfo,
  ActivityIndicator,
  ART,
  Button,
  DatePickerIOS,
  DrawerLayoutAndroid,
  FlatList,
  Image,
  ImageBackground,
  ImageEditor,
  ImageStore,
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
  ToastAndroid,
  ToolbarAndroid,
  Touchable,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewPagerAndroid,
  VirtualizedList,
  WebView
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

const _global = typeof self !== 'undefined' ? self : global;
_global.NornJReact = _global.njr = njr;

export { bindTemplate, bindTemplate as registerTmpl };
export default njr;
