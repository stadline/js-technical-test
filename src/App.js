import React, {Component} from 'react';
import './App.css';
import * as github from './utils/github-api.js'

class App extends Component {
  constructor(props) {
    super(props);

  }

  async componentDidMount() {
    const path = new URL(window.location.href).pathname;
    const info = await github.getIssueInfos(path);
    this.setState({
      title: info.title + ' #' + info.number
    });

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state && this.state.title}</h1>
        </header>
        <p className="App-intro">
          To get started, edit
          <code>src/App.js</code>
          and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
