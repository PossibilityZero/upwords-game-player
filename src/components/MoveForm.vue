<script setup>
import { ref } from 'vue'
import { PlayDirection } from 'upwords-toolkit'

const emit = defineEmits({
  play: (p) => {
    return (
      [PlayDirection.Horizontal, PlayDirection.Vertical].includes(p.direction) && p.tiles && p.start
    )
  },
})

const word = ref('HELLO')
const startX = ref(4)
const startY = ref(3)
const direction = ref('horizontal')

function makePlay(tiles, start, direction) {
  return { tiles, start, direction }
}

function onSubmit() {
  const play = makePlay(
    word.value.toUpperCase(),
    [startX.value, startY.value],
    direction.value === 'horizontal' ? PlayDirection.Horizontal : PlayDirection.Vertical,
  )
  word.value = ''
  emit('play', play)
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="container mx-auto">
    <div class="py-2">
      <label for="word">Word: </label>
      <input name="word" type="text" v-model="word" class="border border-gray-500" />
    </div>
    <div class="py-2">
      <label for="word">x: </label>
      <input v-model.number="startX" name="x" type="text" class="border border-gray-500" />
      <label class="px-1" for="word">y: </label>
      <input v-model.number="startY" name="y" type="text" class="border border-gray-500" />
    </div>
    <div class="py-2">
      <input v-model="direction" type="radio" name="direction" value="horizontal" />
      <label for="dirHorizontal" class="px-1">Horizontal</label>
      <input v-model="direction" type="radio" name="direction" value="vertical" />
      <label for="dirVertical" class="px-1">Vertical</label>
    </div>
    <button
      type="submit"
      class="px-2 py-2 border bg-indigo-400 text-white rounded font-bold text-lg"
    >
      Play move
    </button>
  </form>
</template>

<style scoped></style>
