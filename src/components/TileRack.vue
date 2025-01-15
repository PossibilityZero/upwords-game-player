<script setup>
import BoardTile from './BoardTile.vue'

defineProps({
  rackTiles: Array,
})
</script>

<template>
  <div class="grid grid-cols-7 grid-rows-1 gap-1 content-between">
    <BoardTile
      v-for="(tile, index) in rackTiles"
      :id="`rack-tile-${index}`"
      :key="tile.key"
      :height="1"
      :letter="tile.letter"
    />
  </div>
</template>

<style scoped></style>
