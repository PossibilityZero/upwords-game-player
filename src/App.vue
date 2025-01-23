<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import PlayerDisplay from './components/PlayerDisplay.vue'
import PlaysList from './components/PlaysList.vue'
import SaveManager from './components/SaveManager.vue'
import { ref } from 'vue'
import { PlayDirection, UBFHelper, UpwordsGame, TileSet } from 'upwords-toolkit'
import { wordList } from './wordList'

const game = new UpwordsGame(wordList, 2, true)
const boardStateKey = ref(0)
const tileBagKey = ref(0)
let tempDisplayFromPlayList = false
const tempTiles = new Map()
const saveManagerRef = ref(null)
const boardContainerRef = ref(null)
const playerDisplayRef = ref(null)
const playListRef = ref(null)

function startNewGame(playerCount, manualTiles) {
  const newGameState = new UpwordsGame(wordList, playerCount, manualTiles).serialize()
  game.loadGameFromSerialized(newGameState)
  resetAllComponents()
}

function loadGame(serialized) {
  game.loadGameFromSerialized(serialized)
  refreshGameComponents()
}

function playMove(play) {
  const playTiles = TileSet.tilesFromString(play.tiles)
  const currentPlayerRack = game.getTiles(game.currentPlayer)
  const currentTilesString = currentPlayerRack.listTiles()
  if (!currentPlayerRack.hasTiles(playTiles)) {
    game.returnSpecificTiles(game.currentPlayer, currentTilesString)
    const canDraw = game.drawSpecificTiles(game.currentPlayer, play.tiles)
    if (!canDraw) {
      console.log('not enough tiles')
      game.drawSpecificTiles(game.currentPlayer, currentTilesString)
      return
    }
  }
  if (!game.checkMove(play).isValid) {
    console.log(game.checkMove(play))
    game.returnSpecificTiles(game.currentPlayer, play.tiles)
    game.drawSpecificTiles(game.currentPlayer, currentTilesString)
  } else {
    game.playMove(play)
    tempTiles.clear()
  }
  refreshGameComponents()
}

function skipTurn() {
  game.skipTurn()
  refreshGameComponents()
}

function undoTurn() {
  game.undoTurn()
  refreshGameComponents()
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

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.metaKey) {
    return
  }
  if (['Escape', 'Backspace'].includes(e.key)) {
    playerDisplayRef.value.handleInput(e.key)
    boardContainerRef.value.handleBoardInput(e.key)
  } else if (e.key.startsWith('Arrow') || e.key === ' ') {
    e.preventDefault()
    playerDisplayRef.value.handleInput(e.key)
    boardContainerRef.value.handleBoardInput(e.key)
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(e.key.toUpperCase())) {
    playerDisplayRef.value.handleInput(e.key)
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
  tempDisplayFromPlayList = true
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

function clearCandidateFromPlayList() {
  if (tempDisplayFromPlayList) {
    tempTiles.clear()
    boardStateKey.value += 1
    tempDisplayFromPlayList = false
  }
}

function drawTile(player, tile, returnTile = '') {
  if (returnTile.length > 0) {
    game.returnSpecificTiles(player, returnTile)
  }
  game.drawSpecificTiles(player, tile)
  playListRef.value.update()
  tileBagKey.value++
}

function returnTile(player, returnTile) {
  if (returnTile.length > 0) {
    game.returnSpecificTiles(player, returnTile)
  }
  playListRef.value.update()
  tileBagKey.value++
}

function focusTileRack(id) {
  playerDisplayRef.value.unfocus(id)
  boardContainerRef.value.unfocus()
}

function focusBoard() {
  playerDisplayRef.value.unfocus()
}

function refreshGameComponents() {
  boardStateKey.value += 1
  tileBagKey.value += 1
  playListRef.value.update()
  playerDisplayRef.value.update()
}

function resetAllComponents() {
  boardStateKey.value += 1
  tileBagKey.value += 1
  playListRef.value.update()
  playerDisplayRef.value.reset()
  saveManagerRef.value.reset()
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
    <div
      class="xl:px-4 sm:mx-4 my-2 grid auto-rows-auto auto-cols-auto place-content-center gap-2 lg:gap-5"
    >
      <BoardContainer
        v-bind:key="boardStateKey"
        :board="game.getUBF()"
        :tempTiles="tempTiles"
        ref="boardContainerRef"
        class="row-start-1 row-span-2 2xl:w-[48rem] mx-auto md:row-start-1 md:col-start-2"
        @grab-focus="focusBoard"
      />
      <div class="xl:col-start-2 xl:row-start-3">
        <button class="bg-slate-300 rounded-lg p-2 hover:bg-slate-400" @click="skipTurn">
          Skip turn
        </button>
        <button class="bg-slate-300 rounded-lg p-2 mx-2 hover:bg-slate-400" @click="undoTurn">
          Undo turn
        </button>
      </div>
      <PlayerDisplay
        class="container mx-auto max-w-lg min-w-64 row-span-1 lg:w-[20rem] 2xl:w-[32rem] md:col-start-2"
        :game="game"
        ref="playerDisplayRef"
        @grab-focus="focusTileRack"
        @draw-tile="drawTile"
        @return-tile="returnTile"
      />
      <TileBagContainer
        v-bind:key="tileBagKey"
        :tile-bag="game.getTileBag()"
        class="container xl:row-start-1 xl:col-start-3"
      />
      <PlaysList
        ref="playListRef"
        class="row-start-9 row-span-2 md:col-start-1 md:row-start-1 md:row-span-5"
        :game="game"
        @view-candidate="viewCandidate"
        @play-candidate="placeCandidate"
        @clear-candidate="clearCandidateFromPlayList"
      />
      <SaveManager
        ref="saveManagerRef"
        class="xl:col-start-3 xl:row-start-2 row-span-3"
        :game="game"
        @new-game="startNewGame"
        @load-game="loadGame"
      />
    </div>
  </main>
</template>

<style scoped></style>
