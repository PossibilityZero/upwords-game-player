<script setup>
import BoardTile from './BoardTile.vue'
import { UBFHelper as UBF } from 'upwords-toolkit'
import { inject, reactive } from 'vue'

const inputHorizontal = inject('inputHorizontal')
function toggleInputDirection() {
  inputHorizontal.value = !inputHorizontal.value
}

const props = defineProps({
  board: Array,
  tempTiles: Map,
  filterTiles: Set,
  filterType: String,
})

const emit = defineEmits(['grabFocus', 'toggleFilterTile'])

const tempTiles = props.tempTiles
const tempPlay = inject('tempPlay')
const filterTiles = props.filterTiles

const xCoord = (tileNum) => Math.floor(tileNum / 10)
const yCoord = (tileNum) => tileNum % 10
const boardTiles = reactive([])

;(function init() {
  update()
})()

function selectTile(e) {
  const x = e.currentTarget.dataset.tileX
  const y = e.currentTarget.dataset.tileY
  if (e.shiftKey) {
    emit('toggleFilterTile', x, y)
  } else {
    deactivateAllTiles()
    activateTile(x, y)
    emit('grabFocus')
  }
}

function activateTile(x, y) {
  const tileNum = 10 * Number(x) + Number(y)
  boardTiles[tileNum].active = true
}

function deactivateAllTiles() {
  boardTiles.forEach((tile) => (tile.active = false))
}

function moveActiveTileLeft(activeTile) {
  activeTile.active = false
  activateTile(activeTile.x, Math.max(activeTile.y - 1, 0))
}

function moveActiveTileRight(activeTile) {
  activeTile.active = false
  activateTile(activeTile.x, Math.min(activeTile.y + 1, 9))
}

function moveActiveTileUp(activeTile) {
  activeTile.active = false
  activateTile(Math.max(activeTile.x - 1, 0), activeTile.y)
}

function moveActiveTileDown(activeTile) {
  activeTile.active = false
  activateTile(Math.min(activeTile.x + 1, 9), activeTile.y)
}

function handleBoardInput(key) {
  if (key === 'Escape') {
    tempTiles.size > 0 ? tempTiles.clear() : deactivateAllTiles()
    tempPlay.value = false
  }

  const activeTile = boardTiles.find((tile) => tile.active)
  if (!activeTile) {
    return
  }

  const letter = key.toUpperCase()
  if (key === 'Tab') {
    toggleInputDirection()
  } else if (key === 'Backspace') {
    if (tempTiles.has(activeTile.coordString)) {
      tempTiles.delete(activeTile.coordString)
    } else {
      inputHorizontal.value ? moveActiveTileLeft(activeTile) : moveActiveTileUp(activeTile)
      tempTiles.delete(boardTiles.find((tile) => tile.active).coordString)
    }
    if (tempTiles.size === 0) {
      tempPlay.value = false
    }
  } else if (key === ' ') {
    inputHorizontal.value ? moveActiveTileRight(activeTile) : moveActiveTileDown(activeTile)
  } else if (key.startsWith('Arrow')) {
    switch (key) {
      case 'ArrowUp':
        moveActiveTileUp(activeTile)
        break
      case 'ArrowDown':
        moveActiveTileDown(activeTile)
        break
      case 'ArrowLeft':
        moveActiveTileLeft(activeTile)
        break
      case 'ArrowRight':
        moveActiveTileRight(activeTile)
        break
    }
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(letter)) {
    if (activeTile.currentHeight < 5 && activeTile.currentLetter !== letter) {
      tempTiles.set(activeTile.coordString, { letter, x: activeTile.x, y: activeTile.y })
      inputHorizontal.value ? moveActiveTileRight(activeTile) : moveActiveTileDown(activeTile)
      tempPlay.value = true
    } else if (activeTile.currentLetter === letter) {
      tempTiles.delete(activeTile.coordString)
      inputHorizontal.value ? moveActiveTileRight(activeTile) : moveActiveTileDown(activeTile)
    }
  }
  activeTile.key++
}

function update() {
  boardTiles.length = 0
  const randNum = Math.random()
  for (let i = 0; i < 100; i++) {
    const x = xCoord(i)
    const y = yCoord(i)
    const coordString = `coord-${x}-${y}`
    const getTempVal = () => tempTiles.get(coordString)?.letter
    boardTiles.push({
      key: (i * randNum) % 1,
      coordString,
      x,
      y,
      get currentHeight() {
        return UBF.getHeightAt(props.board, [x, y])
      },
      get height() {
        return UBF.getHeightAt(props.board, [x, y]) + (getTempVal() ? 1 : 0)
      },
      get currentLetter() {
        return UBF.getLetterAt(props.board, [x, y])
      },
      get letter() {
        return getTempVal() || UBF.getLetterAt(props.board, [x, y])
      },
      get isTemp() {
        return !!getTempVal()
      },
      active: false,
      isFilter: filterTiles.has(coordString),
    })
  }
}

function getActiveTileCoords() {
  const activeTile = boardTiles.find((tile) => tile.active)
  if (activeTile) {
    return {
      x: activeTile.x,
      y: activeTile.y,
    }
  }
}

function unfocus() {
  deactivateAllTiles()
}

defineExpose({
  getActiveTileCoords,
  handleBoardInput,
  unfocus,
  update,
})
</script>

<template>
  <div
    id="board-container"
    class="mx-auto w-full aspect-square border-2 rounded-lg border-gray-400 px-2 py-2"
  >
    <div class="grid grid-cols-10 grid-rows-10 gap-1 aspect-square content-between">
      <BoardTile
        v-for="(tile, index) in boardTiles"
        @click="selectTile"
        :id="`coord-${xCoord(index)}-${yCoord(index)}`"
        :key="tile.key"
        :height="tile.height"
        :letter="tile.letter"
        :active="tile.active"
        :isFilter="tile.isFilter"
        :filterType="props.filterType"
        :temp="tile.isTemp"
        :central="[44, 45, 54, 55].includes(index)"
        v-bind:data-tile-num="index"
        v-bind:data-tile-x="xCoord(index)"
        v-bind:data-tile-y="yCoord(index)"
      />
    </div>
  </div>
</template>

<style scoped></style>
