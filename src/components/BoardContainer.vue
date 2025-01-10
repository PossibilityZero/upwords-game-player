<script setup>
import BoardTile from './BoardTile.vue'
import { UBFHelper as UBF } from 'upwords-toolkit'
import { reactive } from 'vue'

const props = defineProps({
  board: Array,
  tempTiles: Map,
})

let tempTiles = props.tempTiles

const xCoord = (tileNum) => Math.floor(tileNum / 10)
const yCoord = (tileNum) => tileNum % 10

const boardTiles = reactive([])
const randNum = Math.random()
for (let i = 0; i < 100; i++) {
  const x = xCoord(i)
  const y = yCoord(i)
  const getTempVal = () => tempTiles.get(`coord-${x}-${y}`)?.letter
  boardTiles.push({
    key: i + randNum,
    coordString: `coord-${x}-${y}`,
    x,
    y,
    get height() {
      return UBF.getHeightAt(props.board, [x, y]) + (getTempVal() ? 1 : 0)
    },
    get letter() {
      return getTempVal() || UBF.getLetterAt(props.board, [x, y])
    },
    get isTemp() {
      return !!getTempVal()
    },
    active: false,
  })
}

function selectTile(e) {
  deactivateAllTiles()
  activateTile(e.currentTarget.dataset.tileX, e.currentTarget.dataset.tileY)
}

function activateTile(x, y) {
  const tileNum = 10 * Number(x) + Number(y)
  boardTiles[tileNum].active = true
}

function deactivateAllTiles() {
  boardTiles.forEach((tile) => (tile.active = false))
}

function handleBoardInput(key) {
  const activeTile = boardTiles.find((tile) => tile.active)
  if (!activeTile) {
    return
  }

  const letter = key.toUpperCase()
  if (key === 'Escape') {
    activeTile.active = false
    activeTile.key++
  } else if (key === 'Backspace') {
    tempTiles.delete(activeTile.coordString)
    activeTile.key++
  } else if (key.startsWith('Arrow')) {
    activeTile.active = false
    let newX = activeTile.x
    let newY = activeTile.y
    switch (key) {
      case 'ArrowUp':
        newX = Math.max(activeTile.x - 1, 0)
        break
      case 'ArrowDown':
        newX = Math.min(activeTile.x + 1, 9)
        break
      case 'ArrowLeft':
        newY = Math.max(activeTile.y - 1, 0)
        break
      case 'ArrowRight':
        newY = Math.min(activeTile.y + 1, 9)
        break
    }
    activateTile(newX, newY)
    return
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(letter)) {
    tempTiles.set(activeTile.coordString, { letter, x: activeTile.x, y: activeTile.y })
    activeTile.key++
  }
}

defineExpose({
  handleBoardInput,
})
</script>

<template>
  <div
    id="board-container"
    class="mx-auto w-2/3 min-w-96 max-w-3xl aspect-square border border-gray-400 px-2 py-2"
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
        :temp="tile.isTemp"
        v-bind:data-tile-num="index"
        v-bind:data-tile-x="xCoord(index)"
        v-bind:data-tile-y="yCoord(index)"
      />
    </div>
  </div>
</template>

<style scoped></style>
