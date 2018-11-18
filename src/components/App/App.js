import React from "react"
import Issue from '../Issue/Issue'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

const App = ({ color, ...props }) => (
  <Router>
    <Route
      path="/:repos/:owner/issues/:issueId"
      component={Issue}
    />
  </Router>
)

export default App