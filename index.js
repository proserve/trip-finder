var React = require('react');
var ReactDom = require('react-dom');
require('index.css');

class App extends React.Component{
  render(){
    return React.createElement('div', {}, 'Hello World');
  }
}

ReactDom.render(
  <App />,
  document.getElementById('app')
);
