import React, { Component } from 'react'
import { fetchGitHubIssue } from '../../api'
import './App.scss'

import { Container, Row, Col } from 'reactstrap';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      issue: null,
      comments: [],
      participants: [],
      error: null,
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    try {
      const response = await fetchGitHubIssue('nodejs', 'node', 6867)
      const { issue , comments, participants } = response
      this.setState({
        loading: false,
        issue,
        comments,
        participants,
      })
      
    } catch (e) {
      this.handlerError(e)
    }
  }

  handlerError(error) {
    this.setState({
      loading: false,
      issue: null,
      comments: [],
      participants: [],
      error: error,
    })
  }

  render() {
    return (
      <Container className="app-container">
        <Row>
          <Col sm="12" xl={{ size: 3, offset: 1 }} className="participant-container"></Col>
          <Col sm="12" xl={{ size: 7 }} className="thread-container"></Col>
        </Row>
      </Container>
    );
  }
}

export default App;
