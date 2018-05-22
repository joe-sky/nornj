const React = require('react');
const createReactClass = require('create-react-class');
const nj = require('nornj').default;
require('nornj-react');

module.exports = createReactClass({
  render: function() {
    return (
        <div>
        <each of={[['xxxxx',2,3,4],[1,2,3,4]]} item="itemAliases" index="indexAliases">
        <section id={indexAliases}>
          <each of={itemAliases}>
              <div>{item}</div>
              <p>{index}</p>
          </each>
          {/* <i>{itemAliases}</i> */}
          <i>{indexAliases}</i>
        </section>
        </each>
      </div>
    );
  }
});
