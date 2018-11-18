export const replaceCodeBlocks = (text) => {
  return text
    .replace(/^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm, '<pre><code>$4</pre></code>')
    .replace(/`\s?([^`].*?)\s?`/gm, '<code>$1</code>')
}

export const countGitHubCommentWords = (comment) => {
  comment = comment.toLowerCase()
                    // Remove block code
                   .replace(/^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm, '')
                   // Remove inline code
                   .replace(/`\S?([^`].*?)\S?`/gm, '')
                   // Remove punctuation we don't care about
                   .replace(/[.,;:!?()&]/g, ' ')

  const stopWords = [
    'a',
    'all',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'but',
    'by',
    'can',
    'do',
    'for',
    'from',
    'had',
    'have',
    'if',
    'in',
    'is',
    'it',
    'me',
    'my',
    'no',
    'not',
    'of',
    'on',
    'or',
    'our',
    's',
    'so',
    't',
    'that',
    'the',
    'their',
    'they',
    'this',
    'to',
    'us', 
    'was',
    'we',
    'who',
    'with',
    'you'
  ]
  
	let re = /\S+/ig // extract all non-whitespace sequences
	let m, word
  let count = 0
  
	while ((m = re.exec(comment)) != null) {
    word = m[0]
		if (stopWords.indexOf(word) === -1) {
			count++
		}
  }

  return count
}