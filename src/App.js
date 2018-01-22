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
      title: issueInfo.title + ' #' + issueInfo.number,
      author: {
        login: issueInfo.user.login,
        id: issueInfo.user.id
      }
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
      .map(comment => <Comment
        key={comment.id}
        comment={comment.body}
        avatar={comment.user.avatar_url}/>);
  }

  render() {

    return (
      <div className="App">
        <Header className="App-header" value={this.state.title}/>

        <div className="App-thread">
          <h2 className>Conversation with {this.state.author && this.state.author.login}
          </h2>
          <ul>
            {this.renderComments()}
          </ul>
        </div>

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
      <li className="App-thread-container">
        <div className="App-thread-container-avatarcontainer">
          <img
            src={this.props.avatar}
            alt='avatar'
            className="App-thread-container-avatar"/>
        </div>
        <div className="App-thread-container-comment">
          <p >
            {this.props.comment}
          </p>
        </div>
      </li>
    )
  }
}