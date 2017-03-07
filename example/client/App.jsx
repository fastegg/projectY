var React = require('react');
var ReactDOM = require('react-dom');
var ReactBootstrap = require('react-bootstrap');

var Reflo = require('./../../index');

var Grid = ReactBootstrap.Grid;
var Col = ReactBootstrap.Grid;
var Row = ReactBootstrap.Grid;

var LoadingScreen = React.createClass({
  render: function() {
    return (
      <Grid>
        <Col>
          <Row style={{textAlign: 'center'}}>
            <img src='img/ripple.gif' />
          </Row>
          <Row style={{textAlign: 'center'}}>
            requesting DB info...
          </Row>
        </Col>
      </Grid>
    );
  },
});

var App = Reflo.connectAll(function(props) {
  return <AppView {...props} />;
});

var AppView = React.createClass({
  newNews: function() {
    Reflo.runAction('newNews', {newsTitle: 'extra extra!', newsDescription: 'this is a new news post!'}, function(err) {
      if (err) window.alert('error running action newNews! \n' + err);
    });
  },
  render: function() {
    if (this.props.db._loadingDB) {
      return <LoadingScreen />;
    }

    return <div>
      <div>loaded! {JSON.stringify(this.props.db)}</div>
      <button onClick={this.newNews}>new news post</button>
      </div>;
  }
});

module.exports.showLoadingScreen = function() {ReactDOM.render(<App />, document.getElementById('clientApp'));};