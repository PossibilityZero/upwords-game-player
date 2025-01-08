<script setup>
import BoardTile from './BoardTile.vue'
import { UBFHelper as UBF } from 'upwords-toolkit'

const props = defineProps({
  board: Array,
})

const xCoord = (tileNum) => Math.floor(tileNum / 10)
const yCoord = (tileNum) => tileNum % 10
const letterAt = (x, y) => {
  return UBF.getLetterAt(props.board, [x, y])
}
const heightAt = (x, y) => {
  return UBF.getHeightAt(props.board, [x, y])
}
</script>

<template>
  <div
    id="board-container"
    class="mx-auto w-2/3 min-w-96 max-w-3xl aspect-square border border-gray-400 px-2 py-2"
  >
    <div class="grid grid-cols-10 grid-rows-10 gap-1 aspect-square content-between">
      <BoardTile
        v-for="(n, i) in 100"
        :id="`coord-${xCoord(i)}-${yCoord(i)}`"
        v-bind:key="n"
        :height="heightAt(xCoord(i), yCoord(i))"
        :letter="letterAt(xCoord(i), yCoord(i))"
      />
    </div>
  </div>
</template>

<style scoped></style>
