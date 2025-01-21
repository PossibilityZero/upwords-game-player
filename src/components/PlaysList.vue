<script setup>
import { reactive } from 'vue'
import { UpwordsWordFinder } from 'upwords-solver'
import { wordList } from '../wordList'
import SvgSortIcon from './SvgSortIcon.vue'
const props = defineProps({
  game: Object,
})

const game = props.game
const validPlays = reactive([])
const sortFuncs = reactive([])
const compareByPoints = (a, b) => a.points - b.points
const compareByNumTiles = (a, b) => a.numTiles - b.numTiles
const compareByPpt = (a, b) => a.points / a.numTiles - b.points / b.numTiles
function reverseSortFunc(compareFn) {
  return (a, b) => -compareFn(a, b)
}

function composeSortFunctions(sortFuncArr) {
  return (a, b) => {
    for (let i = 0; i < sortFuncArr.length; i++) {
      const fn = sortFuncArr[i].reversed ? reverseSortFunc(sortFuncArr[i].fn) : sortFuncArr[i].fn
      const compVal = fn(a, b)
      if (compVal !== 0) {
        return compVal
      }
    }
    return 0
  }
}

;(function init() {
  UpwordsWordFinder.init(wordList)
  sortFuncs.push({ fn: compareByPoints, reversed: true }, { fn: compareByPpt, reversed: true })
  update()
})()

function findPlays() {
  validPlays.length = 0
  UpwordsWordFinder.findAllPossiblePlays(game.getUBF(), game.getTiles(game.currentPlayer))
    .map((play) => ({
      play,
      status: game.checkMove(play, true),
      numTiles: [...play.tiles].filter((t) => t !== ' ').length,
    }))
    .filter((p) => p.status.isValid)
    .map((p) => ({
      tiles: p.play.tiles,
      start: p.play.start,
      direction: p.play.direction,
      points: p.status.points,
      numTiles: p.numTiles,
    }))
    .forEach((p) => validPlays.push(p))
}

function sortList() {
  const compFunc = composeSortFunctions(sortFuncs)
  validPlays.sort(compFunc)
}

function changeSortFunc(compFunc, reversed = false) {
  if (sortFuncs[0].fn === compFunc) {
    sortFuncs[0].reversed = !sortFuncs[0].reversed
  } else {
    sortFuncs.unshift({ fn: compFunc, reversed })
    sortFuncs.length = Math.min(sortFuncs.length, 2)
  }
}

function sortByPoints() {
  changeSortFunc(compareByPoints, true)
  sortList()
}

function sortByTiles() {
  changeSortFunc(compareByNumTiles, true)
  sortList()
}

function sortByPpt() {
  changeSortFunc(compareByPpt, true)
  sortList()
}

function lookupSortAttributes(compFunc) {
  const index = sortFuncs.findIndex((item) => item.fn === compFunc)
  return {
    show: index >= 0,
    primary: index === 0,
    descending: sortFuncs[index]?.reversed,
  }
}

function update() {
  findPlays()
  sortList()
}

defineExpose({
  update,
})
</script>

<template>
  <div
    class="overflow-hidden border rounded-lg bg-slate-200 w-[32rem] xl:w-[40rem] max-h-[50vh] select-none"
    @mouseleave="$emit('clearCandidate')"
  >
    <div class="grid grid-cols-5 text-lg bg-slate-300">
      <button>Word</button>
      <button>Direction</button>
      <div @click="sortByPoints" class="hover:bg-slate-400">
        <span
          >Points
          <SvgSortIcon class="inline-block size-6" v-bind="lookupSortAttributes(compareByPoints)" />
        </span>
      </div>
      <div @click="sortByTiles" class="hover:bg-slate-400">
        <span
          >Tiles
          <SvgSortIcon
            class="inline-block size-6"
            v-bind="lookupSortAttributes(compareByNumTiles)"
          />
        </span>
      </div>
      <div @click="sortByPpt" class="hover:bg-slate-400">
        <span
          >Points / tile
          <SvgSortIcon class="inline-block size-6" v-bind="lookupSortAttributes(compareByPpt)" />
        </span>
      </div>
    </div>
    <div class="w-100 text-lg overflow-y-scroll no-scrollbar max-h-[50vh]">
      <div
        class="grid grid-cols-5 font-mono hover:bg-slate-300"
        @mouseover="$emit('viewCandidate', play)"
        @click="$emit('playCandidate', play)"
        v-for="(play, index) in validPlays"
        :key="index"
      >
        <span>{{ play.tiles.replace(/ /g, '.') }}</span>
        <span>{{ play.direction === 0 ? 'Across' : 'Down' }}</span>
        <span>{{ play.points }}</span>
        <span>{{ play.numTiles }}</span>
        <span>{{ (play.points / play.numTiles).toFixed(3) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
