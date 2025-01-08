<script setup>
defineProps({
  letter: String,
  height: Number,
})
</script>

<template>
  <div
    class="text-center"
    :class="`border${height === 5 ? '-4' : ''} border-gray-${height > 0 ? 500 : 200}`"
  >
    <div class="grid grid-cols-4 grid-rows-4 aspect-square">
      <div
        class="row-start-2 col-start-1 row-span-3 col-span-3 text-xl sm:text-2xl md:text-4xl sm:font-bold align-middle"
      >
        {{ letter }}
      </div>
      <span
        class="row-start-1 col-start-4 text-xs font-bold lg:text-sm"
        :class="`text-gray-${400 + height * 100}`"
        >{{ height > 0 ? height : '' }}</span
      >
    </div>
  </div>
</template>

<style scoped></style>
