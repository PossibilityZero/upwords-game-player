<script setup>
defineProps({
  letter: String,
  height: Number,
  active: Boolean,
  temp: Boolean,
})
</script>

<template>
  <div
    class="text-center"
    :class="`
      ${active ? 'border-4' : temp ? 'border-2' : 'border'}
      ${
        temp
          ? 'border-green-500'
          : active && height < 5
            ? 'border-green-700'
            : height > 0
              ? 'border-gray-500'
              : 'border-gray-200'
      }`"
  >
    <div class="grid grid-cols-4 grid-rows-4 aspect-square">
      <div
        class="row-start-2 col-start-1 row-span-3 col-span-3 sm:font-bold align-middle"
        :class="`${letter === 'Q' ? 'text-lg sm:text-xl md:text-3xl ' : 'text-xl sm:text-2xl md:text-4xl '}`"
      >
        {{ letter === 'Q' ? 'Qu' : letter }}
      </div>
      <span
        class="row-start-1 col-start-4 text-xs font-bold lg:text-sm"
        :class="`${temp ? 'text-green-500' : height >= 5 ? 'text-red-700' : 'text-gray-500'}`"
        >{{ height > 0 ? height : '' }}</span
      >
    </div>
  </div>
</template>

<style scoped></style>
