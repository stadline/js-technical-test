import React from 'react'
import PropTypes from 'prop-types'

import './Comment.scss'

const Comment = ({ user, isAuthor, ...props }) => {
  const containerClassName = `comment-container${isAuthor ? ' hl' : ''}`
  return (
    <div className={containerClassName}>
      <div className="comment-author-avatar">
        <img width="100" height="100" src={user.avatar_url} alt={user.login} />
        {user.login}
      </div>
      <div className="comment-body" dangerouslySetInnerHTML={{ __html: props.children }}></div>
    </div> 
  )
}

Comment.defaultProps = {
  isAuthor: false,
}

Comment.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  isAuthor: PropTypes.bool,
}

export default Comment
