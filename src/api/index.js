import axios from 'axios'
import config from '../config'
// import { countGitHubCommentWords } from '../lib/helpers'

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

}

export {
  get,
  fetchGitHubIssue,
}
