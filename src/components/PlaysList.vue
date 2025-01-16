<script setup>
import { reactive } from 'vue'

const props = defineProps({
  game: Object,
  wordFinder: Function,
})

const game = props.game
const wordFinder = props.wordFinder

const validPlays = reactive([])

function findPlays() {
  validPlays.length = 0
  wordFinder
    .findAllPossiblePlays(game.getUBF(), game.getTiles(game.currentPlayer))
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
  sortByPpt()
}

let reversed = false

function sortByPoints() {
  validPlays.sort((a, b) => b.points - a.points)
  if (reversed) {
    validPlays.reverse()
  }
  reversed = !reversed
}

function sortByTiles() {
  validPlays.sort((a, b) => b.numTiles - a.numTiles)
  if (reversed) {
    validPlays.reverse()
  }
  reversed = !reversed
}

function sortByPpt() {
  validPlays.sort((a, b) => b.points / b.numTiles - a.points / a.numTiles)
  if (reversed) {
    validPlays.reverse()
  }
  reversed = !reversed
}

findPlays()
</script>

<template>
  <div
    class="overflow-hidden border rounded-lg bg-slate-200 lg:w-[40rem] max-h-[50vh] select-none"
    @mouseleave="$emit('clearCandidate')"
  >
    <div class="grid grid-cols-6 text-lg bg-slate-300">
      <button>Word</button>
      <button>Start</button>
      <button>Direction</button>
      <button @click="sortByPoints" class="hover:bg-slate-400">Points</button>
      <button @click="sortByTiles" class="hover:bg-slate-400">Tiles</button>
      <button @click="sortByPpt" class="hover:bg-slate-400">Points per tile</button>
    </div>
    <div class="w-100 text-lg overflow-y-scroll no-scrollbar max-h-[50vh]">
      <div
        class="grid grid-cols-6 font-mono hover:bg-slate-300"
        @mouseover="$emit('viewCandidate', play)"
        @click="$emit('playCandidate', play)"
        v-for="(play, index) in validPlays"
        :key="index"
      >
        <span>{{ play.tiles.replace(/ /g, '.') }}</span>
        <span>{{ play.start }}</span>
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
