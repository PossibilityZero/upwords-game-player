<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import ReservedTilesControls from './components/ReservedTilesControls.vue'
import PlayerDisplay from './components/PlayerDisplay.vue'
import PlaysList from './components/PlaysList.vue'
import SaveManager from './components/SaveManager.vue'
import { ref } from 'vue'
import { PlayDirection, UBFHelper, UpwordsGame, TileSet } from 'upwords-toolkit'
import { wordList } from './wordList'

const game = new UpwordsGame(wordList, 2, true)
const automaticDraw = ref(false)
const tileBagKey = ref(0)
const reservedTileBagKey = ref(0)
let tempDisplayFromPlayList = false
const tempTiles = new Map()
const filterType = ref('only')
const filterTiles = new Set()
const saveManagerRef = ref(null)
const boardContainerRef = ref(null)
const playerDisplayRef = ref(null)
const playListRef = ref(null)

function startNewGame(playerCount) {
  const newGameState = new UpwordsGame(wordList, playerCount, !automaticDraw.value).serialize()
  game.loadGameFromSerialized(newGameState)
  resetAllComponents()
}

function loadGame(serialized) {
  game.loadGameFromSerialized(serialized)
  automaticDraw.value = game.automaticDraw
  resetAllComponents(false)
}

function updateAutoDraw() {
  game.automaticDraw = automaticDraw.value
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
    console.debug(game.checkMove(play))
    game.returnSpecificTiles(game.currentPlayer, play.tiles)
    game.drawSpecificTiles(game.currentPlayer, currentTilesString)
  } else {
    game.playMove(play)
  }
  refreshGameComponents()
}

function swapTile() {
  const { playerId, letter } = playerDisplayRef.value.getActiveTile()
  if (game.currentPlayer === playerId && game.getTileBag().tileCount > 0 && letter) {
    game.skipTurn()
    game.returnSpecificTiles(playerId, letter)
    game.setAsideTiles(letter) // reserve the returned tile while drawing, so as not to draw it back
    game.drawRandomTiles(playerId, 1)
    game.returnReservedTiles(letter)
    refreshGameComponents()
  }
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
    e.preventDefault()
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
  boardContainerRef.value.update()
}

function clearCandidateFromPlayList() {
  if (tempDisplayFromPlayList) {
    tempTiles.clear()
    boardContainerRef.value.update()
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

function toggleFilterTile(x, y) {
  const coordString = `coord-${x}-${y}`
  if (filterTiles.has(coordString)) {
    filterTiles.delete(coordString)
  } else {
    filterTiles.add(coordString)
  }
  refreshPlaysListFilter()
}

function clearFilter() {
  filterTiles.clear()
  refreshPlaysListFilter()
}

function refreshPlaysListFilter() {
  boardContainerRef.value.update()
  playListRef.value.update(false)
}

function refreshTileBags() {
  tileBagKey.value++
  reservedTileBagKey.value++
}

function refreshGameComponents() {
  tempTiles.clear()
  boardContainerRef.value.update()
  tileBagKey.value++
  reservedTileBagKey.value++
  playListRef.value.update()
  playerDisplayRef.value.update()
}

function resetAllComponents(resetFilters = true) {
  if (resetFilters) {
    filterTiles.clear()
  }
  playerDisplayRef.value.reset()
  saveManagerRef.value.reset()
  refreshGameComponents()
}

document.body.classList.add('bg-slate-100')
</script>

<template>
  <main class="px-2">
    <div
      class="max-w-[450px] sm:container mx-auto my-2 grid grid-flow-row grid-cols-1 lg:grid-cols-[2fr_3fr] 2xl:grid-cols-[2fr_4fr_2fr] place-content-center gap-2"
    >
      <BoardContainer
        :board="game.getUBF()"
        :tempTiles="tempTiles"
        :filterTiles="filterTiles"
        :filterType="filterType"
        ref="boardContainerRef"
        class="row-start-1 row-span-2 mx-auto row-start-1 lg:col-start-2"
        @grab-focus="focusBoard"
        @toggle-filter-tile="toggleFilterTile"
      />
      <div class="lg:col-start-2 2xl:col-start-2 2xl:row-start-3">
        <button
          class="bg-slate-300 rounded-md px-2 py-1 mr-2 hover:bg-slate-400 hover:cursor-pointer"
          @click="skipTurn"
        >
          Skip turn
        </button>
        <button
          class="bg-slate-300 rounded-md px-2 py-1 mx-2 hover:bg-slate-400 hover:cursor-pointer"
          @click="swapTile"
        >
          Swap tile
        </button>
        <button
          class="bg-slate-300 rounded-md px-2 py-1 mx-2 hover:bg-slate-400 hover:cursor-pointer"
          @click="undoTurn"
        >
          Undo turn
        </button>

        <div class="mt-2">
          <label class="inline-flex items-center cursor-pointer">
            <input
              @change="updateAutoDraw"
              v-model="automaticDraw"
              type="checkbox"
              value=""
              class="sr-only peer"
            />
            <div
              class="relative w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
            ></div>
            <span class="ms-2">Automatic Tile Draw</span>
          </label>
        </div>
      </div>
      <PlayerDisplay
        class="mx-auto max-w-2/3 row-span-1 w-full lg:col-start-2"
        :game="game"
        ref="playerDisplayRef"
        @grab-focus="focusTileRack"
        @draw-tile="drawTile"
        @return-tile="returnTile"
      />
      <PlaysList
        ref="playListRef"
        class="lg:col-start-1 lg:row-start-1 2xl:col-start-1 2xl:row-start-1"
        :game="game"
        :filterTiles="filterTiles"
        v-model="filterType"
        @clear-filter="clearFilter"
        @view-candidate="viewCandidate"
        @play-candidate="placeCandidate"
        @clear-candidate="clearCandidateFromPlayList"
      />
      <div class="col-start-1 row-span-2 lg:row-start-3 2xl:col-start-3 2xl:row-start-1">
        <TileBagContainer
          v-bind:key="tileBagKey"
          :tile-bag="game.getTileBag()"
          :show-all-letters="true"
        />
        <ReservedTilesControls
          class="mt-3"
          :game="game"
          @reserved-tiles-updated="refreshTileBags"
        />
        <TileBagContainer
          v-bind:key="reservedTileBagKey"
          :tile-bag="game.getReservedTiles()"
          :override-title="'Reserved'"
          class="mt-3"
        />
      </div>
      <SaveManager
        ref="saveManagerRef"
        class="col-start-1 2xl:col-start-3"
        :game="game"
        @new-game="startNewGame"
        @load-game="loadGame"
      />
    </div>
  </main>
</template>

<style scoped></style>
