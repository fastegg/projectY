var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      <div style={{marginLeft:'auto',marginRight:'auto'}}>
        <img src='img/ripple.gif' />
      </div>
    );
  },
});

module.exports.init = function() {ReactDOM.render(<App />, document.getElementById('clientApp'));};
