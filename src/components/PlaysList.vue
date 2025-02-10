<script setup>
import { reactive } from 'vue'
import { UpwordsWordFinder } from 'upwords-solver'
import { wordList } from '../wordList'
import SvgSortIcon from './svgIcons/SvgSortIcon.vue'
import { UBFHelper } from 'upwords-toolkit'

const props = defineProps({
  game: Object,
  filterTiles: Set,
})

const emit = defineEmits(['clearFilter', 'viewCandidate', 'playCandidate', 'clearCandidate'])

const filterType = defineModel()

const game = props.game
const filterSet = props.filterTiles
const validPlays = []
const displayedPlays = reactive([])
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

function coordToStr(coord) {
  const [x, y] = coord
  return `coord-${x}-${y}`
}

function getPlayCoords(play) {
  const allPlayCoords = []
  const startCoord = play.start
  for (let i = 0; i < play.tiles.length; i++) {
    if (play.tiles[i] !== ' ') {
      allPlayCoords.push(UBFHelper.offsetCoord(startCoord, play.direction, i))
    }
  }
  return allPlayCoords
}

function findPlays() {
  validPlays.length = 0
  UpwordsWordFinder.findAllPossiblePlays(game.getUBF(), game.getTiles(game.currentPlayer))
    .map((play) => ({
      play,
      status: game.checkMove(play, true),
      numTiles: [...play.tiles].filter((t) => t !== ' ').length,
    }))
    .filter((play) => play.status.isValid)
    .map((p) => ({
      tiles: p.play.tiles,
      start: p.play.start,
      direction: p.play.direction,
      points: p.status.points,
      numTiles: p.numTiles,
    }))
    .forEach((play) => validPlays.push(play))
}

function filterDisplayed() {
  displayedPlays.length = 0
  if (filterSet.size === 0) {
    validPlays.forEach((p) => displayedPlays.push(p))
  } else if (filterType.value === 'exclude') {
    validPlays
      .filter((play) => !getPlayCoords(play).map(coordToStr).some(filterSet.has.bind(filterSet)))
      .forEach((play) => displayedPlays.push(play))
  } else if (filterType.value === 'only') {
    validPlays
      .filter((play) => getPlayCoords(play).map(coordToStr).every(filterSet.has.bind(filterSet)))
      .forEach((play) => displayedPlays.push(play))
  } else if (filterType.value === 'include') {
    validPlays
      .filter((play) => getPlayCoords(play).map(coordToStr).some(filterSet.has.bind(filterSet)))
      .forEach((play) => displayedPlays.push(play))
  }
}

function sortDisplayed() {
  const compFunc = composeSortFunctions(sortFuncs)
  displayedPlays.sort(compFunc)
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
  sortDisplayed()
}

function sortByTiles() {
  changeSortFunc(compareByNumTiles, true)
  sortDisplayed()
}

function sortByPpt() {
  changeSortFunc(compareByPpt, true)
  sortDisplayed()
}

function lookupSortAttributes(compFunc) {
  const index = sortFuncs.findIndex((item) => item.fn === compFunc)
  return {
    show: index >= 0,
    primary: index === 0,
    descending: sortFuncs[index]?.reversed,
  }
}

function detectHovered() {
  const hovered = Array.from(document.querySelectorAll('#playsList>.playsListItem')).find((e) =>
    e.matches(':hover'),
  )
  return displayedPlays[hovered?.dataset?.listIndex]
}

function update(resetList = true) {
  if (resetList) {
    findPlays()
  }
  filterDisplayed()
  sortDisplayed()
  if (resetList) {
    const hoveredPlay = detectHovered()
    if (hoveredPlay) {
      emit('viewCandidate', hoveredPlay)
    }
  }
}

defineExpose({
  update,
})
</script>

<template>
  <div>
    <div id="playsListFilterControls" class="mb-1 px-2 pb-2 rounded-lg bg-slate-200">
      <h2 class="font-bold text-2xl">Filters</h2>
      <h3 class="font-bold text-lg">Selected Tiles</h3>
      <button
        @click="$emit('clearFilter')"
        class="block px-1 mr-2 bg-slate-600 text-white rounded hover:bg-slate-900 hover:cursor-pointer"
      >
        Clear all
      </button>
      <span class="font-bold mr-2">Filter type:</span>
      <label class="mr-2 inline-flex items-center cursor-pointer">
        <span class="mr-1">Only</span>
        <input @change="update" v-model="filterType" name="filterType" type="radio" value="only" />
      </label>
      <label class="mr-2 inline-flex items-center cursor-pointer">
        <span class="mr-1">Exclude</span>
        <input
          @change="update"
          v-model="filterType"
          name="filterType"
          type="radio"
          value="exclude"
        />
      </label>
      <label class="inline-flex items-center cursor-pointer">
        <span class="mr-1">Include</span>
        <input
          @change="update"
          v-model="filterType"
          name="filterType"
          type="radio"
          value="include"
        />
      </label>
    </div>
    <div
      class="overflow-hidden rounded-lg bg-slate-200 w-[32rem] xl:w-[40rem] max-h-[50vh] xl:min-h-[45vh] select-none"
      @mouseleave="$emit('clearCandidate')"
    >
      <div class="grid grid-cols-5 text-lg bg-slate-300">
        <div><span class="pl-1">Word</span></div>
        <div><span>Direction</span></div>
        <div @click="sortByPoints" class="px-1 hover:bg-slate-400">
          <span
            >Points
            <SvgSortIcon
              class="inline-block size-6"
              v-bind="lookupSortAttributes(compareByPoints)"
            />
          </span>
        </div>
        <div @click="sortByTiles" class="px-1 hover:bg-slate-400">
          <span
            >Tiles
            <SvgSortIcon
              class="inline-block size-6"
              v-bind="lookupSortAttributes(compareByNumTiles)"
            />
          </span>
        </div>
        <div @click="sortByPpt" class="px-1 hover:bg-slate-400">
          <span
            >Points / tile
            <SvgSortIcon class="inline-block size-6" v-bind="lookupSortAttributes(compareByPpt)" />
          </span>
        </div>
      </div>
      <div id="playsList" class="w-100% text-lg overflow-y-scroll no-scrollbar max-h-[45vh]">
        <div
          class="playsListItem grid grid-cols-5 font-mono hover:bg-slate-300"
          @mouseover="$emit('viewCandidate', play)"
          @click="$emit('playCandidate', play)"
          v-for="(play, index) in displayedPlays"
          v-bind:data-list-index="index"
          :key="index"
        >
          <span class="px-1">{{ play.tiles.replace(/ /g, '.') }}</span>
          <span class="px-1">{{ play.direction === 0 ? 'Across' : 'Down' }}</span>
          <span class="px-1">{{ play.points }}</span>
          <span class="px-1">{{ play.numTiles }}</span>
          <span class="px-1">{{ (play.points / play.numTiles).toFixed(2) }}</span>
        </div>
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
