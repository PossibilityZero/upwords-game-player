<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import TileRack from './components/TileRack.vue'
import PlaysList from './components/PlaysList.vue'
import { ref } from 'vue'
import { PlayDirection, UBFHelper, UpwordsGame, TileSet } from 'upwords-toolkit'
import { wordList } from './wordList'

const game = new UpwordsGame(wordList, 2, true)
const boardStateKey = ref(0)
const tileBagKey = ref(0)
const tempTiles = new Map()
const boardContainerRef = ref(null)
const tileRackRef = ref(null)
const playListRef = ref(null)
const players = ref([])
const savedGames = Object.keys(JSON.parse(localStorage.getItem('saved-games') || {}))

for (let i = 0; i < game.playerCount; i++) {
  players.value.push({
    id: i,
    key: Math.random(),
  })
}

function playMove(play) {
  if (!game.checkMove(play, true).isValid) {
    return
  }
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
  boardStateKey.value += 1
  tileBagKey.value += 1
  playListRef.value.update()
  players.value.forEach((player) => player.key++)
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
    tileRackRef.value.forEach((rack) => rack.handleRackInput(e.key))
    boardContainerRef.value.handleBoardInput(e.key)
  } else if (e.key.startsWith('Arrow') || e.key === ' ') {
    e.preventDefault()
    tileRackRef.value.forEach((rack) => rack.handleRackInput(e.key))
    boardContainerRef.value.handleBoardInput(e.key)
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(e.key.toUpperCase())) {
    tileRackRef.value.forEach((rack) => rack.handleRackInput(e.key))
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
  tileRackRef.value.forEach((rack) => rack.unfocus(id))
  boardContainerRef.value.unfocus()
}

function focusBoard() {
  tileRackRef.value.forEach((rack) => rack.unfocus())
}

function saveGame() {
  const gameId = `saved-game_${new Date().toISOString()}`
  const savedGames = JSON.parse(localStorage.getItem('saved-games')) || {}
  savedGames[gameId] = game.serialize()
  localStorage.setItem('saved-games', JSON.stringify(savedGames))
}
document.body.classList.add('bg-slate-100')

function loadGame(id) {
  const savedGames = JSON.parse(localStorage.getItem('saved-games')) || {}
  game.loadGameFromSerialized(savedGames[id])
  boardStateKey.value += 1
  tileBagKey.value += 1
  playListRef.value.update()
  players.value.forEach((player) => player.key++)
}

function deleteSave(id) {
  const savedGames = JSON.parse(localStorage.getItem('saved-games')) || {}
  delete savedGames[id]
  localStorage.setItem('saved-games', JSON.stringify(savedGames))
}
</script>

<template>
  <header>
    <div class="container mx-auto">
      <h1 class="my-4 text-5xl font-extrabold leading-none">Upwords Game</h1>
    </div>
  </header>
  <main>
    <div
      class="xl:px-4 sm:mx-4 my-2 grid auto-rows-auto auto-cols-auto place-content-center lg:gap-5"
    >
      <button class="p-2 bg-slate-400" @click="saveGame">Save game</button>
      <div>
        <li class="my-2" v-for="(saved, index) in savedGames" :key="index">
          {{ saved }}
          <button class="bg-slate-200" @click="loadGame(saved)">load save</button>
          <button class="bg-slate-200" @click="deleteSave(saved)">delete save</button>
        </li>
      </div>
      <BoardContainer
        v-bind:key="boardStateKey"
        :board="game.getUBF()"
        :tempTiles="tempTiles"
        ref="boardContainerRef"
        class="row-start-1 row-span-4 2xl:w-[48rem] mx-auto md:row-start-1 md:col-start-2"
        @grab-focus="focusBoard"
      />
      <div
        class="container mx-auto my-2 w-1/2 max-w-lg min-w-64 row-span-1 lg:w-[20rem] 2xl:w-[32rem] md:col-start-2"
        :class="
          index === 0
            ? 'row-start-5'
            : index === 1
              ? 'row-start-6'
              : index === 2
                ? 'row-start-7'
                : 'row-start-8'
        "
        v-for="(player, index) in players"
        :key="player.key"
      >
        <TileRack
          :rack="game.getTiles(player.id)"
          :tile-bag="game.getTileBag()"
          :player-id="player.id"
          :active="game.currentPlayer === player.id"
          ref="tileRackRef"
          @grab-focus="focusTileRack"
          @draw-tile="drawTile"
          @return-tile="returnTile"
        />
        <div>Player {{ player.id + 1 }}: {{ game.getScore(player.id) }}</div>
      </div>
      <TileBagContainer
        v-bind:key="tileBagKey"
        :tile-bag="game.getTileBag()"
        class="container row-start-7 row-span-2 max-w-96 md:row-start-1 md:col-span-1 md:col-start-3"
      />
      <PlaysList
        :game="game"
        ref="playListRef"
        class="row-start-9 row-span-2 md:col-start-1 md:row-start-1 md:row-span-5"
        @view-candidate="viewCandidate"
        @play-candidate="placeCandidate"
        @clear-candidate="clearCandidate"
      />
    </div>
  </main>
</template>

<style scoped></style>
