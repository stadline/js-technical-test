import React, { Component } from 'react'
import { Container, Row, Col,  ListGroup, ListGroupItem } from 'reactstrap';
import PieChart from 'react-svg-piechart'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

import { fetchGitHubIssue } from '../../api'
import Comment from '../Comment/Comment'

import './Issue.scss'

class Issue extends Component {
  
  constructor(props) {
    console.log(props)
    super(props)
    this.toggleParticipant = this.toggleParticipant.bind(this);
    this.state = {
      loading: false,
      issue: null,
      comments: [],
      filteredComments: [],
      participants: [],
      error: null,
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    try {
      const { match: { params: { repos, owner, issueId } } } = this.props
      const response = await fetchGitHubIssue(repos, owner, issueId)
      const { issue, comments, participants } = response
      this.setState({
        loading: false,
        issue,
        comments,
        filteredComments: comments,
        participants: participants.map((participant) => ({
          ...participant,
          visible: true,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        })),
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
      filteredComments: [],
      participants: [],
      error: error,
    })
  }

  toggleParticipant(participantId) {
    const { comments, participants: oldParticipants } = this.state
    const index = oldParticipants.findIndex((p) => p.id === participantId)
    const participants = [ 
      ...oldParticipants.slice(0, index),
      {
        ...oldParticipants[index],
        visible: !oldParticipants[index].visible,
      },
      ...oldParticipants.slice(index + 1)
    ]

    if (index === -1) {
      return false
    }

    this.setState({
      ...this.state,
      filteredComments: [
        ...comments.filter((comment) => {
          const participant = participants.filter((p) => p.id === comment.user.id)[0]
          return participant.visible
        })
      ],
      participants
    })
  }

  render() {
    const { loading, issue, filteredComments, participants } = this.state
    const data = participants.filter((p) => p.visible).reduce((acc, part) => ([
      ...acc,
      {
        title: part.login,
        value: part.words,
        color: part.color,
      }
    ]), [])
    return (
      <Container className="app-container">
        {loading ? (
          <div className="loading">loading...</div>
        ) : (
          <Row>
            <Col sm="12" xl={{ size: 3, offset: 1 }} className="participant-container">
              <ListGroup>
                {participants.map((participant) => {
                  return (
                    <ListGroupItem
                      key={`participant-${participant.id}`}
                      tag="a"
                      href="#"
                      onClick={() => {this.toggleParticipant(participant.id)}}
                      style={{color: participant.color, fontWeight: 'bold'}}
                    >
                      <div className="participant-list-item">
                        <span>{participant.login}</span>
                        <span>{participant.visible ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}</span>
                      </div>
                    </ListGroupItem>
                  )
                })}
              </ListGroup>
              <PieChart
                data={data}
                // If you need expand on hover (or touch) effect
                expandOnHover
                // If you need custom behavior when sector is hovered (or touched)
                onSectorHover={(d, i, e) => {
                  if (d) {
                    console.log("Mouse enter - Index:", i, "Data:", d, "Event:", e)
                  } else {
                    console.log("Mouse leave - Index:", i, "Event:", e)
                  }
                }}
              />
            </Col>
            <Col sm="12" xl={{ size: 7 }} className="thread-container">
              {issue && (
                <Comment key={`issue-${issue.id}`} user={issue.user} isAuthor={true}>
                  {issue.body}
                </Comment>  
              )}
              {filteredComments.map((comment) => {
                return (
                  <Comment key={`comment-${comment.id}`} user={comment.user} isAuthor={comment.user.id === issue.user.id}>
                    {comment.body}
                  </Comment>
                )
              })}
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

export default Issue;
