<script setup>
const props = defineProps({
  tileBag: Object,
  overrideTitle: String,
  showAllLetters: Boolean,
})

const defaultTitle = 'Tile Bag'
const tileBag = props.tileBag
const title = props.overrideTitle || defaultTitle
const displayLetters = props.showAllLetters
  ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  : props.tileBag.listLetters()
</script>

<template>
  <div
    id="tile-bag-container"
    class="container p-2 rounded-xl bg-zinc-200 w-96 xl:min-h-[5rem] max-h-[20rem]"
  >
    <div class="flex">
      <h2 class="text-3xl mb-2">{{ title }}</h2>
      <span class="text-right grow text-xl">Remaining tiles: {{ tileBag.tileCount }}</span>
    </div>
    <span
      v-for="letter in displayLetters"
      v-bind:key="letter"
      class="inline-block font-mono pr-4 text-3xl"
      :class="tileBag.getLetter(letter) > 0 ? '' : 'opacity-30'"
    >
      <span class="font-bold">{{ letter }} </span>
      <span
        class="pl-2 pr-9 text-xl"
        :class="tileBag.getLetter(letter) > 0 ? 'text-gray-600' : 'text-red-600'"
        >{{ tileBag.getLetter(letter) }}</span
      >
    </span>
  </div>
</template>

<style scoped></style>
