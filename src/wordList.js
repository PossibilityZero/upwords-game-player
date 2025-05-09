import { prepareUpwordsWordList, defaultWordFilterOptions } from 'upwords-toolkit'

const wordListManager = {
  wordList: [],

  getWordlistFromStorage: function () {
    return JSON.parse(localStorage.getItem('wordList')) || []
  },

  getWordlist: async function () {
    if (this.wordList.length > 0) {
      return this.wordList
    }

    const localStorageWordlist = this.getWordlistFromStorage()
    if (localStorageWordlist.length > 0) {
      this.wordList = localStorageWordlist
      return this.wordList
    }

    const url = '/wordlist'
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const text = await response.text()
      const rawWords = text.split('\n')
      const filteredTwl06 = prepareUpwordsWordList(rawWords, defaultWordFilterOptions)
      this.wordList = filteredTwl06.keptWords
      localStorage.setItem('wordList', JSON.stringify(this.wordList))
      return this.wordList
    } catch (error) {
      console.error(error)
    }
    return this.wordList
  },
}

export { wordListManager }
