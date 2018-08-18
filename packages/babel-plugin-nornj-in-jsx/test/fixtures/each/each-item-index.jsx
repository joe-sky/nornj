const React = require('react');
const createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
        <div>
        <each of={[['xxxxx',2,3,4],[1,2,3,4]]} item="itemAliases" index="indexAliases">
        <section key={indexAliases}>

          <each of={itemAliases}>
          <div key={index}>
              <div>{item}</div>
              <p>{index}</p>
          </div>
          </each>
          {/* <i>{itemAliases}</i> */}
          <i>{indexAliases}</i>
        </section>
        </each>
      </div>
    );
  }
});
