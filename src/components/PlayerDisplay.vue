<script setup>
import { ref } from 'vue'
import TileRack from './TileRack.vue'

const props = defineProps({
  game: Object,
})

const emit = defineEmits(['grabFocus', 'drawTile', 'returnTile'])

const players = ref([])
const tileRackRef = ref(null)
const playerDisplayKey = ref(0)

;(function init() {
  reset()
})()

function handleInput(key) {
  tileRackRef.value.forEach((rack) => rack.handleRackInput(key))
}

function unfocus(exclude) {
  tileRackRef.value.forEach((rack) => rack.unfocus(exclude))
}

function getActiveTile() {
  return (
    tileRackRef.value.map((rack) => rack.getActiveTile()).find((tile) => tile.letter) || {
      playerId: null,
      letter: null,
    }
  )
}

function reset() {
  players.value.length = 0
  for (let i = 0; i < props.game.playerCount; i++) {
    players.value.push({
      id: i,
      key: Math.random(),
    })
  }
  playerDisplayKey.value++
}

function update() {
  players.value.forEach((player) => player.key++)
}

defineExpose({ reset, update, unfocus, handleInput, getActiveTile })
</script>

<template>
  <div :key="playerDisplayKey">
    <div class="my-2" v-for="player in players" :key="player.key">
      <TileRack
        :rack="game.getTiles(player.id)"
        :tile-bag="game.getTileBag()"
        :player-id="player.id"
        :active="game.currentPlayer === player.id"
        ref="tileRackRef"
        @grab-focus="(x) => emit('grabFocus', x)"
        @draw-tile="(a, b, c) => emit('drawTile', a, b, c)"
        @return-tile="(x, y) => emit('returnTile', x, y)"
      />
      <div>Player {{ player.id + 1 }}: {{ game.getScore(player.id) }}</div>
    </div>
  </div>
</template>

<style scoped></style>
