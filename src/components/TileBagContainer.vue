<script setup>
const props = defineProps({
  tileBag: Object,
})

const tileBag = props.tileBag
</script>

<template>
  <div id="tile-bag-container" class="container mx-auto my-8">
    <h2 class="text-3xl">Tile Bag:</h2>
    <h3 class="text-2xl">Remaining tiles: {{ tileBag.tileCount }}</h3>
    <span
      v-for="letter in Object.keys(tileBag.getTiles())"
      v-bind:key="letter"
      class="pr-4 text-2xl font-bold"
    >
      {{ letter }}: {{ tileBag.getLetter(letter) }}
    </span>
  </div>
</template>

<style scoped></style>
