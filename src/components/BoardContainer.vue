<script setup>
import BoardTile from './BoardTile.vue'
import { UBFHelper as UBF } from 'upwords-toolkit'
import { reactive } from 'vue'

const props = defineProps({
  board: Array,
})

const tempTiles = new Map()

const xCoord = (tileNum) => Math.floor(tileNum / 10)
const yCoord = (tileNum) => tileNum % 10
const letterAt = (x, y) => {
  const tempValue = tempTiles.get(`coord-${x}-${y}`)
  if (tempValue) {
    return tempValue
  }
  return UBF.getLetterAt(props.board, [x, y])
}
const heightAt = (x, y) => {
  if (tempTiles.get(`coord-${x}-${y}`)) {
    return UBF.getHeightAt(props.board, [x, y]) + 1
  } else {
    return UBF.getHeightAt(props.board, [x, y])
  }
}

const boardTiles = reactive([])
for (let i = 0; i < 100; i++) {
  const x = xCoord(i)
  const y = yCoord(i)
  boardTiles.push({
    key: i * 0.001,
    coordString: `coord-${x}-${y}`,
    x: xCoord(i),
    y: yCoord(i),
    get height() {
      return heightAt(x, y)
    },
    get letter() {
      return letterAt(x, y)
    },
    get isTemp() {
      return !!tempTiles.get(`coord-${x}-${y}`)
    },
    active: false,
  })
}

function highlightSquare(e) {
  deactivateAllSquares()
  boardTiles[e.currentTarget.dataset.tileNum].active = true
}

function deactivateAllSquares() {
  boardTiles.filter((tile) => tile.active).forEach((tile) => (tile.active = false))
}

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') {
    return
  }
  const activeTile = boardTiles.find((tile) => tile.active)
  if (!activeTile) {
    return
  }

  console.log(e)
  const letter = e.key.toUpperCase()

  if (e.key === 'Escape') {
    activeTile.active = false
    activeTile.key++
  } else if (e.key === 'Backspace') {
    tempTiles.delete(activeTile.coordString)
    activeTile.key++
  } else if (e.key.startsWith('Arrow')) {
    e.preventDefault()
    activeTile.active = false
    let newX, newY
    switch (e.key) {
      case 'ArrowUp':
        newX = Math.max(activeTile.x - 1, 0)
        newY = activeTile.y
        break
      case 'ArrowDown':
        newX = Math.min(activeTile.x + 1, 9)
        newY = activeTile.y
        break
      case 'ArrowLeft':
        newX = activeTile.x
        newY = Math.max(activeTile.y - 1, 0)
        break
      case 'ArrowRight':
        newX = activeTile.x
        newY = Math.min(activeTile.y + 1, 9)
        break
      default:
        newX = activeTile.x
        newY = activeTile.y
    }
    console.log(newX, newY)
    const newTile = boardTiles.find((tile) => tile.x === newX && tile.y === newY)
    newTile.active = true
    return
  } else if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(letter)) {
    tempTiles.set(activeTile.coordString, letter)
    activeTile.key++
  }
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
        @click="highlightSquare"
        :id="`coord-${xCoord(index)}-${yCoord(index)}`"
        :key="tile.key"
        :height="tile.height"
        :letter="tile.letter"
        :active="tile.active"
        :temp="tile.isTemp"
        v-bind:data-tile-num="index"
      />
    </div>
  </div>
</template>

<style scoped></style>
