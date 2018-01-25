import React, {Component} from 'react';
import './App.css';
import * as github from './utils/github-api.js'
import chartjs from 'react-chartjs'

class App extends Component {

  async componentDidMount() {
    const path = new URL(window.location.href).pathname;
    await this.fetchIssue(path);
  }

  async fetchIssue(path) {
    const issueInfo = await github.getIssueInfos(path);
    const comments = await github.getComments(path);
    this.setState({comments: comments, issueInfo: issueInfo});
  }

  render() {
    if (!this.state) {
      return <p>
        Loading...
      </p>;
    }
    return (<Github issue={this.state}/>);
  }
}
export default App;

class Github extends Component {
  constructor(props) {
    super(props);

    const issueInfo = this.props.issue.issueInfo;
    const comments = this.props.issue.comments;

    // Object qui stock l'état de filtre des utilisateurs
    const filteredUsers = comments
      .map(comment => comment.user)
      .reduce((acc, user) => {
        if (!acc.hasOwnProperty(user.id)) {
          acc[user.id] = {
            filtered: false,
            avatar: user.avatar_url,
            login: user.login
          };
        }
        return acc;
      }, {});

    this.state = {
      title: issueInfo.title + ' #' + issueInfo.number,
      author: {
        login: issueInfo.user.login,
        id: issueInfo.user.id
      },
      comments: comments,
      filteredUsers: filteredUsers
    };
  }

  handleFilterUserChange(userId) {
    const newState = Object.assign({}, this.state);
    newState.filteredUsers[userId].filtered = !this.state.filteredUsers[userId].filtered;
    this.setState(newState);
  }

  renderComments() {
    return this
      .state
      .comments
      .map(comment => {
        if (this.state.filteredUsers[comment.user.id].filtered) {
          return ' ';
        }
        return <Comment
          key={comment.id}
          comment={comment.body}
          avatar={comment.user.avatar_url}
          isAuthor={comment.user.id === this.state.author.id}/>
      });
  }

  render() {
    return (
      <div className="App">
        <Header className="App-header" value={this.state.title}/>

        <div className="App-info">
          <PieChart
            className="App-info-chart"
            comments={this.state.comments}
            users={this.state.filteredUsers}/>
          <FilterUser
            className="App-info-filter"
            filteredUsers={this.state.filteredUsers}
            onFilterChange={this
            .handleFilterUserChange
            .bind(this)}/>
        </div>

        <div className="App-thread">
          <h2>
            Conversation with {this.state.author.login}
          </h2>
          <ul>
            {this.renderComments()}
          </ul>
        </div>

      </div>
    );
  }
}

class PieChart extends Component {
  render() {
    const PieChart = chartjs.Pie;

    const datachart = [];

    for (let userId in this.props.users) {
      const user = this.props.users[userId];
      if (user.filtered) {
        continue;
      }

      const rate = this
        .props
        .comments
        .filter(comment => comment.user.id == userId)
        .reduce((numberWord, comment) => {
          return comment
            .body
            .split(' ')
            .length + numberWord
        }, 0);

      datachart.push({value: rate, label: user.login});
    }

    return (
      <div>
        <h2>Qui est le plus bavard ?</h2>
        <PieChart data={datachart} id="canvas"></PieChart>
      </div>
    );
  }
}

class FilterUser extends Component {

  handleFilterChange(userId) {
    this
      .props
      .onFilterChange(userId);
  }

  render() {
    const users = [];
    for (let userId in this.props.filteredUsers) {
      const user = this.props.filteredUsers[userId];
      const filteredClass = user.filtered
        ? ' filtered'
        : ' '
      users.push(<img
        key={userId}
        src={user.avatar}
        alt='avatar'
        className={'App-info-filter-user avatar' + filteredClass}
        onClick={this
        .handleFilterChange
        .bind(this, userId)}/>);
    }

    return (users);
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
            className={"App-thread-container-avatar avatar" + classPosition}/>
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