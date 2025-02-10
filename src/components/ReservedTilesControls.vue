<script setup>
import { ref } from 'vue'
import { UpwordsGame } from 'upwords-toolkit'

const props = defineProps({
  game: UpwordsGame,
})

const emit = defineEmits(['reservedTilesUpdated'])
const game = props.game
const reserveTileString = ref('')

function reserveTilesFromUI() {
  const success = game.setAsideTiles(reserveTileString.value)
  if (success) {
    reserveTileString.value = ''
    emit('reservedTilesUpdated')
  }
}

function returnSpecificReserved() {
  const success = game.returnReservedTiles(reserveTileString.value)
  if (success) {
    reserveTileString.value = ''
    emit('reservedTilesUpdated')
  }
}

function returnAllReserved() {
  game.returnAllReservedTiles()
  reserveTileString.value = ''
  emit('reservedTilesUpdated')
}
</script>

<template>
  <div>
    <input
      name="reserveTileString"
      v-model="reserveTileString"
      type="text"
      class="px-1 mx-1 w-50 rounded bg-white"
    />
    <button
      @click.prevent="reserveTilesFromUI"
      title="Reserve tiles"
      class="bg-slate-300 rounded-md p-1 ml-2 hover:bg-slate-400 hover:cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <button
      @click.prevent="returnSpecificReserved"
      title="Return reserved"
      class="bg-slate-300 rounded-md p-1 mx-2 hover:bg-slate-400 hover:cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <button
      @click.prevent="returnAllReserved"
      class="bg-slate-600 text-white rounded-md px-2 hover:bg-slate-900 hover:cursor-pointer"
    >
      Return All
    </button>
  </div>
</template>

<style scoped></style>
