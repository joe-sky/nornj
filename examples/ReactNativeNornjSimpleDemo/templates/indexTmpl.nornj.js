'use strict';

let nj = require('nornj');

module.exports = nj`
  <View style={styles:prop(container)}>
    <Text style={styles:prop(welcome)}>
      Welcome to React Native and NornJ!
    </Text>
    <Text style={styles:prop(instructions)}>
      To get started, edit index.android.js
    </Text>
    <Text style={styles:prop(instructions)}>
      Shake or press menu button for dev menu
    </Text>
  </View>
`;