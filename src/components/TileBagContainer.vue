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
  <div id="tile-bag-container" class="container p-2 rounded-xl bg-zinc-200">
    <div class="flex">
      <h2 class="text-3xl mb-2">{{ title }}</h2>
      <span class="text-right grow text-xl">Count: {{ tileBag.tileCount }}</span>
    </div>
    <div class="flex flex-wrap justify-start">
      <span
        v-for="letter in displayLetters"
        v-bind:key="letter"
        class="inline-block font-mono px-3 text-3xl"
        :class="tileBag.getLetter(letter) > 0 ? '' : 'opacity-30'"
      >
        <span class="font-bold">{{ letter }} </span>
        <span
          class="pl-1 text-base"
          :class="tileBag.getLetter(letter) > 0 ? 'text-gray-600' : 'text-red-600'"
          >{{ tileBag.getLetter(letter) }}</span
        >
      </span>
    </div>
  </div>
</template>

<style scoped></style>
