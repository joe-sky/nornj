/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';
import nj, {
  compileComponent
} from 'nornj';
import './njConfig';
import tmpl from './templates/indexTmpl';

const template = compileComponent(tmpl);

class ReactNativeNornjSimpleDemo extends Component {
  render() {
    return template({ styles });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativeNornjSimpleDemo', () => ReactNativeNornjSimpleDemo);
