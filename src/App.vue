<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import TileRack from './components/TileRack.vue'
import PlaysList from './components/PlaysList.vue'
import { ref } from 'vue'
import { PlayDirection, UBFHelper, UpwordsGame, TileSet } from 'upwords-toolkit'
import { UpwordsWordFinder } from 'upwords-solver'
import { wordList } from './wordList'

UpwordsWordFinder.init(wordList)
const game = new UpwordsGame(1, true)
const boardStateKey = ref(0)
const playListKey = ref(0)
const tileBagKey = ref(0)
const tileRackKey = ref(0)
const tempTiles = new Map()

function playMove(play) {
  const playTiles = TileSet.tilesFromString(play.tiles)
  const currentPlayerRack = game.getTiles(game.currentPlayer)
  const currentPlayerTilesString = currentPlayerRack.listTiles()
  if (!game.getTiles(game.currentPlayer).hasTiles(playTiles)) {
    game.returnSpecificTiles(game.currentPlayer, currentPlayerTilesString)
    const canDraw = game.drawSpecificTiles(game.currentPlayer, play.tiles)
    if (!canDraw) {
      console.log('not enough tiles')
      game.drawSpecificTiles(game.currentPlayer, currentPlayerTilesString)
      return
    }
  }
  if (!game.checkMove(play).isValid) {
    console.log(game.checkMove(play))
    game.returnSpecificTiles(game.currentPlayer, play.tiles)
    game.drawSpecificTiles(game.currentPlayer, currentPlayerTilesString)
  } else {
    game.playMove(play)
    tempTiles.clear()
  }
  boardStateKey.value += 1
  tileBagKey.value += 1
  playListKey.value += 1
  tileRackKey.value += 1
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
const tileRackRef = ref(null)
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.metaKey) {
    return
  }
  if (['Escape', 'Backspace'].includes(e.key)) {
    tileRackRef.value.handleRackInput(e.key)
    boardContainerRef.value.handleBoardInput(e.key)
  } else if (e.key.startsWith('Arrow') || e.key === ' ') {
    e.preventDefault()
    tileRackRef.value.handleRackInput(e.key)
    boardContainerRef.value.handleBoardInput(e.key)
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(e.key.toUpperCase())) {
    tileRackRef.value.handleRackInput(e.key)
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

function drawTile(tile, returnTile = '') {
  if (returnTile.length > 0) {
    game.returnSpecificTiles(game.currentPlayer, returnTile)
  }
  game.drawSpecificTiles(game.currentPlayer, tile)
  playListKey.value++
  tileBagKey.value++
}

function returnTile(returnTile) {
  if (returnTile.length > 0) {
    game.returnSpecificTiles(game.currentPlayer, returnTile)
  }
  playListKey.value++
  tileBagKey.value++
}

function focusTileRack() {
  boardContainerRef.value.unfocus()
}

function focusBoard() {
  tileRackRef.value.unfocus()
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
        @grab-focus="focusBoard"
      />
      <TileRack
        v-bind:key="tileRackKey"
        :rack="game.getTiles(game.currentPlayer)"
        :tile-bag="game.getTileBag()"
        ref="tileRackRef"
        class="container mx-auto my-2 w-1/2 max-w-lg min-w-64 row-start-5 row-span-1 md:row-start-5 md:col-start-2 md:col-span-4"
        @grab-focus="focusTileRack"
        @draw-tile="drawTile"
        @return-tile="returnTile"
      />
      <TileBagContainer
        v-bind:key="tileBagKey"
        :tile-bag="game.getTileBag()"
        class="container w-1/2 row-start-7 row-span-2 md:col-span-1 md:col-start-2"
      />
      <PlaysList
        v-bind:key="playListKey"
        :game="game"
        :word-finder="UpwordsWordFinder"
        class="row-start-9 row-span-2 md:col-start-1 md:row-start-1 md:row-span-5"
        @view-candidate="viewCandidate"
        @play-candidate="placeCandidate"
        @clear-candidate="clearCandidate"
      />
      <div>Player 1: {{ game.getScore(0) }}</div>
    </div>
  </main>
</template>

<style scoped></style>
