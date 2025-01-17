<script setup>
import { TileSet } from 'upwords-toolkit'
import RackTile from './RackTile.vue'
import { reactive } from 'vue'

const props = defineProps({
  rack: Object,
  tileBag: Object,
})

function canDraw(letter, returnLetter) {
  return letter !== returnLetter && props.tileBag.hasTiles(TileSet.tilesFromString(letter))
}

const emit = defineEmits(['grabFocus', 'drawTile', 'returnTile'])

const rackTiles = reactive([])
;(function populateRackTiles(rack, tileRack) {
  rack.length = 0
  const currentTiles = tileRack.listTiles()
  for (let i = 0; i < 7; i++) {
    if (i < currentTiles.length) {
      rack.push({ id: i, key: Math.random(), active: false, letter: currentTiles[i] })
    } else {
      rack.push({ id: i, key: Math.random(), active: false, letter: '' })
    }
  }
})(rackTiles, props.rack)

function select(tile) {
  deactivateAllTiles()
  tile.active = true
  console.log(tile)
  emit('grabFocus')
}

function deactivateAllTiles() {
  rackTiles.forEach((tile) => (tile.active = false))
}

function activateTile(id) {
  rackTiles[id].active = true
}

function moveActiveTileRight(activeTile) {
  activeTile.active = false
  activateTile(Math.min(activeTile.id + 1, 6))
}

function moveActiveTileLeft(activeTile) {
  activeTile.active = false
  activateTile(Math.max(activeTile.id - 1, 0))
}

function handleRackInput(key) {
  const activeTile = rackTiles.find((tile) => tile.active)
  if (!activeTile) {
    return
  }
  const letter = key.toUpperCase()
  const returnLetter = activeTile.letter
  if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(letter) && canDraw(letter, returnLetter)) {
    activeTile.letter = letter
    moveActiveTileRight(activeTile)
    emit('drawTile', letter, returnLetter)
  } else if (key === 'Backspace') {
    if (returnLetter.length > 0) {
      activeTile.letter = ''
      emit('returnTile', returnLetter)
    } else {
      moveActiveTileLeft(activeTile)
      const newActiveTile = rackTiles.find((tile) => tile.active)
      emit('returnTile', newActiveTile.letter)
      newActiveTile.letter = ''
    }
  } else if (key.startsWith('Arrow')) {
    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        moveActiveTileLeft(activeTile)
        break
      case 'ArrowDown':
      case 'ArrowRight':
        moveActiveTileRight(activeTile)
        break
    }
  }
}

function unfocus() {
  deactivateAllTiles()
}

defineExpose({
  handleRackInput,
  unfocus,
})
</script>

<template>
  <div class="grid grid-cols-7 grid-rows-1 gap-1 content-between h-20 bg-zinc-200">
    <RackTile
      v-for="(tile, index) in rackTiles"
      :id="`rack-tile-${index}`"
      :key="tile.key"
      :letter="tile.letter"
      :active="tile.active"
      @click="select(tile)"
    />
  </div>
</template>

<style scoped></style>
