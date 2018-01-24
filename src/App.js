import React, {Component} from 'react';
import './App.css';
import * as github from './utils/github-api.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.fetch
  }

  async componentDidMount() {
    const path = new URL(window.location.href).pathname;
    await this.fetchIssue(path);
  }

  async fetchIssue(path) {
    const issueInfo = await github.getIssueInfos(path);
    const comments = await github.getComments(path);
    this.setState({
      title: issueInfo.title + ' #' + issueInfo.number,
      author: {
        login: issueInfo.user.login,
        id: issueInfo.user.id
      },
      comments: comments
    });
  }

  render() {
    if (!this.state) {
      return <p>
        Loading...
      </p>;
    }
    return (<Github comments={this.state.comments} author={this.state.author}/>);
  }
}
export default App;

class Github extends Component {

  renderComments() {
    return this
      .props
      .comments
      .map(comment => <Comment
        key={comment.id}
        comment={comment.body}
        avatar={comment.user.avatar_url}
        isAuthor={comment.user.id === this.props.author.id}/>);
  }

  render() {
    return (
      <div className="App">
        <Header className="App-header" value={this.props && this.props.title}/>

        <div className="App-thread">
          <h2>
            Conversation with {this.props.author.login}
          </h2>
          <ul>
            {this.renderComments()}
          </ul>
        </div>

      </div>
    );
  }
}

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <h1>{this.props.value}</h1>
      </header>
    );
  }
}

class Comment extends Component {
  render() {
    const classPosition = this.props.isAuthor
      ? ' right'
      : ' left';
    return (
      <li className="App-thread-container">
        <div className={'App-thread-container-avatarcontainer' + classPosition}>
          <img
            src={this.props.avatar}
            alt='avatar'
            className={"App-thread-container-avatar" + classPosition}/>
        </div>
        <div className={"App-thread-container-comment" + classPosition}>
          <p >
            {this.props.comment}
          </p>
        </div>
      </li>
    )
  }
}