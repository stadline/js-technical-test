import React, { Component } from 'react'
import './App.scss'

import { Container, Row, Col } from 'reactstrap';

class App extends Component {

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
