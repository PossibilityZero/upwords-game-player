import twl06Raw from '../data/twl06.txt?raw'
import { prepareUpwordsWordList, defaultWordFilterOptions } from 'upwords-toolkit'

const twl06All = twl06Raw.split('\n').map((word) => word.trim())
const filteredTwl06 = prepareUpwordsWordList(twl06All, defaultWordFilterOptions)
const wordList = filteredTwl06.keptWords

export { twl06All as TWL06, wordList }
