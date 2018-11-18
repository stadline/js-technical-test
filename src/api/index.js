import axios from 'axios'
import config from '../config'
import { countGitHubCommentWords, replaceCodeBlocks } from '../lib/helpers'

const api = axios.create({
  baseURL: config.API_BASE_URL,
})

const get = async (path, params = {}) => {
  try {
    const res = await api({
      method: 'get',
      url: path,
      params,
    })
    return res.data
  } catch (error) {
    throw error
  }
}

const fetchGitHubIssue = async (repos, owner, issueId) => {
  try {
    const params = {
      client_id: '1d5133c0ecc6c723b5c8',
      client_secret: '8d0391254fdc309a44f9f9974338ee0b4afc4d62'
    }
    const issueUrl = `/repos/${repos}/${owner}/issues/${issueId}`
    const issue = await get(`${issueUrl}`, params)
    const rawComments = await get(`${issueUrl}/comments`, params)
    const participants = rawComments.reduce((acc, comment) => {
      const index = acc.findIndex((participant) => participant.id === comment.user.id)
      if (index === -1) {
        return [
          ...acc,
          {
            login: comment.user.login,
            id: comment.user.id,
            words: countGitHubCommentWords(comment.body),
          }
        ]
      } else {
        return [
          ...acc.slice(0, index),
          {
            ...acc[index],
            words: acc[index].words += countGitHubCommentWords(comment.body),
          },
          ...acc.slice(index + 1)
        ]
      }
    }, [{
      login: issue.user.login,
      id: issue.user.id,
      words: countGitHubCommentWords(issue.body),
    }])
    return {
      issue: {
        ...issue,
        body: replaceCodeBlocks(issue.body)
      },
      comments: [
        {
          ...issue,
          body: replaceCodeBlocks(issue.body)
        },
        ...rawComments.map(c => ({
          ...c,
          body: replaceCodeBlocks(c.body)
        })),
      ],
      participants,
    }
  } catch (error) {
    throw error
  }
}

export {
  get,
  fetchGitHubIssue,
}
