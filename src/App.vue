<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import TileRack from './components/TileRack.vue'
import PlaysList from './components/PlaysList.vue'
import { ref, reactive } from 'vue'
import { PlayDirection, UBFHelper, UpwordsGame } from 'upwords-toolkit'
import { UpwordsWordFinder } from 'upwords-solver'
import { wordList } from './wordList'

UpwordsWordFinder.init(wordList)

const validPlays = reactive([])
function findPlays() {
  validPlays.length = 0
  UpwordsWordFinder.findAllPossiblePlays(game.getUBF(), game.getTiles(0))
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

const manualTiles = false
const game = new UpwordsGame(1, manualTiles)
const tileRack1 = game.getTiles(0)
const boardStateKey = ref(0)
const tileBagKey = ref(0)
const tempTiles = new Map()

const rackTiles = reactive([])
function populateRackTiles(rack, tileRack) {
  rack.length = 0
  ;[...tileRack.listTiles()].forEach((letter) => {
    rack.push({ key: Math.random(), letter: letter[0] })
  })
}
populateRackTiles(rackTiles, tileRack1)

findPlays()

function manualDrawTiles(play) {
  return game.drawSpecificTiles(game.currentPlayer, play.tiles)
}

function playMove(play) {
  if (manualTiles) {
    const canDraw = manualDrawTiles(play)
    if (!canDraw) {
      console.log('not enough tiles')
      return
    }
  }
  if (!game.checkMove(play).isValid) {
    console.log(game.checkMove(play))
    if (manualTiles) {
      game.returnSpecificTiles(game.currentPlayer, play.tiles)
    }
    return
  }
  game.playMove(play)
  boardStateKey.value += 1
  tileBagKey.value += 1
  tempTiles.clear()
  if (!manualTiles) {
    populateRackTiles(rackTiles, tileRack1)
  }
  findPlays()
}

function makePlayFromTempTiles(tempTiles) {
  const play = {}
  const xCoords = tempTiles.values().map((tile) => tile.x)
  const yCoords = tempTiles.values().map((tile) => tile.y)
  let ordered
  const tiles = Array(10).fill(' ')
  if (new Set(xCoords).size === 1) {
    play.direction = PlayDirection.Horizontal
    ordered = tempTiles
      .values()
      .toArray()
      .sort((tileA, tileB) => tileA.y - tileB.y)
    tempTiles.values().forEach((tile) => {
      tiles[tile.y] = tile.letter
    })
  } else if (new Set(yCoords).size === 1) {
    play.direction = PlayDirection.Vertical
    ordered = tempTiles
      .values()
      .toArray()
      .sort((tileA, tileB) => tileA.x - tileB.x)
    tempTiles.values().forEach((tile) => {
      tiles[tile.x] = tile.letter
    })
  } else {
    return null
  }
  play.start = [ordered[0].x, ordered[0].y]
  play.tiles = tiles.join('').trim()
  return play
}

const boardContainerRef = ref(null)
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.metaKey) {
    return
  }
  if (['Escape', 'Backspace'].includes(e.key)) {
    boardContainerRef.value.handleBoardInput(e.key)
  } else if (e.key.startsWith('Arrow') || e.key === ' ') {
    e.preventDefault()
    boardContainerRef.value.handleBoardInput(e.key)
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(e.key.toUpperCase())) {
    // do stuff only if we have tiles
    boardContainerRef.value.handleBoardInput(e.key)
  } else if (e.key === 'Enter') {
    const play = makePlayFromTempTiles(tempTiles)
    if (play) {
      playMove(play)
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    boardContainerRef.value.handleBoardInput(e.key)
  }
})

function placeCandidate(play) {
  playMove(play)
}

function viewCandidate(play) {
  tempTiles.clear()
  for (let i = 0; i < play.tiles.length; i++) {
    const tile = play.tiles[i]
    const [x, y] = UBFHelper.offsetCoord(play.start, play.direction, i)
    if (tile !== ' ') {
      const coordString = `coord-${x}-${y}`
      tempTiles.set(coordString, { letter: tile.toUpperCase(), x, y })
    }
  }
  boardStateKey.value += 1
}

function clearCandidate() {
  tempTiles.clear()
  boardStateKey.value += 1
}

document.body.classList.add('bg-slate-100')
</script>

<template>
  <header>
    <div class="container mx-auto">
      <h1 class="my-4 text-5xl font-extrabold leading-none">Upwords Game</h1>
    </div>
  </header>
  <main>
    <div class="sm:mx-4 my-2 grid auto-rows-auto auto-cols-auto">
      <BoardContainer
        v-bind:key="boardStateKey"
        :board="game.getUBF()"
        :tempTiles="tempTiles"
        ref="boardContainerRef"
        class="row-start-1 row-span-4 md:row-start-1 md:col-start-2 md:col-span-4"
      />
      <TileRack
        :rack-tiles="rackTiles"
        class="container mx-auto my-2 w-1/2 max-w-lg min-w-64 row-start-5 row-span-1 md:row-start-5 md:col-start-2 md:col-span-4"
      />
      <TileBagContainer
        v-bind:key="tileBagKey"
        :tileBag="game.getTileBag()"
        class="row-start-7 row-span-2 md:col-span-1 md:col-start-2"
      />
      <PlaysList
        :valid-plays="validPlays"
        class="row-start-9 row-span-2 md:col-start-1 md:row-start-1 md:row-span-5"
        @view-candidate="viewCandidate"
        @play-candidate="placeCandidate"
        @clear-candidate="clearCandidate"
      ></PlaysList>
      <div>Player 1: {{ game.getScore(0) }}</div>
    </div>
  </main>
</template>

<style scoped></style>
