<script setup>
import { ref } from 'vue'
import { UpwordsGame } from 'upwords-toolkit'

const props = defineProps({
  game: UpwordsGame,
})

const emit = defineEmits(['reservedTilesUpdated'])
const game = props.game
const reserveTileString = ref('')
const returnTileString = ref('')

function reserveTilesFromUI() {
  const success = game.setAsideTiles(reserveTileString.value)
  if (success) {
    reserveTileString.value = ''
    emit('reservedTilesUpdated')
  }
}

function returnSpecificReserved() {
  const success = game.returnReservedTiles(returnTileString.value)
  if (success) {
    returnTileString.value = ''
    emit('reservedTilesUpdated')
  }
}

function returnAllReserved() {
  game.returnAllReservedTiles()
  returnTileString.value = ''
  emit('reservedTilesUpdated')
}
</script>

<template>
  <div>
    <form @submit.prevent="reserveTilesFromUI">
      <label for="reserveTileString">Reserve tiles:</label><br />
      <input
        name="reserveTileString"
        v-model="reserveTileString"
        type="text"
        class="px-1 mx-1 w-50 rounded bg-white"
      />
      <button class="bg-slate-300 rounded-md px-2 mx-2 hover:bg-slate-400 hover:cursor-pointer">
        Reserve
      </button>
    </form>
    <form @submit.prevent="returnSpecificReserved">
      <label for="returnTileString">Return tiles:</label><br />
      <input v-model="returnTileString" type="text" class="px-1 mx-1 w-50 rounded bg-white" />
      <button class="bg-slate-300 rounded-md px-2 mx-2 hover:bg-slate-400 hover:cursor-pointer">
        Return
      </button>
      <button
        @click.prevent="returnAllReserved"
        class="bg-slate-600 text-white rounded-md px-2 hover:bg-slate-900 hover:cursor-pointer"
      >
        Return All
      </button>
    </form>
  </div>
</template>

<style scoped></style>
