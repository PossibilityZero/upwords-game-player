<script setup>
import BoardContainer from './components/BoardContainer.vue'
import BoardTile from './components/BoardTile.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import { ref, reactive } from 'vue'
import { PlayDirection, UpwordsGame } from 'upwords-toolkit'

const game = new UpwordsGame(1)
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

function playMove(play) {
  console.log(play)
  if (!game.checkMove(play).isValid) {
    return
  }
  game.playMove(play)
  boardStateKey.value += 1
  tileBagKey.value += 1
  tempTiles.clear()
  populateRackTiles(rackTiles, tileRack1)
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

document.body.classList.add('bg-slate-100')
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
    <div id="tileRack" class="container mx-auto my-2 w-1/2 max-w-lg min-w-64">
      <div class="grid grid-cols-7 grid-rows-1 gap-1 content-between">
        <BoardTile
          v-for="(tile, index) in rackTiles"
          :id="`rack-tile-${index}`"
          :key="tile.key"
          :height="1"
          :letter="tile.letter"
        />
      </div>
    </div>
    <TileBagContainer v-bind:key="tileBagKey" :tileBag="game.getTileBag()" />
  </main>
</template>

<style scoped></style>
