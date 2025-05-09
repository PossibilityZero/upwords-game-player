import { wordListManager } from './wordList'

describe('getWordlist', () => {
  it('should load and filter wordlist', async () => {
    const wordList = await wordListManager.getWordlist()
    expect(wordList).toContain('test')
    expect(wordList).not.toContain('testability') // too long
  })
})
