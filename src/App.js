import React, {Component} from 'react';
import './App.css';
import * as github from './utils/github-api.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const path = new URL(window.location.href).pathname;
    await this.initIssueInfos(path);
    await this.initComments(path);
  }

  async initIssueInfos(path) {
    const issueInfo = await github.getIssueInfos(path);
    this.setState({
      title: issueInfo.title + ' #' + issueInfo.number
    });
  }

  async initComments(path) {
    const comments = await github.getComments(path);
    this.setState({comments: comments});
  }

  renderComments() {
    return this.state.comments && this
      .state
      .comments
      .map(comments => <Comment key={comments.id} value={comments.body}/>);
  }

  render() {

    return (
      <div className="App">
        <Header value={this.state.title}/>
        <div>
          {this.renderComments()}
        </div>

        <p className=" App-intro">
          To get started, edit
          <code>src/App.js</code>
          and save to reload.
        </p>
      </div>
    );
  }
}
export default App;

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <h1 className="App-title">{this.props.value}</h1>
      </header>
    );
  }
}

class Comment extends Component {
  render() {
    return (
      <p >{this.props.value}</p>
    );
  }
}