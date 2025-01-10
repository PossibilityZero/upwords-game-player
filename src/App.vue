<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import { ref } from 'vue'
import { PlayDirection, UpwordsGame } from 'upwords-toolkit'

const game = new UpwordsGame(1)
const tileRack1 = game.getTiles(0)
const tiles = ref(tileRack1.listTiles())
const boardStateKey = ref(0)
const tileBagKey = ref(0)
const tempTiles = new Map()

function playMove(play) {
  console.log(play)
  game.playMove(play)
  tiles.value = tileRack1.listTiles()
  boardStateKey.value += 1
  tileBagKey.value += 1
  tempTiles.clear()
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
    return
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
  } else if (e.key.startsWith('Arrow')) {
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
  }
})
</script>

<template>
  <header>
    <div class="container mx-auto">
      <h1 class="my-4 text-5xl font-extrabold leading-none">Upwords Game</h1>
    </div>
  </header>
  <main>
    <BoardContainer
      v-bind:key="boardStateKey"
      :board="game.getUBF()"
      :tempTiles="tempTiles"
      ref="boardContainerRef"
    />
    <div id="tileRack" class="container mx-auto">
      <p class="text-4xl"><span>Tiles: </span>{{ tiles }}</p>
    </div>
    <TileBagContainer v-bind:key="tileBagKey" :tileBag="game.getTileBag()" />
  </main>
</template>

<style scoped></style>
